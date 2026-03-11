import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  category: string;
  image: string | null;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
  image: File | null;
  stock: number;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/api/products/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await axios.get(`${API_URL}/api/products/${id}/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createProduct = async (productData: FormData): Promise<Product> => {
  const response = await axios.post(`${API_URL}/api/products/`, productData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const updateProduct = async (id: number, productData: FormData): Promise<Product> => {
  const response = await axios.put(`${API_URL}/api/products/${id}/`, productData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/api/products/${id}/`, {
    headers: getAuthHeaders(),
  });
};
