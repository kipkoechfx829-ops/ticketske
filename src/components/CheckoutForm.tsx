"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TicketTier {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  description?: string;
}

interface CheckoutProps {
  eventId: string;
  tiers: TicketTier[];
}

type PaymentStatus = "idle" | "loading" | "waiting" | "success" | "failed";

export default function CheckoutForm({ eventId, tiers }: CheckoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<TicketTier>(tiers[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const totalAmount = selectedTier.price * quantity;

  const handlePayment = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      setMessage("Please enter a valid M-Pesa phone number.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          eventId,
          tierId: selectedTier._id || selectedTier.id,
          tierName: selectedTier.name,
          amount: totalAmount,
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("failed");
        setMessage(data.message || "Payment failed. Please try again.");
        return;
      }

      setOrderId(data.orderId);
      setStatus("waiting");
      setMessage("✓ STK Push sent! Enter your M-Pesa PIN on your phone.");

      // Poll for payment completion every 3 seconds for up to 2 minutes
      const interval = setInterval(async () => {
        const statusRes = await fetch(`/api/payments/status/${data.orderId}`);
        const statusData = await statusRes.json();

        if (statusData.status === "COMPLETED") {
          clearInterval(interval);
          setStatus("success");
          setMessage("🎉 Payment successful! Your ticket is confirmed.");
        } else if (statusData.status === "FAILED") {
          clearInterval(interval);
          setStatus("failed");
          setMessage("Payment was not completed. Please try again.");
        }
      }, 3000);

      // Stop polling after 2 minutes
      setTimeout(() => clearInterval(interval), 120000);
    } catch (err) {
      setStatus("failed");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="card" style={{ border: "1px solid rgba(16, 185, 129, 0.4)" }}>
      <div className="card-content">
        <h3 className="mb-6">Select Tickets</h3>

        {/* Tier Selection */}
        <div className="flex flex-col gap-3 mb-6">
          {tiers.map((tier) => (
            <label
              key={tier._id || tier.id}
              onClick={() => setSelectedTier(tier)}
              style={{
                padding: "1rem",
                border: `1px solid ${selectedTier.name === tier.name ? "var(--accent-color)" : "var(--card-border)"}`,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s",
                backgroundColor: selectedTier.name === tier.name ? "rgba(16,185,129,0.05)" : "transparent",
              }}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="ticket-tier"
                    checked={selectedTier.name === tier.name}
                    onChange={() => setSelectedTier(tier)}
                    style={{ accentColor: "var(--accent-color)" }}
                    readOnly
                  />
                  <span style={{ fontWeight: 600 }}>{tier.name}</span>
                </div>
                <span style={{ fontWeight: 800, color: "var(--accent-color)" }}>
                  {tier.price === 0 ? "Free" : `KES ${tier.price.toLocaleString()}`}
                </span>
              </div>
              {tier.description && (
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginLeft: "1.75rem" }}>
                  {tier.description}
                </p>
              )}
            </label>
          ))}
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="btn btn-outline"
              style={{ padding: "0.4rem 1rem", fontSize: "1.2rem" }}
            >−</button>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, minWidth: "2ch", textAlign: "center" }}>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="btn btn-outline"
              style={{ padding: "0.4rem 1rem", fontSize: "1.2rem" }}
            >+</button>
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-6">
          <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. 0712 345 678"
            className="search-input"
            style={{ width: "100%", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "0.75rem 1rem" }}
          />
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-6 p-4" style={{ backgroundColor: "rgba(16,185,129,0.05)", borderRadius: "12px", border: "1px solid rgba(16,185,129,0.2)" }}>
          <span style={{ fontWeight: 600 }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--accent-color)" }}>
            {totalAmount === 0 ? "Free" : `KES ${totalAmount.toLocaleString()}`}
          </span>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
            backgroundColor: status === "success" ? "rgba(16,185,129,0.1)" : status === "failed" ? "rgba(239,68,68,0.1)" : "rgba(59,130,246,0.1)",
            color: status === "success" ? "var(--accent-color)" : status === "failed" ? "#ef4444" : "#60a5fa",
            border: `1px solid ${status === "success" ? "rgba(16,185,129,0.3)" : status === "failed" ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}`,
          }}>
            {message}
          </div>
        )}

        {/* Pay Button */}
        {status === "success" ? (
          <button className="btn btn-primary w-full" style={{ padding: "1rem" }} onClick={() => router.push("/dashboard")}>
            View My Tickets →
          </button>
        ) : (
          <button
            className="btn btn-primary w-full"
            style={{ padding: "1rem", opacity: status === "loading" || status === "waiting" ? 0.7 : 1 }}
            onClick={handlePayment}
            disabled={status === "loading" || status === "waiting"}
          >
            {status === "loading"
              ? "Sending STK Push..."
              : status === "waiting"
              ? "Waiting for Payment..."
              : totalAmount === 0
              ? "Reserve Free Ticket"
              : `Pay KES ${totalAmount.toLocaleString()} via M-Pesa`}
          </button>
        )}

        {!session && (
          <p className="text-center text-secondary mt-4" style={{ fontSize: "0.85rem" }}>
            You need to <a href="/login" style={{ color: "var(--accent-color)" }}>sign in</a> to purchase tickets.
          </p>
        )}
      </div>
    </div>
  );
}
