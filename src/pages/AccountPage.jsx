import { useState } from "react";
import { ArrowRight, CalendarDays, Package, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const money = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);
const date = (value) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

export default function AccountPage({ orders }) {
  const user = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState("orders");
  return (
    <section className="account-page">
      <div className="account-welcome"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR NORTHFIELD</div><h1>A little space<br /><em>for you, {user.name.split(" ")[0]}.</em></h1><p>Here’s where your considered finds come together.</p></div><div className="account-welcome-mark"><UserRound size={31} strokeWidth={1.1} /></div></div>
      <div className="account-layout">
        <nav className="account-nav" aria-label="Account navigation"><span className="account-nav-heading">YOUR ACCOUNT</span><button className={tab === "orders" ? "account-nav-item selected" : "account-nav-item"} onClick={() => setTab("orders")}><Package size={17} /> Your orders</button><button className={tab === "details" ? "account-nav-item selected" : "account-nav-item"} onClick={() => setTab("details")}><UserRound size={17} /> Your details</button></nav>
        <div className="account-content">
          {tab === "orders" ? <><div className="account-content-heading"><div><h2>Your orders</h2><p>A little history of the things you’ve found.</p></div><span className="order-count">{orders.length} {orders.length === 1 ? "ORDER" : "ORDERS"}</span></div>
            {orders.length === 0 ? <div className="account-empty"><div className="empty-bag-icon"><Package size={22} /></div><h3>No orders just yet.</h3><p>Your next favorite might be right around the corner.</p><Link className="text-link" to="/shop">Explore the collection <ArrowRight size={15} /></Link></div> :
              <div className="order-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-card-head"><div><span className="order-reference">ORDER {order.id}</span><span className="order-date"><CalendarDays size={13} /> {date(order.createdAt)}</span></div><span className="order-status"><i /> {order.status}</span></div><div className="order-line-items">{order.items.map((item) => <div className="order-line" key={item.productId}><img src={item.image} alt="" /><span>{item.name} <i>× {item.quantity}</i></span><strong>{money(item.price * item.quantity)}</strong></div>)}</div><div className="order-card-total"><span>{order.paymentMethod === "card" ? "Demo card payment" : "Pay on delivery"}</span><strong>{money(order.total)}</strong></div></article>)}</div>}
          </> : <><div className="account-content-heading"><div><h2>Your details</h2><p>The basics, just as they should be.</p></div></div><div className="profile-details"><div><span>FULL NAME</span><strong>{user.name}</strong></div><div><span>EMAIL ADDRESS</span><strong>{user.email}</strong></div><div><span>MEMBER SINCE</span><strong>A Northfield friend</strong></div><p>Need to update anything? For this demo, your account details are securely set when you create your account.</p></div></>}
        </div>
      </div>
    </section>
  );
}
