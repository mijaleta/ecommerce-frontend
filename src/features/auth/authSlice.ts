import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface AuthState {
  user: null | object;
  token: null | string;
  isLoading: boolean;
  error: null | string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null
};

export const signUp = createAsyncThunk(
  'auth/signup',
  async (userData: any) => {
    const response = await axios.post(`${API_URL}/api/users/`, userData);
    return response.data;
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: any) => {
    const response = await axios.post(`${API_URL}/api/token/`, credentials);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Signup failed';
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;