import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../store.js";

const money = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8;

  return (
    <section className="cart-page">
      <Link to="/shop" className="back-link"><ArrowLeft size={15} /> Keep looking</Link>
      <div className="page-title-row"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR NORTHFIELD BAG</div><h1>Your bag<span className="title-count">{items.length ? ` · ${items.reduce((sum, item) => sum + item.quantity, 0)} pieces` : ""}</span></h1></div></div>
      {items.length === 0 ? <div className="empty-bag"><div className="empty-bag-icon"><ShoppingBag size={25} /></div><h2>A little room for something good.</h2><p>Your bag is taking a well-earned breather.</p><Link className="button button-dark" to="/shop">Explore the collection <ArrowRight size={16} /></Link></div> : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map(({ product, quantity }) => (
              <article className="cart-item" key={product.id}>
                <Link to={`/products/${product.id}`} className="cart-item-image"><img src={product.image} alt={product.name} /></Link>
                <div className="cart-item-copy"><span className="product-category">{product.category}</span><Link className="product-name" to={`/products/${product.id}`}>{product.name}</Link><span className="cart-item-color">{product.color}</span>
                  <div className="quantity-stepper"><button aria-label={`Decrease ${product.name} quantity`} disabled={quantity <= 1} onClick={() => dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }))}><Minus size={13} /></button><span>{quantity}</span><button aria-label={`Increase ${product.name} quantity`} disabled={quantity >= 20} onClick={() => dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }))}><Plus size={13} /></button></div>
                </div>
                <div className="cart-item-end"><strong>{money(product.price * quantity)}</strong><button className="remove-button" onClick={() => dispatch(removeFromCart(product.id))}><Trash2 size={14} /><span>Remove</span></button></div>
              </article>
            ))}
            <div className="shipping-note"><span>✳</span> {subtotal >= 100 ? "Your delivery is on us." : `Complimentary delivery on orders over $100 · ${money(100 - subtotal)} to go.`}</div>
          </div>
          <aside className="order-summary"><h2>A little summary</h2><div className="summary-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-row"><span>Delivery</span><strong>{shipping === 0 ? "On us" : money(shipping)}</strong></div><div className="summary-rule" /><div className="summary-row summary-total"><span>Total</span><strong>{money(subtotal + shipping)}</strong></div><Link className="button button-dark checkout-button" to="/checkout">Continue to checkout <ArrowRight size={16} /></Link><p className="checkout-caption">Taxes calculated at checkout. Always packed with care.</p></aside>
        </div>
      )}
    </section>
  );
}
