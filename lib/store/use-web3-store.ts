"use client";

    import { create } from "zustand";
    import { ConnectionStatus } from "@/lib/types/web3";

    interface Web3Store {
      address: string | null;
      connectionStatus: ConnectionStatus;
      chainId: number | undefined;
      error: string | null;
      
      // Actions
      setAddress: (address: string | null) => void;
      setConnectionStatus: (status: ConnectionStatus) => void;
      setChainId: (chainId: number | undefined) => void;
      setError: (error: string | null) => void;
    }

    export const useWeb3Store = create<Web3Store>((set) => ({
      address: null,
      connectionStatus: "unknown",
      chainId: undefined,
      error: null,

      setAddress: (address) => set({ address }),
      setConnectionStatus: (status) => set({ connectionStatus: status }),
      setChainId: (chainId) => set({ chainId }),
      setError: (error) => set({ error }),
    }));
