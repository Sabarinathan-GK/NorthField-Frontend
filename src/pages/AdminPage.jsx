import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Box, CircleDollarSign, Plus, ShoppingBag, Trash2, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { apiRequest } from "../api.js";

const money = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
const blankProduct = { name: "", category: "Home", price: "", description: "", image: "", color: "", badge: "" };

export default function AdminPage({ products, reloadProducts }) {
  const token = useSelector((state) => state.auth.token);
  const [analytics, setAnalytics] = useState(null);
  const [form, setForm] = useState(blankProduct);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function refreshAnalytics() {
    const result = await apiRequest("/admin/analytics", { token });
    setAnalytics(result);
  }

  useEffect(() => {
    refreshAnalytics().catch((requestError) => setError(requestError.message));
  }, [token]);

  async function addProduct(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await apiRequest("/products", { method: "POST", token, body: { ...form, price: Number(form.price) } });
      setForm(blankProduct);
      await Promise.all([reloadProducts(), refreshAnalytics()]);
      setSuccess("Your new piece is in the collection.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Remove "${product.name}" from the collection?`)) return;
    setError("");
    setSuccess("");
    try {
      await apiRequest(`/products/${product.id}`, { method: "DELETE", token });
      await Promise.all([reloadProducts(), refreshAnalytics()]);
      setSuccess(`${product.name} has been removed.`);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const stats = analytics ? [
    { label: "Total revenue", value: money(analytics.revenue), icon: CircleDollarSign, foot: "From confirmed orders" },
    { label: "Orders placed", value: analytics.orderCount, icon: ShoppingBag, foot: "All-time orders" },
    { label: "Pieces in the shop", value: analytics.productCount, icon: Box, foot: "Active products" },
    { label: "Customers", value: analytics.customerCount, icon: Users, foot: `${analytics.unitsSold} pieces sold` },
  ] : [];

  return (
    <section className="admin-page">
      <div className="admin-welcome"><div><div className="eyebrow"><span className="eyebrow-line" /> NORTHFIELD STUDIO</div><h1>Good morning.<br /><em>Here’s the picture.</em></h1><p>A thoughtful look at how things are going.</p></div><div className="admin-date"><span>YOUR STUDIO</span><strong>Overview <ArrowDownRight size={16} /></strong></div></div>
      {error && <div className="form-error admin-message" role="alert">{error}</div>}{success && <div className="form-success admin-message" role="status">{success}</div>}
      <div className="stats-grid">{stats.map(({ label, value, icon: Icon, foot }) => <article className="stat-card" key={label}><div className="stat-card-top"><span>{label}</span><Icon size={17} /></div><strong className="stat-value">{value}</strong><span className="stat-foot"><i />{foot}</span></article>)}</div>
      <div className="admin-content-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading"><div><span className="eyebrow">YOUR COLLECTION</span><h2>The pieces</h2></div><span className="panel-count">{products.length} ACTIVE</span></div>
          <div className="admin-product-list">{products.map((product) => <article className="admin-product-row" key={product.id}><img src={product.image} alt="" /><div className="admin-product-copy"><strong>{product.name}</strong><span>{product.category} · {money(product.price)}</span></div><button className="admin-delete" onClick={() => deleteProduct(product)} aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button></article>)}</div>
        </section>
        <section className="admin-panel admin-add-panel">
          <div className="admin-panel-heading"><div><span className="eyebrow">A NEW FIND</span><h2>Add a piece</h2></div><span className="add-icon"><Plus size={17} /></span></div>
          <form className="admin-form" onSubmit={addProduct}>
            <label className="field-label">Product name<input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="A good thing..." /></label>
            <div className="admin-form-row"><label className="field-label">Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Home</option><option>Accessories</option><option>Textiles</option><option>Stationery</option></select></label><label className="field-label">Price (USD)<input required type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="0.00" /></label></div>
            <label className="field-label">Image URL<input required type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://..." /></label>
            <label className="field-label">Description<textarea required minLength={1} rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What makes this one worth keeping?" /></label>
            <div className="admin-form-row"><label className="field-label">Color / finish<input value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} placeholder="Natural linen" /></label><label className="field-label">Small badge<input value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} placeholder="Bestseller (optional)" /></label></div>
            <button className="button button-dark admin-submit" disabled={submitting}>{submitting ? "Adding…" : <>Add to collection <Plus size={16} /></>}</button>
          </form>
        </section>
      </div>
      {analytics?.topProducts?.length > 0 && <section className="admin-panel top-sellers-panel"><div className="admin-panel-heading"><div><span className="eyebrow">LOVED A LITTLE MORE</span><h2>Top sellers</h2></div><ArrowUpRight size={17} /></div><div className="seller-list">{analytics.topProducts.map((item, index) => <div className="seller-row" key={item.product}><span className="seller-number">0{index + 1}</span><strong>{item.product}</strong><span className="seller-quantity">{item.quantity} pieces</span></div>)}</div></section>}
    </section>
  );
}
