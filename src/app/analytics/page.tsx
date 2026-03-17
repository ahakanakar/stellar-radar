"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MOCK_DAPPS } from "@/lib/dapps";

function parseTvl(tvl: string): number {
  const cleaned = tvl.replace(/[$,]/g, "");
  const match = cleaned.match(/^([\d.]+)([MBKmk]?)$/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const suffix = match[2].toUpperCase();
  if (suffix === "B") return value * 1_000_000_000;
  if (suffix === "M") return value * 1_000_000;
  if (suffix === "K") return value * 1_000;
  return value;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

function formatNumber(n: number): string {
  return n.toLocaleString("tr-TR");
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// ── Computed data ─────────────────────────────────────────────────────────────

const totalDapps = MOCK_DAPPS.length;

const totalTvl = MOCK_DAPPS.reduce((sum, d) => sum + parseTvl(d.tvl), 0);

const totalUsers = MOCK_DAPPS.reduce((sum, d) => sum + d.users, 0);

const totalTx = MOCK_DAPPS.reduce((sum, d) => sum + (d.txCount ?? 0), 0);

const categoryData = Object.entries(
  MOCK_DAPPS.reduce<Record<string, number>>((acc, d) => {
    acc[d.category] = (acc[d.category] ?? 0) + 1;
    return acc;
  }, {})
)
  .map(([category, count]) => ({ category, count }))
  .sort((a, b) => b.count - a.count);

const tvlRanking = [...MOCK_DAPPS]
  .sort((a, b) => parseTvl(b.tvl) - parseTvl(a.tvl))
  .slice(0, 5)
  .map((d) => ({ name: d.name, tvl: parseTvl(d.tvl) }));

const txRanking = [...MOCK_DAPPS]
  .filter((d) => d.txCount !== undefined)
  .sort((a, b) => (b.txCount ?? 0) - (a.txCount ?? 0))
  .slice(0, 5)
  .map((d) => ({ name: d.name, txCount: d.txCount ?? 0 }));

// ── Component ─────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Analytics
        </h1>

        {/* Ecosystem Summary */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryCard title="Toplam DApp" value={totalDapps.toString()} />
          <SummaryCard title="Toplam TVL" value={formatCompact(totalTvl)} />
          <SummaryCard title="Toplam Kullanıcı" value={formatNumber(totalUsers)} />
          <SummaryCard title="Toplam İşlem" value={formatNumber(totalTx)} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Category Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Kategori Dağılımı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="count" name="DApp Sayısı" radius={[4, 4, 0, 0]}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* TVL Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">TVL Sıralaması (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tvlRanking} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      className="fill-muted-foreground"
                      tickFormatter={(v: number) => formatCompact(v)}
                    />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                    <Tooltip
                      formatter={(value: number) => [formatCompact(value), "TVL"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="tvl" name="TVL" radius={[0, 4, 4, 0]}>
                      {tvlRanking.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Most Active DApps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">En Aktif DApp&apos;ler (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={txRanking} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      className="fill-muted-foreground"
                      tickFormatter={(v: number) => formatNumber(v)}
                    />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                    <Tooltip
                      formatter={(value: number) => [formatNumber(value), "İşlem Sayısı"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="txCount" name="İşlem" radius={[0, 4, 4, 0]}>
                      {txRanking.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{title}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
