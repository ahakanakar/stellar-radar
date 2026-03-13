"use client";

import { useMemo, useState } from "react";
import DappCard from "@/components/DappCard";
import { MOCK_DAPPS } from "@/lib/dapps";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Category = "All" | "DEX" | "Lending" | "Infrastructure";

const CATEGORIES: Category[] = ["All", "DEX", "Lending", "Infrastructure"];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredDapps = useMemo(() => {
    return MOCK_DAPPS.filter((dapp) => {
      const matchesCategory =
        activeCategory === "All" || dapp.category === activeCategory;
      const matchesSearch = dapp.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Stellar DApp Explorer
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
            Stellar ekosistemindeki merkeziyetsiz uygulamaları keşfedin.
            On-chain metriklerle doğrulanmış TVL ve kullanıcı verileriyle
            en güvenilir dapp&apos;leri bir arada görün.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            type="search"
            placeholder="DApp ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {filteredDapps.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDapps.map((dapp) => (
              <DappCard key={dapp.id} dapp={dapp} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-medium">Sonuç bulunamadı</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Arama terimini değiştirmeyi veya farklı bir kategori seçmeyi
              deneyin.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
