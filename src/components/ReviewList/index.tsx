"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  Contract,
  Networks,
  TransactionBuilder,
  rpc,
  scValToNative,
  xdr,
  Account,
} from "@stellar/stellar-sdk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RPC_URL = "https://soroban-testnet.stellar.org";
const ZERO_ADDRESS = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

interface Review {
  reviewer: string;
  dapp_id: string;
  rating: number;
  comment: string;
  timestamp: bigint | number;
}

interface ReviewListProps {
  dappId: string;
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

const formatTimestamp = (timestamp: bigint | number) => {
  const ms = typeof timestamp === "bigint"
    ? Number(timestamp) * 1000
    : timestamp * 1000;
  return new Date(ms).toLocaleDateString("tr-TR");
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={
            i <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }
        />
      ))}
    </div>
  );
}

async function fetchReviews(dappId: string): Promise<Review[]> {
  const contractId = process.env.NEXT_PUBLIC_REVIEW_CONTRACT_ID;
  if (!contractId) return [];

  const server = new rpc.Server(RPC_URL);
  const contract = new Contract(contractId);

  const account = new Account(ZERO_ADDRESS, "0");
  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      contract.call("get_reviews", xdr.ScVal.scvSymbol(dappId))
    )
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);

  if (
    rpc.Api.isSimulationError(simResult) ||
    !("result" in simResult) ||
    !simResult.result
  ) {
    return [];
  }

  const returnVal = simResult.result.retval;
  const native = scValToNative(returnVal) as Review[];
  return native;
}

export default function ReviewList({ dappId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchReviews(dappId);
        if (!cancelled) setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        if (!cancelled) setError("Review'lar yüklenemedi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [dappId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Review&apos;lar
          {!loading && reviews.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({reviews.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            <span className="text-sm text-muted-foreground">Yükleniyor...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz review yok.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {reviews.map((review, idx) => (
              <div key={idx} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <StarRating rating={review.rating} />
                    <span className="font-mono text-xs text-muted-foreground">
                      {truncateAddress(review.reviewer)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(review.timestamp)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
