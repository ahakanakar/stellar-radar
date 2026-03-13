"use client";

import { useEffect, useState } from "react";
import {
  isConnected,
  isAllowed,
  getAddress,
  requestAccess,
} from "@stellar/freighter-api";
import { Button } from "@/components/ui/button";

type WalletStatus = "loading" | "not-installed" | "disconnected" | "connected";

function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function WalletConnect() {
  const [status, setStatus] = useState<WalletStatus>("loading");
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    async function checkWallet() {
      const connectionResult = await isConnected();

      if (!connectionResult.isConnected) {
        setStatus("not-installed");
        return;
      }

      const allowedResult = await isAllowed();

      if (!allowedResult.isAllowed) {
        setStatus("disconnected");
        return;
      }

      const addressResult = await getAddress();

      if (addressResult.error || !addressResult.address) {
        setStatus("disconnected");
        return;
      }

      setAddress(addressResult.address);
      setStatus("connected");
    }

    checkWallet();
  }, []);

  async function handleConnect() {
    const result = await requestAccess();

    if (result.error || !result.address) {
      return;
    }

    setAddress(result.address);
    setStatus("connected");
  }

  if (status === "loading") {
    return (
      <Button variant="outline" size="sm" disabled>
        <span className="opacity-0">Connect Wallet</span>
      </Button>
    );
  }

  if (status === "not-installed") {
    return (
      <Button variant="outline" size="sm" asChild>
        <a
          href="https://freighter.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Install Freighter
        </a>
      </Button>
    );
  }

  if (status === "connected" && address) {
    return (
      <Button variant="secondary" size="sm" className="font-mono">
        {truncateAddress(address)}
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={handleConnect}>
      Connect Wallet
    </Button>
  );
}
