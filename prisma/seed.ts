import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const dapps = [
  {
    name: "Soroswap",
    description:
      "Soroban akıllı sözleşmeleri üzerine inşa edilmiş, hızlı ve düşük maliyetli token takası yapan AMM DEX.",
    category: "DEX",
    websiteUrl: "https://soroswap.finance",
    tvl: 5200000,
    userCount: 13780,
    txCount: 97450,
    lastActivity: new Date("2024-03-12T16:48:00Z"),
    isMock: false,
  },
  {
    name: "Aquarius",
    description:
      "Stellar ekosisteminin likiditesini yöneten merkezi olmayan borsa. AMM havuzları ve oy tabanlı likidite yönlendirmesi sunar.",
    category: "DEX",
    websiteUrl: "https://aquarius.network",
    tvl: 18400000,
    userCount: 24310,
    txCount: 184920,
    lastActivity: new Date("2024-03-12T14:22:00Z"),
    isMock: false,
  },
  {
    name: "Blend Protocol",
    description:
      "Stellar üzerinde izinsiz kredi piyasaları oluşturmaya olanak tanıyan merkeziyetsiz borç verme protokolü.",
    category: "DeFi",
    websiteUrl: "https://blend.capital",
    tvl: 9700000,
    userCount: 8540,
    txCount: 42310,
    lastActivity: new Date("2024-03-12T11:05:00Z"),
    isMock: false,
  },
  {
    name: "Phoenix DEX",
    description:
      "Stellar'ın yerel varlıklarını destekleyen çok havuzlu DEX altyapısı. Likidite sağlayıcılarına teşvik mekanizması sunar.",
    category: "DEX",
    websiteUrl: "https://phoenix-hub.io",
    tvl: 3800000,
    userCount: 6920,
    txCount: 31870,
    lastActivity: new Date("2024-03-11T09:30:00Z"),
    isMock: false,
  },
  {
    name: "Lumenswap",
    description:
      "Stellar ağında token değişimi, NFT marketplace ve OTC ticareti bir arada sunan kapsamlı DeFi platformu.",
    category: "DEX",
    websiteUrl: "https://lumenswap.io",
    tvl: 2100000,
    userCount: 11450,
    txCount: 58200,
    lastActivity: new Date("2024-03-12T08:14:00Z"),
    isMock: false,
  },
  {
    name: "Stellar Turrets",
    description:
      "Soroban öncesi dönemde geliştirilen, Stellar işlemlerini merkeziyetsiz sunucular aracılığıyla otomatikleştiren altyapı katmanı.",
    category: "Infrastructure",
    websiteUrl: "https://turrets.stellar.org",
    tvl: 600000,
    userCount: 1830,
    txCount: 9640,
    lastActivity: new Date("2024-03-10T17:55:00Z"),
    isMock: false,
  },
  {
    name: "MoneyGram",
    description:
      "Stellar ağı üzerinden gerçek zamanlı para transferi ve nakit çekme imkânı sunan fintech entegrasyon platformu.",
    category: "DeFi",
    websiteUrl: "https://www.moneygram.com",
    tvl: null,
    userCount: 150000,
    txCount: 2100000,
    lastActivity: new Date("2024-03-12T18:00:00Z"),
    isMock: true,
  },
  {
    name: "Stellar Quest",
    description:
      "Stellar geliştirici ekosistemini büyütmek için tasarlanmış, görev tabanlı öğrenme ve ödül platformu.",
    category: "Infrastructure",
    websiteUrl: "https://quest.stellar.org",
    tvl: null,
    userCount: 42000,
    txCount: 380000,
    lastActivity: new Date("2024-03-08T12:00:00Z"),
    isMock: true,
  },
  {
    name: "Lobstr",
    description:
      "Kullanıcı dostu arayüzü ile Stellar ağında varlık yönetimi, işlem ve döviz takası sunan mobil cüzdan.",
    category: "Wallet",
    websiteUrl: "https://lobstr.co",
    tvl: null,
    userCount: 620000,
    txCount: 5800000,
    lastActivity: new Date("2024-03-12T19:30:00Z"),
    isMock: true,
  },
  {
    name: "StellarX",
    description:
      "Stellar Decentralized Exchange üzerinde çalışan, gelişmiş emir defteri ve portföy yönetimi sunan ticaret platformu.",
    category: "DEX",
    websiteUrl: "https://stellarx.com",
    tvl: 7400000,
    userCount: 18900,
    txCount: 124000,
    lastActivity: new Date("2024-03-11T22:10:00Z"),
    isMock: true,
  },
  {
    name: "Scopuly",
    description:
      "Stellar tabanlı DeFi hizmetleri, varlık yönetimi ve merkeziyetsiz borsa işlevlerini tek çatı altında sunan platform.",
    category: "DeFi",
    websiteUrl: "https://scopuly.com",
    tvl: 1900000,
    userCount: 9200,
    txCount: 47300,
    lastActivity: new Date("2024-03-10T14:45:00Z"),
    isMock: true,
  },
  {
    name: "Interstellar",
    description:
      "Stellar ağındaki varlık ihracı, likidite havuzları ve döviz işlemlerine odaklanan kurumsal DeFi altyapısı.",
    category: "DeFi",
    websiteUrl: "https://interstellar.exchange",
    tvl: 4300000,
    userCount: 7600,
    txCount: 62100,
    lastActivity: new Date("2024-03-09T10:20:00Z"),
    isMock: true,
  },
  {
    name: "StellarTerm",
    description:
      "Stellar DEX için açık kaynaklı, tarayıcı tabanlı ticaret arayüzü. Emir defteri ve anlık fiyat grafikleri sunar.",
    category: "DEX",
    websiteUrl: "https://stellarterm.com",
    tvl: 3100000,
    userCount: 14500,
    txCount: 89700,
    lastActivity: new Date("2024-03-12T07:30:00Z"),
    isMock: true,
  },
  {
    name: "Albedo",
    description:
      "Özel anahtar gerektirmeden Stellar işlemlerini güvenle imzalamayı sağlayan tarayıcı tabanlı kimlik ve yetkilendirme aracı.",
    category: "Wallet",
    websiteUrl: "https://albedo.link",
    tvl: null,
    userCount: 55000,
    txCount: 430000,
    lastActivity: new Date("2024-03-12T15:00:00Z"),
    isMock: true,
  },
  {
    name: "Stellar.org",
    description:
      "Stellar ağını geliştiren ve destekleyen kâr amacı gütmeyen organizasyon. Protokol altyapısı ve geliştirici araçları sağlar.",
    category: "Infrastructure",
    websiteUrl: "https://stellar.org",
    tvl: null,
    userCount: 500000,
    txCount: null,
    lastActivity: new Date("2024-03-12T20:00:00Z"),
    isMock: true,
  },
  {
    name: "Ultra Stellar",
    description:
      "Stellar ekosisteminde varlık tokenizasyonu ve kurumsal ödeme çözümleri sunan fintech altyapı sağlayıcısı.",
    category: "Infrastructure",
    websiteUrl: "https://ultrastellar.com",
    tvl: null,
    userCount: 12000,
    txCount: 280000,
    lastActivity: new Date("2024-03-11T16:00:00Z"),
    isMock: true,
  },
  {
    name: "Freighter",
    description:
      "Stellar ve Soroban uygulamalarıyla etkileşim için tasarlanmış, Stellar Development Foundation destekli tarayıcı cüzdanı.",
    category: "Wallet",
    websiteUrl: "https://freighter.app",
    tvl: null,
    userCount: 180000,
    txCount: null,
    lastActivity: new Date("2024-03-12T21:00:00Z"),
    isMock: true,
  },
  {
    name: "Bifrost",
    description:
      "Stellar ile diğer blok zinciri ağları arasında varlık transferini güvenli biçimde gerçekleştiren çapraz zincir köprü protokolü.",
    category: "Bridge",
    websiteUrl: "https://pendulumchain.org/bifrost",
    tvl: 8900000,
    userCount: 4300,
    txCount: 19800,
    lastActivity: new Date("2024-03-10T09:15:00Z"),
    isMock: true,
  },
  {
    name: "Pendulum",
    description:
      "Stellar'ı Polkadot ekosistemiyle entegre eden, forex odaklı DeFi uygulamalarına yönelik akıllı sözleşme parachain'i.",
    category: "Bridge",
    websiteUrl: "https://pendulumchain.org",
    tvl: 12600000,
    userCount: 8900,
    txCount: 73400,
    lastActivity: new Date("2024-03-12T13:00:00Z"),
    isMock: true,
  },
  {
    name: "Spacewalk",
    description:
      "Stellar ve Substrate tabanlı ağlar arasında güvensiz (trustless) köprü bağlantısı kuran açık kaynaklı köprü protokolü.",
    category: "Bridge",
    websiteUrl: "https://pendulumchain.org/spacewalk",
    tvl: 5700000,
    userCount: 3100,
    txCount: 28500,
    lastActivity: new Date("2024-03-11T11:45:00Z"),
    isMock: true,
  },
];

async function main() {
  console.log("Seeding started — deleting existing dapps...");
  await prisma.dapp.deleteMany();

  console.log(`Inserting ${dapps.length} dapps...`);
  await prisma.dapp.createMany({ data: dapps });

  console.log("Seeding complete.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
