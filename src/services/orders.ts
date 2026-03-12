import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface ProductMinimal {
  id: number;
  name: string;
  price: string;
  image: string | null;
}

export interface OrderItem {
  id: number;
  product: ProductMinimal;
  quantity: number;
  price: string;
}

export interface ShippingInfo {
  id: number;
  order: number;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  shipping_cost: string;
}

export interface Order {
  id: number;
  user: number;
  total_price: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  shipping?: ShippingInfo;
}

export interface OrderFormData {
  items: {
    product: number;
    quantity: number;
    price: string;
  }[];
  shipping_info: {
    address: string;
    city: string;
    postal_code: string;
    country: string;
    shipping_cost: string;
  };
}

export const getOrders = async (): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/api/orders/orders/`, {
    headers: getAuthHeaders(),
  });
  return response.data.results || response.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const response = await axios.get(`${API_URL}/api/orders/orders/${id}/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createOrder = async (orderData: OrderFormData): Promise<Order> => {
  const response = await axios.post(`${API_URL}/api/orders/orders/`, orderData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<Order> => {
  const response = await axios.patch(`${API_URL}/api/orders/orders/${id}/`, { status }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getShippingInfo = async (orderId: number): Promise<ShippingInfo> => {
  const response = await axios.get(`${API_URL}/api/orders/shipping-info/${orderId}/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const cancelOrder = async (id: number): Promise<Order> => {
  const response = await axios.patch(`${API_URL}/api/orders/orders/${id}/`, { status: 'cancelled' }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
