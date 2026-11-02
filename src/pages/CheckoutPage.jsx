import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "../api.js";
import { clearCart } from "../store.js";

const money = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);

export default function CheckoutPage({ onOrderPlaced }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const items = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8;

  async function placeOrder(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiRequest("/orders", {
        method: "POST",
        token,
        body: { items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })), paymentMethod },
      });
      dispatch(clearCart());
      await onOrderPlaced();
      navigate("/account");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!items.length) return <div className="empty-bag checkout-empty"><div className="empty-bag-icon"><Check size={24} /></div><h2>Nothing to check out just yet.</h2><p>Your bag is empty. Find something you'll love keeping.</p><Link className="button button-dark" to="/shop">Browse the collection <ArrowRight size={16} /></Link></div>;

  return (
    <section className="checkout-page">
      <Link to="/cart" className="back-link"><ArrowLeft size={15} /> Back to your bag</Link>
      <div className="eyebrow"><span className="eyebrow-line" /> ONE LAST THING</div>
      <h1>Make it <em>yours.</em></h1>
      <p className="checkout-intro">Your pieces are almost on their way. Just a few details.</p>
      <form className="checkout-layout" onSubmit={placeOrder}>
        <div className="checkout-main">
          <section className="checkout-card">
            <div className="checkout-section-heading"><span className="checkout-step">01</span><div><h2>Delivery details</h2><p>We’ll send your order update here.</p></div></div>
            <div className="delivery-contact"><div className="delivery-icon"><Truck size={18} /></div><div><strong>{user.name}</strong><span>{user.email}</span></div><span className="delivery-label">Standard delivery</span></div>
            <p className="demo-delivery-note">This demo checkout confirms your order without collecting a shipping address.</p>
          </section>
          <section className="checkout-card">
            <div className="checkout-section-heading"><span className="checkout-step">02</span><div><h2>Payment, your way</h2><p>Choose how you’d like to pay.</p></div></div>
            <label className={`payment-option ${paymentMethod === "card" ? "payment-option-active" : ""}`}><input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} /><span className="payment-option-icon"><CreditCard size={18} /></span><span className="payment-option-copy"><strong>Card</strong><small>Demo payment — no card details collected</small></span><span className="radio-dot" /></label>
            <label className={`payment-option ${paymentMethod === "delivery" ? "payment-option-active" : ""}`}><input type="radio" name="payment" value="delivery" checked={paymentMethod === "delivery"} onChange={() => setPaymentMethod("delivery")} /><span className="payment-option-icon"><Truck size={18} /></span><span className="payment-option-copy"><strong>Pay on delivery</strong><small>Pay when your order arrives</small></span><span className="radio-dot" /></label>
            <p className="secure-note"><ShieldCheck size={15} /> This is a demo store. No real payment is processed.</p>
          </section>
          {error && <div className="form-error" role="alert">{error}</div>}
        </div>
        <aside className="order-summary checkout-summary"><h2>Your pieces</h2>{items.map(({ product, quantity }) => <div className="checkout-product" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>Qty {quantity}</span></div><b>{money(product.price * quantity)}</b></div>)}<div className="summary-rule" /><div className="summary-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-row"><span>Delivery</span><strong>{shipping ? money(shipping) : "On us"}</strong></div><div className="summary-rule" /><div className="summary-row summary-total"><span>Total</span><strong>{money(subtotal + shipping)}</strong></div><button className="button button-dark checkout-button" type="submit" disabled={submitting}>{submitting ? "Confirming…" : <>Place demo order <ArrowRight size={16} /></>}</button><p className="checkout-caption">By placing your order, you agree to our very reasonable good-things policy.</p></aside>
      </form>
    </section>
  );
}
