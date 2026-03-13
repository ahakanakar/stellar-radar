export interface Dapp {
  id: string;
  name: string;
  category: string;
  description: string;
  tvl: string;
  users: number;
  txCount?: number;
  lastActivity?: string;
  websiteUrl?: string;
}

export const MOCK_DAPPS: Dapp[] = [
  {
    id: "1",
    name: "Aquarius",
    category: "DEX",
    description:
      "Stellar ekosisteminin likiditesini yöneten merkezi olmayan borsa. AMM havuzları ve oy tabanlı likidite yönlendirmesi sunar.",
    tvl: "$18.4M",
    users: 24310,
    txCount: 184920,
    lastActivity: "2024-03-12T14:22:00Z",
    websiteUrl: "https://aquarius.network",
  },
  {
    id: "2",
    name: "Blend Protocol",
    category: "Lending",
    description:
      "Stellar üzerinde izinsiz kredi piyasaları oluşturmaya olanak tanıyan merkeziyetsiz borç verme protokolü.",
    tvl: "$9.7M",
    users: 8540,
    txCount: 42310,
    lastActivity: "2024-03-12T11:05:00Z",
    websiteUrl: "https://blend.capital",
  },
  {
    id: "3",
    name: "Soroswap",
    category: "DEX",
    description:
      "Soroban akıllı sözleşmeleri üzerine inşa edilmiş, hızlı ve düşük maliyetli token takası yapan AMM DEX.",
    tvl: "$5.2M",
    users: 13780,
    txCount: 97450,
    lastActivity: "2024-03-12T16:48:00Z",
    websiteUrl: "https://soroswap.finance",
  },
  {
    id: "4",
    name: "Phoenix Protocol",
    category: "DEX",
    description:
      "Stellar'ın yerel varlıklarını destekleyen çok havuzlu DEX altyapısı. Likidite sağlayıcılarına teşvik mekanizması sunar.",
    tvl: "$3.8M",
    users: 6920,
    txCount: 31870,
    lastActivity: "2024-03-11T09:30:00Z",
    websiteUrl: "https://phoenix-hub.io",
  },
  {
    id: "5",
    name: "Lumenswap",
    category: "DEX",
    description:
      "Stellar ağında token değişimi, NFT marketplace ve OTC ticareti bir arada sunan kapsamlı DeFi platformu.",
    tvl: "$2.1M",
    users: 11450,
    txCount: 58200,
    lastActivity: "2024-03-12T08:14:00Z",
    websiteUrl: "https://lumenswap.io",
  },
  {
    id: "6",
    name: "Stellar Turrets",
    category: "Infrastructure",
    description:
      "Soroban öncesi dönemde geliştirilen, Stellar işlemlerini merkeziyetsiz sunucular aracılığıyla otomatikleştiren altyapı katmanı.",
    tvl: "$0.6M",
    users: 1830,
    txCount: 9640,
    lastActivity: "2024-03-10T17:55:00Z",
    websiteUrl: "https://turrets.stellar.org",
  },
];
