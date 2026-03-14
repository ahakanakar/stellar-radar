#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, vec, Address, Env, String, Symbol, Vec,
};

// ── Storage keys ──────────────────────────────────────────────────────────────

#[contracttype]
pub enum StorageKey {
    /// Vec<Review> keyed by dapp_id
    Reviews(Symbol),
}

// ── Data types ────────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub struct Review {
    pub reviewer: Address,
    pub dapp_id: Symbol,
    pub rating: u32,
    pub comment: String,
    pub timestamp: u64,
}

// ── Contract ──────────────────────────────────────────────────────────────────

#[contract]
pub struct ReviewContract;

#[contractimpl]
impl ReviewContract {
    /// Save a review on-chain.
    ///
    /// `reviewer` must sign the transaction — `require_auth()` enforces this
    /// so no one can submit a review on behalf of another address.
    /// `rating` must be in the range 1–5.
    pub fn submit_review(
        env: Env,
        reviewer: Address,
        dapp_id: Symbol,
        rating: u32,
        comment: String,
    ) {
        reviewer.require_auth();

        if rating < 1 || rating > 5 {
            panic!("rating must be between 1 and 5");
        }

        let review = Review {
            reviewer,
            dapp_id: dapp_id.clone(),
            rating,
            comment,
            timestamp: env.ledger().timestamp(),
        };

        let key = StorageKey::Reviews(dapp_id);
        let mut reviews: Vec<Review> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or(vec![&env]);

        reviews.push_back(review);
        env.storage().persistent().set(&key, &reviews);
    }

    /// Return all reviews for a given dapp.
    pub fn get_reviews(env: Env, dapp_id: Symbol) -> Vec<Review> {
        let key = StorageKey::Reviews(dapp_id);
        env.storage()
            .persistent()
            .get(&key)
            .unwrap_or(vec![&env])
    }

    /// Check whether a user has interacted with a dapp.
    ///
    /// Always returns `true` for now; Horizon on-chain verification will be
    /// added in a follow-up task.
    pub fn has_used_dapp(_env: Env, _user: Address, _dapp_id: Symbol) -> bool {
        true
    }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{
        testutils::{Address as _, Ledger},
        Env, String, Symbol,
    };

    #[test]
    fn test_submit_and_get_review() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(ReviewContract, ());
        let client = ReviewContractClient::new(&env, &contract_id);

        let reviewer = Address::generate(&env);
        let dapp_id = Symbol::new(&env, "soroswap");
        let comment = String::from_str(&env, "Great swap experience!");

        env.ledger().set_timestamp(1_000_000);
        client.submit_review(&reviewer, &dapp_id, &5, &comment);

        let reviews = client.get_reviews(&dapp_id);
        assert_eq!(reviews.len(), 1);

        let review = reviews.get(0).unwrap();
        assert_eq!(review.rating, 5);
        assert_eq!(review.reviewer, reviewer);
        assert_eq!(review.dapp_id, dapp_id);
        assert_eq!(review.timestamp, 1_000_000);
    }

    #[test]
    fn test_multiple_reviews_different_users() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(ReviewContract, ());
        let client = ReviewContractClient::new(&env, &contract_id);

        let dapp_id = Symbol::new(&env, "aquarius");
        let user_a = Address::generate(&env);
        let user_b = Address::generate(&env);

        client.submit_review(&user_a, &dapp_id, &4, &String::from_str(&env, "Good liquidity"));
        client.submit_review(&user_b, &dapp_id, &3, &String::from_str(&env, "Average fees"));

        let reviews = client.get_reviews(&dapp_id);
        assert_eq!(reviews.len(), 2);
    }

    #[test]
    fn test_reviews_isolated_per_dapp() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(ReviewContract, ());
        let client = ReviewContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        let dapp_a = Symbol::new(&env, "soroswap");
        let dapp_b = Symbol::new(&env, "blend");

        client.submit_review(&user, &dapp_a, &5, &String::from_str(&env, "Top DEX"));

        assert_eq!(client.get_reviews(&dapp_a).len(), 1);
        assert_eq!(client.get_reviews(&dapp_b).len(), 0);
    }

    #[test]
    fn test_get_reviews_empty() {
        let env = Env::default();
        let contract_id = env.register(ReviewContract, ());
        let client = ReviewContractClient::new(&env, &contract_id);

        let reviews = client.get_reviews(&Symbol::new(&env, "unknown"));
        assert_eq!(reviews.len(), 0);
    }

    #[test]
    fn test_has_used_dapp_returns_true() {
        let env = Env::default();
        let contract_id = env.register(ReviewContract, ());
        let client = ReviewContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        let dapp_id = Symbol::new(&env, "blend");
        assert!(client.has_used_dapp(&user, &dapp_id));
    }

    #[test]
    #[should_panic(expected = "rating must be between 1 and 5")]
    fn test_rating_too_high_panics() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(ReviewContract, ());
        let client = ReviewContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        let dapp_id = Symbol::new(&env, "soroswap");
        client.submit_review(&user, &dapp_id, &6, &String::from_str(&env, "Bad rating"));
    }

    #[test]
    #[should_panic(expected = "rating must be between 1 and 5")]
    fn test_rating_zero_panics() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(ReviewContract, ());
        let client = ReviewContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        let dapp_id = Symbol::new(&env, "soroswap");
        client.submit_review(&user, &dapp_id, &0, &String::from_str(&env, "Zero rating"));
    }
}
