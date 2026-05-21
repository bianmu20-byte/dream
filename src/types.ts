export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  longDescription?: string;
  imageUrl: string;
}

export interface CartItem {
  id: string; // unique cart item id
  product: Product;
  quantity: number;
  selected: boolean;
}

export interface User {
  id: string;
  username: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: number;
  status: 'completed';
  address: string;
  name: string;
  phone: string;
}
