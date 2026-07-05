"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="search-input" 
                  style={{ width: "100%", border: "1px solid var(--card-border)", borderRadius: "8px" }} 
                  placeholder="••••••••" 
                />
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
