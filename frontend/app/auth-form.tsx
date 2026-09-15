"use client";

import { useState, type FormEvent } from "react";
import { authRequest } from "./lib/api";

export type AuthUser = { id: string; name: string; email: string };

export default function AuthForm({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [signup, setSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await authRequest(signup ? "/auth/signup" : "/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message || "Unable to sign in."); return; }
      setPassword("");
      if (signup) { setSignup(false); setMessage("Account created. Log in to start designing."); }
      else onLogin(data.user);
    } catch { setMessage("Cannot reach the server. Please try again."); }
    finally { setBusy(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-900">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-lg">
        <div><p className="text-sm font-semibold text-indigo-600">MiniCanvas</p><h1 className="mt-2 text-2xl font-bold">{signup ? "Create your account" : "Welcome back"}</h1></div>
        {signup && <label className="block text-sm">Name<input required maxLength={80} autoComplete="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded border p-3" /></label>}
        <label className="block text-sm">Email<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded border p-3" /></label>
        <label className="block text-sm">Password<input required type="password" minLength={12} maxLength={128} autoComplete={signup ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded border p-3" />{signup && <span className="text-xs text-slate-500">Use 12–128 characters.</span>}</label>
        {message && <p role="status" className="text-sm text-indigo-700">{message}</p>}
        <button disabled={busy} className="w-full rounded bg-indigo-600 p-3 font-semibold text-white disabled:opacity-50">{busy ? "Please wait…" : signup ? "Sign up" : "Log in"}</button>
        <button type="button" disabled={busy} onClick={() => { setSignup(!signup); setMessage(""); setPassword(""); }} className="w-full text-sm text-indigo-700">{signup ? "Already have an account? Log in" : "New here? Sign up"}</button>
      </form>
    </main>
  );
}
