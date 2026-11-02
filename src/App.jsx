import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "./api.js";
import { clearCredentials, setCredentials } from "./store.js";
import Layout from "./components/Layout.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

function ProtectedRoute({ children, admin = false }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (admin && user.role !== "admin") return <Navigate to="/shop" replace />;
  return children;
}

export default function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState("");

  async function loadProducts() {
    const result = await apiRequest("/products");
    setProducts(result);
  }

  async function loadOrders() {
    if (!token) {
      setOrders([]);
      return;
    }
    const result = await apiRequest("/orders", { token });
    setOrders(result);
  }

  useEffect(() => {
    apiRequest("/products").then(setProducts).catch((error) => setNotice(error.message));
  }, []);

  useEffect(() => {
    if (token) {
      apiRequest("/auth/me", { token })
        .then((result) => dispatch(setCredentials({ user: result.user, token })))
        .catch(() => dispatch(clearCredentials()));
    }
  }, [dispatch, token]);

  useEffect(() => {
    loadOrders().catch((error) => setNotice(error.message));
  }, [token]);

  return (
    <Layout notice={notice} clearNotice={() => setNotice("")}>
      <Routes>
        <Route path="/" element={<Navigate to="/shop" replace />} />
        <Route path="/shop" element={<ShopPage products={products} />} />
        <Route path="/products/:id" element={<ProductPage products={products} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<AuthPage mode="login" onAuth={(result) => dispatch(setCredentials(result))} />} />
        <Route path="/signup" element={<AuthPage mode="signup" onAuth={(result) => dispatch(setCredentials(result))} />} />
        <Route path="/account" element={<ProtectedRoute><AccountPage orders={orders} /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage onOrderPlaced={async () => { await loadOrders(); setNotice("Your order is confirmed. Thank you for shopping thoughtfully."); }} /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute admin><AdminPage products={products} reloadProducts={loadProducts} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/shop" replace />} />
      </Routes>
    </Layout>
  );
}
