import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Dapp } from "@/lib/dapps";

interface DappCardProps {
  dapp: Dapp;
}

export default function DappCard({ dapp }: DappCardProps) {
  return (
    <Link href={`/dapp/${dapp.id}`} className="group outline-none">
      <Card className="flex h-full flex-col gap-3 transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight">{dapp.name}</CardTitle>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {dapp.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {dapp.description}
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                TVL
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {dapp.tvl}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Users
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {dapp.users.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
