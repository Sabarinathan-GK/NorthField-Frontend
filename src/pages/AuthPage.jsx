import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Leaf } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";

export default function AuthPage({ mode, onAuth }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await apiRequest(isSignup ? "/auth/signup" : "/auth/login", {
        method: "POST",
        body: isSignup ? form : { email: form.email, password: form.password },
      });
      onAuth(result);
      navigate(location.state?.from || (result.user.role === "admin" ? "/admin" : "/account"), { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <Link to="/shop" className="back-link"><ArrowLeft size={15} /> Back to the collection</Link>
      <div className="auth-layout">
        <div className="auth-art">
          <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85" alt="Calm, natural home interior" />
          <div className="auth-art-copy"><span>THE ART OF KEEPING</span><p>Good things find<br />their way home.</p></div>
          <Leaf className="auth-leaf" size={22} />
        </div>
        <div className="auth-form-wrap">
          <div className="eyebrow"><span className="eyebrow-line" /> {isSignup ? "A PLACE OF YOUR OWN" : "WELCOME BACK"}</div>
          <h1>{isSignup ? <>Make yourself<br /><em>at home.</em></> : <>Good to see<br /><em>you again.</em></>}</h1>
          <p className="auth-intro">{isSignup ? "Create your account and keep all your considered finds in one place." : "Sign in to find your orders, saved details, and everything you love."}</p>
          <form onSubmit={submit} className="auth-form">
            {isSignup && <label className="field-label">Your name<input required autoComplete="name" name="name" value={form.name} onChange={update} placeholder="How should we call you?" minLength={2} /></label>}
            <label className="field-label">Email address<input required autoComplete="email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" /></label>
            <label className="field-label">Password<span className="password-input-wrap"><input required autoComplete={isSignup ? "new-password" : "current-password"} name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={update} placeholder={isSignup ? "At least 8 characters" : "Your password"} minLength={isSignup ? 8 : undefined} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button type="submit" className="button button-dark auth-submit" disabled={submitting}>{submitting ? "One moment…" : <>{isSignup ? "Create your account" : "Sign in"} <ArrowRight size={16} /></>}</button>
          </form>
          <p className="auth-switch">{isSignup ? "Already found your way here?" : "New to Northfield?"} <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create an account"}</Link></p>
        </div>
      </div>
    </section>
  );
}
