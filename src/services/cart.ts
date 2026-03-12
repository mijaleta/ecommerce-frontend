import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    image: string | null;
  };
  quantity: number;
}

export interface Cart {
  id: number;
  user: number;
  items: CartItem[] | string; // Can be array or URL string
  created_at: string;
  updated_at: string;
}

export interface CartItemFormData {
  product: number;
  quantity: number;
}

export const getCart = async (): Promise<Cart> => {
  const response = await axios.get(`${API_URL}/api/cart/`, {
    headers: getAuthHeaders(),
  });
  const cartData = response.data;
  
  // If items is a URL string, fetch the items from that URL
  if (typeof cartData.items === 'string') {
    try {
      const itemsResponse = await axios.get(cartData.items, {
        headers: getAuthHeaders(),
      });
      cartData.items = itemsResponse.data.results || itemsResponse.data || [];
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      cartData.items = [];
    }
  }
  
  return cartData;
};

export const addToCart = async (itemData: CartItemFormData): Promise<CartItem> => {
  const response = await axios.post(`${API_URL}/api/cart/items/`, itemData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateCartItem = async (id: number, quantity: number): Promise<CartItem> => {
  const response = await axios.patch(`${API_URL}/api/cart/items/${id}/`, { quantity }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const removeFromCart = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/api/cart/items/${id}/`, {
    headers: getAuthHeaders(),
  });
};

 

export const clearCart = async (): Promise<void> => {
  try {
await axios.delete(`${API_URL}/api/cart/items/clear/`, {
  headers: getAuthHeaders(),
});
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
};
