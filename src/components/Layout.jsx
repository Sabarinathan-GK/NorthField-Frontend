import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, Box, LayoutDashboard, LogOut, Menu, Package, ShoppingBag, UserRound, X } from "lucide-react";
import { clearCredentials } from "../store.js";

export default function Layout({ children, notice, clearNotice }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const [mobileOpen, setMobileOpen] = useState(false);

  function signOut() {
    dispatch(clearCredentials());
    navigate("/shop");
    setMobileOpen(false);
  }

  const links = [
    { to: "/shop", label: "Shop", icon: ShoppingBag },
    ...(user ? [{ to: "/account", label: "Your account", icon: UserRound }] : []),
    ...(user?.role === "admin" ? [{ to: "/admin", label: "Studio dashboard", icon: LayoutDashboard }] : []),
  ];

  return (
    <div className="app-shell min-h-screen">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark">n.</div>
          <div><span className="brand-name">northfield</span><span className="brand-caption">GOODS FOR EVERYDAY</span></div>
          <button className="icon-button mobile-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={19} /></button>
        </div>
        <div className="sidebar-label">YOUR SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              <Icon size={18} strokeWidth={1.7} /> <span>{label}</span>
              {to === "/shop" && <ArrowRight className="nav-arrow" size={15} />}
            </NavLink>
          ))}
          <NavLink to="/cart" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
            <ShoppingBag size={18} strokeWidth={1.7} /><span>Your bag</span>{cartCount > 0 && <span className="nav-count">{cartCount}</span>}
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <div className="note-icon"><Box size={17} /></div>
            <p>Good things, made to stay.<br /><span>Thoughtful by nature.</span></p>
          </div>
          <div className="sidebar-profile">
            <div className="avatar">{user ? user.name.slice(0, 1).toUpperCase() : <UserRound size={17} />}</div>
            <div className="profile-copy">
              <strong>{user?.name || "Welcome, friend"}</strong>
              <span>{user?.email || "Your little corner of Northfield"}</span>
            </div>
            {user
              ? <button className="icon-button profile-action" onClick={signOut} aria-label="Sign out"><LogOut size={17} /></button>
              : <NavLink className="profile-action sign-in-link" to="/login">Sign in</NavLink>}
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="mobile-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}

      <main className="main-area flex min-h-screen flex-col">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
          <div className="breadcrumb"><span>Northfield</span><span className="breadcrumb-dot">/</span><strong>Considered living</strong></div>
          <div className="topbar-actions">
            <span className="topbar-message">A little more thoughtful, every day.</span>
            <NavLink to="/cart" className="topbar-bag" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={19} /><span>Bag</span>{cartCount > 0 && <i>{cartCount}</i>}</NavLink>
          </div>
        </header>
        {notice && <div className="notice-banner" role="status">{notice}<button onClick={clearNotice} aria-label="Dismiss message"><X size={16} /></button></div>}
        <div className="page-content flex-1">{children}</div>
        <footer className="site-footer"><span>© {new Date().getFullYear()} Northfield Goods</span><span>Made for the long run <span className="footer-heart">✳</span></span></footer>
      </main>
    </div>
  );
}
