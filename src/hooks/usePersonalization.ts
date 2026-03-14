"use client";

import { useEffect, useState } from "react";
import { getAddress } from "@stellar/freighter-api";
import type { Dapp } from "@/lib/dapps";

const HORIZON_URL = "https://horizon-testnet.stellar.org";

interface HorizonTransaction {
  id: string;
  memo_type: string;
  memo?: string;
  operation_count: number;
  created_at: string;
}

interface HorizonResponse {
  _embedded: {
    records: HorizonTransaction[];
  };
}

type CategoryScores = Record<string, number>;

const OPERATION_TYPE_SIGNALS: Record<string, Record<string, number>> = {
  manage_sell_offer: { DEX: 2 },
  manage_buy_offer: { DEX: 2 },
  create_passive_sell_offer: { DEX: 2 },
  path_payment_strict_receive: { DEX: 2 },
  path_payment_strict_send: { DEX: 2 },
  change_trust: { DeFi: 1, DEX: 1 },
  payment: { DeFi: 1 },
  invoke_host_function: { DeFi: 1, Infrastructure: 1 },
};

const MEMO_SIGNALS: Record<string, Record<string, number>> = {
  swap: { DEX: 3 },
  trade: { DEX: 2 },
  lend: { Lending: 3 },
  borrow: { Lending: 3 },
  pool: { DeFi: 2, DEX: 1 },
  bridge: { Bridge: 3 },
  stake: { DeFi: 2 },
};

function analyzeTransactions(transactions: HorizonTransaction[]): CategoryScores {
  const scores: CategoryScores = {};

  for (const tx of transactions) {
    if (tx.memo && tx.memo_type === "text") {
      const memoLower = tx.memo.toLowerCase();
      for (const [keyword, signals] of Object.entries(MEMO_SIGNALS)) {
        if (memoLower.includes(keyword)) {
          for (const [category, score] of Object.entries(signals)) {
            scores[category] = (scores[category] ?? 0) + score;
          }
        }
      }
    }

    const opCount = tx.operation_count;
    if (opCount >= 3) {
      scores["DEX"] = (scores["DEX"] ?? 0) + 1;
    }
    if (opCount >= 5) {
      scores["DeFi"] = (scores["DeFi"] ?? 0) + 1;
    }
  }

  return scores;
}

async function fetchOperationTypes(address: string): Promise<string[]> {
  try {
    const res = await fetch(
      `${HORIZON_URL}/accounts/${address}/operations?limit=200&order=desc`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return [];

    const data = await res.json();
    const records = data._embedded?.records ?? [];
    return records.map((op: { type: string }) => op.type);
  } catch {
    return [];
  }
}

function scoreFromOperations(opTypes: string[]): CategoryScores {
  const scores: CategoryScores = {};
  for (const opType of opTypes) {
    const signals = OPERATION_TYPE_SIGNALS[opType];
    if (signals) {
      for (const [category, score] of Object.entries(signals)) {
        scores[category] = (scores[category] ?? 0) + score;
      }
    }
  }
  return scores;
}

function mergeScores(...all: CategoryScores[]): CategoryScores {
  const merged: CategoryScores = {};
  for (const scores of all) {
    for (const [category, score] of Object.entries(scores)) {
      merged[category] = (merged[category] ?? 0) + score;
    }
  }
  return merged;
}

export function sortDappsByScores(dapps: Dapp[], scores: CategoryScores): Dapp[] {
  return [...dapps].sort((a, b) => {
    const scoreA = scores[a.category] ?? 0;
    const scoreB = scores[b.category] ?? 0;
    return scoreB - scoreA;
  });
}

interface PersonalizationResult {
  scores: CategoryScores;
  isPersonalized: boolean;
  loading: boolean;
}

export function usePersonalization(): PersonalizationResult {
  const [scores, setScores] = useState<CategoryScores>({});
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function analyze() {
      try {
        console.log("usePersonalization useEffect triggered");
        const addressResult = await getAddress();
        console.log("Address result:", addressResult);

        const { address, error } = addressResult;
        if (error || !address) return;

        const [txRes, opTypes] = await Promise.all([
          fetch(
            `${HORIZON_URL}/accounts/${address}/transactions?limit=200&order=desc`,
            { headers: { Accept: "application/json" } }
          ),
          fetchOperationTypes(address),
        ]);

        if (!txRes.ok) return;

        const txData = (await txRes.json()) as HorizonResponse;
        const transactions = txData._embedded?.records ?? [];

        if (transactions.length === 0 && opTypes.length === 0) return;

        const txScores = analyzeTransactions(transactions);
        const opScores = scoreFromOperations(opTypes);
        const combined = mergeScores(txScores, opScores);

        console.log("Personalization scores:", combined, "isPersonalized:", true);

        if (cancelled) return;
        setScores(combined);
        setIsPersonalized(true);
      } catch (err) {
        console.error("Personalization analysis failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    analyze();
    return () => { cancelled = true; };
  }, []);

  return { scores, isPersonalized, loading };
}
