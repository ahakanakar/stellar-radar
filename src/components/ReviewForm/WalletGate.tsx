"use client";

import { useEffect, useState } from "react";
import { isConnected, isAllowed } from "@stellar/freighter-api";
import ReviewForm from "./index";

interface WalletGateProps {
  dappId: string;
}

export default function WalletGate({ dappId }: WalletGateProps) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function check() {
      const { isConnected: installed } = await isConnected();
      if (!installed) return;
      const { isAllowed: allowed } = await isAllowed();
      setConnected(allowed);
    }
    check();
  }, []);

  return <ReviewForm dappId={dappId} isWalletConnected={connected} />;
}
