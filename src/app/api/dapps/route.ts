import { NextResponse } from "next/server";

const HORIZON_BASE_URL = "https://horizon.stellar.org";

const SOROSWAP_ADDRESS =
  "GAYPUMZFDKUEUJ4LPTHVXVG2GD5B6AV5GGLYDMSZXCSI4QILQKSY25JI";

const AQUARIUS_MOCK: DappMetrics = {
  id: "aquarius",
  name: "Aquarius",
  txCount: 0,
  lastActivity: null,
  isMock: true,
};

interface HorizonTransaction {
  id: string;
  created_at: string;
}

interface HorizonTransactionsResponse {
  _embedded: {
    records: HorizonTransaction[];
  };
}

interface DappMetrics {
  id: string;
  name: string;
  txCount: number;
  lastActivity: string | null;
  isMock?: boolean;
}

async function fetchDappMetrics(
  id: string,
  name: string,
  address: string
): Promise<DappMetrics> {
  const url = `${HORIZON_BASE_URL}/accounts/${address}/transactions?limit=200&order=desc`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(
      `Horizon returned ${response.status} for account ${address}`
    );
  }

  const data = (await response.json()) as HorizonTransactionsResponse;
  const records = data._embedded.records;

  return {
    id,
    name,
    txCount: records.length,
    lastActivity: records[0]?.created_at ?? null,
  };
}

export async function GET() {
  try {
    const soroswapResult = await fetchDappMetrics(
      "soroswap",
      "Soroswap",
      SOROSWAP_ADDRESS
    );

    return NextResponse.json({
      data: [AQUARIUS_MOCK, soroswapResult],
      error: null,
      status: 200,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";

    return NextResponse.json(
      {
        data: null,
        error: message,
        status: 503,
      },
      { status: 503 }
    );
  }
}
