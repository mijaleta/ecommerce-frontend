import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL;

const API_URL = import.meta.env.VITE_API_URL 

export const signUpUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/api/users/`, userData);
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await axios.post(`${API_URL}/api/token/`, credentials);
  return response.data;
};

export const refreshToken = async (refresh: string) => {
  const response = await axios.post(`${API_URL}/api/token/refresh/`, { refresh });
  return response.data;
};