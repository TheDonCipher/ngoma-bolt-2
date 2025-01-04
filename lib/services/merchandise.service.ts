"use client";

import { useMerchandiseContract } from "@/lib/hooks/use-merchandise-contract";
import { Merchandise, ShippingDetails } from "@/lib/types/merchandise";
import { useToast } from "@/hooks/use-toast";
import { uploadToIPFS } from "@/lib/utils/ipfs";

export function useMerchandiseService() {
  const {
    useCreateMerchandise,
    usePurchaseMerchandise,
    useUpdateStock
  } = useMerchandiseContract();

  const { mutateAsync: createMerchandise } = useCreateMerchandise();
  const { mutateAsync: purchaseMerchandise } = usePurchaseMerchandise();
  const { mutateAsync: updateStock } = useUpdateStock();
  const { toast } = useToast();

  const createNewMerchandise = async (
    merchandise: Omit<Merchandise, "id">,
    file: File
  ) => {
    try {
      // Upload image to IPFS
      const ipfsHash = await uploadToIPFS(file, {
        title: merchandise.title,
        description: merchandise.description,
        type: merchandise.type,
        artist: merchandise.artist,
      });

      // Create merchandise on blockchain
      const tx = await createMerchandise({
        args: [
          ipfsHash,
          merchandise.type,
          merchandise.price,
          merchandise.royaltyFee,
          merchandise.stock,
        ],
      });

      toast({
        title: "Success",
        description: "Merchandise created successfully",
      });

      return tx;
    } catch (error) {
      console.error("Error creating merchandise:", error);
      toast({
        title: "Error",
        description: "Failed to create merchandise",
        variant: "destructive",
      });
      throw error;
    }
  };

  const purchase = async (
    tokenId: string,
    price: bigint,
    shippingDetails?: ShippingDetails
  ) => {
    try {
      const tx = await purchaseMerchandise({
        args: [tokenId, JSON.stringify(shippingDetails)],
        overrides: {
          value: price,
        },
      });

      toast({
        title: "Success",
        description: "Purchase successful",
      });

      return tx;
    } catch (error) {
      console.error("Error purchasing merchandise:", error);
      toast({
        title: "Error",
        description: "Failed to complete purchase",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMerchandiseStock = async (tokenId: string, newStock: number) => {
    try {
      const tx = await updateStock({
        args: [tokenId, newStock],
      });

      toast({
        title: "Success",
        description: "Stock updated successfully",
      });

      return tx;
    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    createNewMerchandise,
    purchase,
    updateMerchandiseStock,
  };
}
