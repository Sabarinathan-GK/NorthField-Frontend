import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store.js";

const money = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export default function ProductPage({ products }) {
  const { id } = useParams();
  const product = products.find((entry) => entry.id === id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  if (!product) return <div className="empty-state product-not-found"><p>That piece has wandered off.</p><Link className="text-link" to="/shop">Back to the collection <ArrowRight size={15} /></Link></div>;

  function addItem() {
    dispatch(addToCart({ product }));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <section className="detail-page">
      <Link to="/shop" className="back-link"><ArrowLeft size={15} /> Back to the collection</Link>
      <div className="detail-layout">
        <div className="detail-image"><img src={product.image} alt={product.name} /><span className="detail-image-index">Nº 0{products.indexOf(product) + 1}</span></div>
        <div className="detail-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> {product.category.toUpperCase()} · NORTHFIELD GOODS</div>
          <h1>{product.name}</h1>
          <div className="detail-price">{money(product.price)}</div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-rule" />
          <div className="detail-attribute"><span>Color / finish</span><strong>{product.color || "Thoughtfully finished"}</strong></div>
          <div className="detail-attribute"><span>Our promise</span><strong>Made for everyday use</strong></div>
          <button className="button button-dark add-detail-button" onClick={addItem}>{added ? <><Check size={17} /> Added to your bag</> : <>Add to bag — {money(product.price)} <Plus size={16} /> </>}</button>
          <button className="text-link continue-link" onClick={() => navigate("/cart")}>View your bag <ArrowRight size={15} /></button>
          <div className="detail-note">A good thing should feel good to keep. Packed thoughtfully, and sent with care.</div>
        </div>
      </div>
    </section>
  );
}
