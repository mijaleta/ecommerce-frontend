import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  type Order,
  type OrderFormData,
  type OrderStatus,
} from '../../services/orders';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: null | string;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const orders = await getOrders();
  return orders;
});

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: number) => {
    const order = await getOrder(id);
    return order;
  }
);

export const createNewOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: OrderFormData) => {
    const order = await createOrder(orderData);
    return order;
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, status }: { id: number; status: OrderStatus }) => {
    const order = await updateOrderStatus(id, status);
    return order;
  }
);

export const cancelOrderById = createAsyncThunk(
  'orders/cancelOrder',
  async (id: number) => {
    const order = await cancelOrder(id);
    return order;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrdersError: (state) => {
      state.error = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      // Fetch Single Order
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch order';
      })
      // Create Order
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      // Update Order Status
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update order';
      })
      // Cancel Order
      .addCase(cancelOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(cancelOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to cancel order';
      });
  },
});

export const { clearCurrentOrder, clearOrdersError, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
