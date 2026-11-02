import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store.js";

const categories = ["All", "Home", "Accessories", "Textiles", "Stationery"];
const money = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export default function ShopPage({ products }) {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const visibleProducts = useMemo(() => {
    let result = category === "All" ? products : products.filter((product) => product.category === category);
    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [category, products, sort]);

  return (
    <div className="shop-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> A slower kind of shopping</div>
          <h1>Keep the things<br />that <em>feel like you.</em></h1>
          <p>Well-made, well-loved pieces for the everyday. Chosen with care, and made to be kept.</p>
          <a className="button button-dark hero-button" href="#collection">Explore the collection <ArrowRight size={16} /></a>
          <div className="hero-footnote"><span>01 — 08</span><span className="hero-footnote-line" /><span>THE AUTUMN EDITION</span></div>
        </div>
        <div className="hero-image-wrap">
          <img className="hero-image" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1300&q=90" alt="Warm, thoughtfully decorated living room" />
          <div className="hero-image-caption"><span>Spaces to settle into</span><span>01 / 04</span></div>
          <div className="hero-stamp"><span>MADE WITH<br />INTENTION</span><span className="stamp-star">✳</span></div>
        </div>
        <div className="hero-vertical-note">COLLECTED SLOWLY&nbsp; · &nbsp;KEPT FOREVER</div>
      </section>

      <section className="collection-section" id="collection">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow-line" /> THE NORTHFIELD EDIT</div><h2>Objects for <em>every day.</em></h2></div>
          <p>Fewer, better things. Each one picked for how it works, how it feels, and how long it lasts.</p>
        </div>
        <div className="collection-toolbar">
          <div className="category-tabs" role="group" aria-label="Filter by category">
            {categories.map((item) => <button key={item} className={category === item ? "category-tab active" : "category-tab"} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <label className="sort-control"><SlidersHorizontal size={15} /><span>Sort</span>
            <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
        <div className="product-grid">
          {visibleProducts.map((product, index) => (
            <article className="product-card" key={product.id}>
              <Link to={`/products/${product.id}`} className="product-image-link" aria-label={`View ${product.name}`}>
                <div className="product-image-shell"><img src={product.image} alt={product.name} loading="lazy" />
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <span className="product-index">0{index + 1}</span>
                </div>
              </Link>
              <div className="product-card-info">
                <div><span className="product-category">{product.category}</span><Link className="product-name" to={`/products/${product.id}`}>{product.name}</Link></div>
                <span className="product-price">{money(product.price)}</span>
              </div>
              <button className="quick-add flex w-full items-center justify-between transition-colors duration-200" onClick={() => dispatch(addToCart({ product }))}>Add to bag <ArrowRight size={14} /></button>
            </article>
          ))}
        </div>
        {visibleProducts.length === 0 && <div className="empty-state">Nothing in this collection just yet.</div>}
      </section>
      <section className="values-strip"><div><span>01</span><strong>Made to be kept</strong><small>Fewer things, better chosen.</small></div><div><span>02</span><strong>Small-batch thinking</strong><small>Considered at every step.</small></div><div><span>03</span><strong>Everyday, elevated</strong><small>Good design, no fuss.</small></div><ArrowDown className="values-arrow" size={19} /></section>
    </div>
  );
}
