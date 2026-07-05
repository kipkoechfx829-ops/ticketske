"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <>
      <Navbar />
      <main className="hero">
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <div className="card" style={{ width: "100%", maxWidth: "450px", padding: "2.5rem" }}>
            <h2 className="text-center mb-6">Sign In to TicketsKE</h2>
            {error && <div className="badge" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", width: "100%", textAlign: "center" }}>{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-secondary" style={{ fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="search-input" 
                  style={{ width: "100%", border: "1px solid var(--card-border)", borderRadius: "8px" }} 
                  placeholder="you@example.com" 
                />
              </div>
              <div>
                <label className="text-secondary" style={{ fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="search-input" 
                    style={{ width: "100%", border: "1px solid var(--card-border)", borderRadius: "8px", paddingRight: "40px" }} 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <p className="text-center text-secondary mt-6" style={{ fontSize: "0.9rem" }}>
              Don't have an account? <Link href="/register" style={{ color: "var(--accent-color)" }}>Create one</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
