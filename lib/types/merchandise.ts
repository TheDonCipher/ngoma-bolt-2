export type MerchType = "PHYSICAL" | "DIGITAL";

export interface Merchandise {
  id: string;
  title: string;
  description: string;
  type: MerchType;
  price: bigint;
  royaltyFee: number;
  stock: number;
  image: string;
  artist: {
    id: string;
    name: string;
    image: string;
  };
  isActive: boolean;
}

export interface ShippingDetails {
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}
