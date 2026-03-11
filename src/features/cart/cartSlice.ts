import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  type Cart,
  type CartItem,
  type CartItemFormData 
} from '../../services/cart';

interface CartState {
  cart: Cart | null;
  items: CartItem[];
  isLoading: boolean;
  error: null | string;
}

const initialState: CartState = {
  cart: null,
  items: [],
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const cart = await getCart();
  return cart;
});

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async (itemData: CartItemFormData) => {
    const item = await addToCart(itemData);
    return item;
  }
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItem',
  async ({ id, quantity }: { id: number; quantity: number }) => {
    const item = await updateCartItem(id, quantity);
    return item;
  }
);

export const deleteItemFromCart = createAsyncThunk(
  'cart/deleteItem',
  async (id: number) => {
    await removeFromCart(id);
    return id;
  }
);

export const clearAllItems = createAsyncThunk(
  'cart/clearCart',
  async () => {
    await clearCart();
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.cart = null;
      state.items = [];
      state.error = null;
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      // Add Item
      .addCase(addItemToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingItem = state.items.find(item => item.product.id === action.payload.product.id);
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add item to cart';
      })
      // Update Item
      .addCase(updateItemQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update item';
      })
      // Delete Item
      .addCase(deleteItemFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteItemFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteItemFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to remove item';
      })
      // Clear Cart
      .addCase(clearAllItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearAllItems.fulfilled, (state) => {
        state.isLoading = false;
        state.cart = null;
        state.items = [];
      })
      .addCase(clearAllItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to clear cart';
      });
  },
});

export const { clearCartState, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;

