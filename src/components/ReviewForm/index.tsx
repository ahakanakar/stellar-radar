"use client";

import { useState } from "react";
import { Star } from "lucide-react";
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    console.log({ rating, comment, dappId });
    setSubmitted(true);
  }

  function handleReset() {
    setRating(0);
    setHovered(0);
    setComment("");
    setSubmitted(false);
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
              Review&apos;ın gönderildi, teşekkürler!
            </p>
            <Button variant="outline" size="sm" onClick={handleReset} className="w-fit">
              Yeni review yaz
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      className="rounded p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring transition-transform hover:scale-110"
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
              {rating === 0 && (
                <p className="text-xs text-muted-foreground">
                  Göndermek için en az bir yıldız seç.
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-2">
              <label htmlFor="review-comment" className="text-sm font-medium">
                Yorum <span className="text-muted-foreground">(opsiyonel)</span>
              </label>
              <Textarea
                id="review-comment"
                placeholder="Bu dapp hakkında ne düşünüyorsun?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <Button type="submit" size="sm" disabled={rating === 0} className="w-fit">
              Submit Review
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
