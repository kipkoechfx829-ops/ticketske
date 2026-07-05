import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Event from "@/models/Event";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  await connectToDatabase();
  
  // Fetch user's orders and populate the event details
  const orders = await Order.find({ userId }).populate("eventId").sort({ createdAt: -1 });

  return (
    <>
      <Navbar />
      <main className="container section" style={{ paddingTop: "120px", minHeight: "100vh" }}>
        <h1 className="mb-8">My Tickets</h1>
        
        {orders.length === 0 ? (
          <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <h3 className="text-secondary">You haven't purchased any tickets yet.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order: any) => (
              <div key={order._id.toString()} className="card flex" style={{ flexDirection: "row", padding: "0" }}>
                <div style={{ width: "120px", backgroundColor: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "2px dashed var(--card-border)" }}>
                  <div style={{ transform: "rotate(-90deg)", fontWeight: 800, letterSpacing: "4px", color: "var(--text-secondary)" }}>
                    ADMIT ONE
                  </div>
                </div>
                <div style={{ padding: "1.5rem", flex: 1 }}>
                  <span className="badge">{order.status}</span>
                  <h3 style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>{order.eventId?.title || "Event Unavailable"}</h3>
                  <p className="text-secondary" style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                    {order.eventId?.date} • {order.eventId?.location}
                  </p>
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>TICKET ID</p>
                      <p style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>{order._id.toString().slice(-8).toUpperCase()}</p>
                    </div>
                    <button className="btn btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>View QR</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
