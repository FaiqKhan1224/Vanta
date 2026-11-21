"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

function PasswordField({ label, value, onChange, autoComplete }: { label: string; value: string; onChange: (v: string) => void; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <label className="field">
      <span>{label}</span>
      <div className="pw">
        <input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} required />
        <button type="button" className="toggle" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? "Hide" : "Show"}</button>
      </div>
    </label>
  );
}

const safeNext = (n: string | null) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "");

type Mode = "login" | "signup";

export default function AuthForm({ mode: initial }: { mode: Mode }) {
  const [mode, setMode] = useState<Mode>(initial);
  const signupMode = mode === "signup";
  const { login, signup, user, loading } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [next, setNext] = useState("");
  useEffect(() => setNext(safeNext(new URLSearchParams(location.search).get("next"))), []);
  const set = (k: string) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => { if (!loading && user) router.replace(next || "/home"); }, [loading, user, router, next]);

  // Switch Login <-> Signup in place (no page change), keeping the URL in sync and preserving ?next=
  function switchTo(m: Mode) {
    if (m === mode || busy) return;
    setMode(m); setErr(""); setF((p) => ({ ...p, password: "", confirm: "" }));
    history.replaceState(null, "", "/" + m + (next ? "?next=" + encodeURIComponent(next) : ""));
  }

  async function submit(e: FormEvent) {
    e.preventDefault(); setErr("");
    if (signupMode) {
      if (f.password.length < 8) return setErr("Password must be at least 8 characters");
      if (f.password !== f.confirm) return setErr("Passwords do not match");
    }
    setBusy(true);
    try {
      if (signupMode) await signup(f.name, f.email, f.password); else await login(f.email, f.password);
      router.replace(next || "/home");
    } catch (x) { setErr((x as Error).message); }
    setBusy(false);
  }

  return (
    <main className="av">
      <div className="av-bg" aria-hidden="true">
        <img src="/images/hero-main.jpg" alt="" />
      </div>
      <header className="av-top">
        <span className="logo">VANTA</span>
        <div className="av-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={!signupMode} className={!signupMode ? "on" : ""} onClick={() => switchTo("login")}>Login</button>
          <button type="button" role="tab" aria-selected={signupMode} className={signupMode ? "on" : ""} onClick={() => switchTo("signup")}>Sign up</button>
          <span className="av-ind" style={{ transform: signupMode ? "translateX(100%)" : "none" }} />
        </div>
        <button type="button" className="av-cta" onClick={() => switchTo(signupMode ? "login" : "signup")}>{signupMode ? "Login" : "Sign up"}</button>
      </header>
      <section className="av-card" aria-label={signupMode ? "Create account" : "Sign in"}>
        <form key={mode} className="av-form" onSubmit={submit}>
          <p className="eyebrow">{signupMode ? "Create account" : "Welcome back"}</p>
          <h2>{signupMode ? "Join the studio" : "Sign in"}</h2>
          <p className="av-sub">{signupMode ? "Create your VANTA account to book appointments and manage your bookings." : "Sign in to book appointments and manage your bookings."}</p>
          {signupMode && (
            <label className="field"><span>Full name</span><input value={f.name} onChange={(e) => set("name")(e.target.value)} autoComplete="name" required /></label>
          )}
          <label className="field"><span>Email</span><input type="email" value={f.email} onChange={(e) => set("email")(e.target.value)} autoComplete="email" required /></label>
          <PasswordField label="Password" value={f.password} onChange={set("password")} autoComplete={signupMode ? "new-password" : "current-password"} />
          {signupMode && <PasswordField label="Confirm password" value={f.confirm} onChange={set("confirm")} autoComplete="new-password" />}
          {err && <p className="error" role="alert">{err}</p>}
          <button className="av-submit" disabled={busy}>{busy ? "Please wait…" : signupMode ? "Create account" : "Sign in"}</button>
</form>
      </section>
    </main>
  );
}
