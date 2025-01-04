"use client";

import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { MERCHANDISE_NFT_CONTRACT_ADDRESS } from "@/lib/constants";
import { MerchType } from "@/lib/types/merchandise";

export function useMerchandiseContract() {
  const { contract } = useContract(MERCHANDISE_NFT_CONTRACT_ADDRESS);

  // Create new merchandise
  const useCreateMerchandise = () => {
    return useContractWrite(contract, "createMerchandise");
  };

  // Purchase merchandise
  const usePurchaseMerchandise = () => {
    return useContractWrite(contract, "purchaseMerchandise");
  };

  // Get merchandise details
  const useMerchandiseDetails = (tokenId: string) => {
    return useContractRead(contract, "merchandise", [tokenId]);
  };

  // Get shipping details
  const useShippingDetails = (tokenId: string, buyer: string) => {
    return useContractRead(contract, "getShippingDetails", [tokenId, buyer]);
  };

  // Update stock
  const useUpdateStock = () => {
    return useContractWrite(contract, "updateStock");
  };

  return {
    contract,
    useCreateMerchandise,
    usePurchaseMerchandise,
    useMerchandiseDetails,
    useShippingDetails,
    useUpdateStock,
  };
}
