"use client";

import { ReactNode, useEffect } from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { useWeb3Store } from '@/lib/store/use-web3-store';
import { useWebSocket } from '@/lib/services/websocket.service';
import { Ethereum } from "@thirdweb-dev/chains";

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const { connect, disconnect } = useWebSocket();
  const { address } = useWeb3Store();

  useEffect(() => {
    if (address) {
      connect();
    } else {
      disconnect();
    }
  }, [address, connect, disconnect]);

  return (
    <ThirdwebProvider
      activeChain={Ethereum}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      authConfig={{
        authUrl: "/api/auth",
        domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN!,
      }}
    >
      {children}
    </ThirdwebProvider>
  );
}
