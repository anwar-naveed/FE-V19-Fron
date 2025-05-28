export interface Item {
    id: number;
    name: string;
    price: number;
    discountPercentage: number;
    taxPercentage: number;
    quantity?: number;
  }