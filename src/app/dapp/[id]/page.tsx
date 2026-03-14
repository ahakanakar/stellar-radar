import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MOCK_DAPPS } from "@/lib/dapps";
import WalletGate from "@/components/ReviewForm/WalletGate";
import ReviewList from "@/components/ReviewList";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DappDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dapp = MOCK_DAPPS.find((d) => d.id === id);

  if (!dapp) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">← Back</Link>
          </Button>
          {dapp.websiteUrl && (
            <Button size="sm" asChild>
              <a
                href={dapp.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website
              </a>
            </Button>
          )}
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{dapp.name}</h1>
          <Badge variant="secondary">{dapp.category}</Badge>
        </div>

        <p className="mb-8 text-base text-muted-foreground leading-relaxed">
          {dapp.description}
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metrikler</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                  TVL
                </dt>
                <dd className="text-lg font-semibold tabular-nums">
                  {dapp.tvl}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                  Users
                </dt>
                <dd className="text-lg font-semibold tabular-nums">
                  {dapp.users.toLocaleString()}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                  Tx Count
                </dt>
                <dd className="text-lg font-semibold tabular-nums">
                  {dapp.txCount !== undefined
                    ? dapp.txCount.toLocaleString()
                    : "—"}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                  Last Activity
                </dt>
                <dd className="text-sm font-medium">
                  {dapp.lastActivity ? formatDate(dapp.lastActivity) : "—"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="mt-8">
          <WalletGate dappId={dapp.id} />
        </div>

        <div className="mt-6">
          <ReviewList dappId={dapp.id} />
        </div>
      </div>
    </main>
  );
}
