import { configureStore, createSlice } from "@reduxjs/toolkit";

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

const savedAuth = readStorage("northfield_auth", { user: null, token: null });
const initialCart = readStorage("northfield_cart", []);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedAuth?.user || null,
    token: savedAuth?.token || null,
  },
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;
    },
  },
});

const cartSlice = createSlice({
  name: "cart",
  initialState: Array.isArray(initialCart) ? initialCart : [],
  reducers: {
    addToCart(state, action) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.find((item) => item.product.id === product.id);
      if (existing) existing.quantity = Math.min(20, existing.quantity + quantity);
      else state.push({ product, quantity: Math.min(20, quantity) });
    },
    updateQuantity(state, action) {
      const item = state.find((entry) => entry.product.id === action.payload.id);
      if (item) item.quantity = Math.max(1, Math.min(20, action.payload.quantity));
    },
    removeFromCart(state, action) {
      return state.filter((item) => item.product.id !== action.payload);
    },
    clearCart() {
      return [];
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
  },
});

store.subscribe(() => {
  const { auth, cart } = store.getState();
  if (auth.token && auth.user) localStorage.setItem("northfield_auth", JSON.stringify(auth));
  else localStorage.removeItem("northfield_auth");
  localStorage.setItem("northfield_cart", JSON.stringify(cart));
});
