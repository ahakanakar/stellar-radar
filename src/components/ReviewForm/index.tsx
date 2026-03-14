"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Address, Contract, Networks, TransactionBuilder, nativeToScVal, rpc, xdr } from "@stellar/stellar-sdk";
import { getAddress, signTransaction } from "@stellar/freighter-api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewFormProps {
  dappId: string;
  isWalletConnected: boolean;
}

export default function ReviewForm({ dappId, isWalletConnected }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { address } = await getAddress();

      const server = new rpc.Server("https://soroban-testnet.stellar.org");
      const account = await server.getAccount(address);

      const contract = new Contract(process.env.NEXT_PUBLIC_REVIEW_CONTRACT_ID!);

      const tx = new TransactionBuilder(account, {
        fee: "1000000",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(contract.call(
          "submit_review",
          new Address(address).toScVal(),
          xdr.ScVal.scvSymbol(dappId),
          nativeToScVal(rating, { type: "u32" }),
          nativeToScVal(comment, { type: "string" })
        ))
        .setTimeout(0)
        .build();

      const prepared = await server.prepareTransaction(tx);

      const { signedTxXdr } = await signTransaction(prepared.toXDR(), {
        networkPassphrase: Networks.TESTNET,
      });

      const signedTx = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET);
      const result = await server.sendTransaction(signedTx);

      if (result.status === "ERROR") {
        throw new Error("Transaction failed: " + JSON.stringify(result.errorResult));
      }

      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "İşlem başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  function handleReset() {
    setRating(0);
    setHovered(0);
    setComment("");
    setSubmitted(false);
    setError(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Review Yaz</CardTitle>
      </CardHeader>
      <CardContent>
        {!isWalletConnected ? (
          <p className="text-sm text-muted-foreground">
            Review göndermek için cüzdanını bağla.
          </p>
        ) : submitted ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">
              Review&apos;ın zincire yazıldı, teşekkürler!
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="w-fit"
            >
              Yeni review yaz
            </Button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (rating > 0) handleSubmit(); }} className="flex flex-col gap-5">
            {/* Star rating */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Puan</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= (hovered || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      aria-label={`${star} yıldız`}
                      disabled={loading}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      className="rounded p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring transition-transform hover:scale-110 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <Star
                        size={24}
                        className={
                          filled
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }
                      />
                    </button>
                  );
                })}
              </div>
              {rating === 0 && !loading && (
                <p className="text-xs text-muted-foreground">
                  Göndermek için en az bir yıldız seç.
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-2">
              <label htmlFor="review-comment" className="text-sm font-medium">
                Yorum{" "}
                <span className="text-muted-foreground">(opsiyonel)</span>
              </label>
              <Textarea
                id="review-comment"
                placeholder="Bu dapp hakkında ne düşünüyorsun?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                disabled={loading}
                className="resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={rating === 0 || loading}
              className="w-fit"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
