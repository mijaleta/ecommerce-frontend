import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../../services/products";
import type { Product, ProductFormData } from "../../services/products";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: null | string;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const products = await getProducts();
  return products;
});

export const fetchProduct = createAsyncThunk("products/fetchProduct", async (id: number) => {
  const product = await getProduct(id);
  return product;
});

export const addProduct = createAsyncThunk(
  "products/addProduct", 
  async (productData: ProductFormData) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('stock', productData.stock.toString());
    if (productData.image) {
      formData.append('image', productData.image);
    }
    const product = await createProduct(formData);
    return product;
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, productData }: { id: number; productData: ProductFormData }) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('stock', productData.stock.toString());
    if (productData.image) {
      formData.append('image', productData.image);
    }
    const product = await updateProduct(id, formData);
    return product;
  }
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id: number) => {
    await deleteProduct(id);
    return id;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      // Fetch Single Product
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch product";
      })
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to add product";
      })
      // Edit Product
      .addCase(editProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update product";
      })
      // Delete Product
      .addCase(removeProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete product";
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
