import DappCard, { type Dapp } from "@/components/DappCard";

const MOCK_DAPPS: Dapp[] = [
  {
    id: "1",
    name: "Aquarius",
    category: "DEX",
    description:
      "Stellar ekosisteminin likiditesini yöneten merkezi olmayan borsa. AMM havuzları ve oy tabanlı likidite yönlendirmesi sunar.",
    tvl: "$18.4M",
    users: 24310,
  },
  {
    id: "2",
    name: "Blend Protocol",
    category: "Lending",
    description:
      "Stellar üzerinde izinsiz kredi piyasaları oluşturmaya olanak tanıyan merkeziyetsiz borç verme protokolü.",
    tvl: "$9.7M",
    users: 8540,
  },
  {
    id: "3",
    name: "Soroswap",
    category: "DEX",
    description:
      "Soroban akıllı sözleşmeleri üzerine inşa edilmiş, hızlı ve düşük maliyetli token takası yapan AMM DEX.",
    tvl: "$5.2M",
    users: 13780,
  },
  {
    id: "4",
    name: "Phoenix Protocol",
    category: "DEX",
    description:
      "Stellar'ın yerel varlıklarını destekleyen çok havuzlu DEX altyapısı. Likidite sağlayıcılarına teşvik mekanizması sunar.",
    tvl: "$3.8M",
    users: 6920,
  },
  {
    id: "5",
    name: "Lumenswap",
    category: "DEX",
    description:
      "Stellar ağında token değişimi, NFT marketplace ve OTC ticareti bir arada sunan kapsamlı DeFi platformu.",
    tvl: "$2.1M",
    users: 11450,
  },
  {
    id: "6",
    name: "Stellar Turrets",
    category: "Infrastructure",
    description:
      "Soroban öncesi dönemde geliştirilen, Stellar işlemlerini merkeziyetsiz sunucular aracılığıyla otomatikleştiren altyapı katmanı.",
    tvl: "$0.6M",
    users: 1830,
  },
];

export default function HomePage() {
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
            en güvenilir dapp'leri bir arada görün.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_DAPPS.map((dapp) => (
            <DappCard key={dapp.id} dapp={dapp} />
          ))}
        </div>
      </div>
    </main>
  );
}
