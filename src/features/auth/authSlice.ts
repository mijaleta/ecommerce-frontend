import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signUpUser, loginUser } from "../../services/auth";

interface User {
  id: number;
  email: string;
  username: string;
  phone_number: string;
}

interface AuthState {
  user: null | User;
  token: null | string;
  isLoading: boolean;
  error: null | string;
}

// Get stored user from localStorage
const getStoredUser = (): null | User => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};
export const signUp = createAsyncThunk("auth/signup", signUpUser);
export const login = createAsyncThunk("auth/login", loginUser);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
    },
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
        localStorage.setItem("token", action.payload.access);
        localStorage.setItem("refresh", action.payload.refresh);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Signup failed";
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.access);
        localStorage.setItem("refresh", action.payload.refresh);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        console.log("Login response............:", action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
