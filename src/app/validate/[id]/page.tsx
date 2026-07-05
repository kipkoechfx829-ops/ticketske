import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Event from "@/models/Event";
import User from "@/models/User";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";

export default async function ValidateTicketPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  await connectToDatabase();
  
  let order;
  try {
    order = await Order.findById(params.id).populate("eventId").populate("userId");
  } catch (error) {
    order = null;
  }

  return (
    <>
      <Navbar />
      <main className="container section" style={{ paddingTop: "120px", display: "flex", justifyContent: "center" }}>
        <div className="card" style={{ maxWidth: "500px", width: "100%", padding: "3rem", textAlign: "center" }}>
          
          {!order ? (
            <>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              </div>
              <h2 style={{ color: "#ef4444", marginBottom: "0.5rem" }}>Invalid Ticket</h2>
              <p className="text-secondary">This ticket ID does not exist in our system.</p>
            </>
          ) : order.status !== "COMPLETED" ? (
            <>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h2 style={{ color: "#f59e0b", marginBottom: "0.5rem" }}>Payment Not Completed</h2>
              <p className="text-secondary">This ticket is currently marked as {order.status}.</p>
            </>
          ) : (
            <>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h2 style={{ color: "var(--accent-color)", marginBottom: "0.5rem" }}>Valid Ticket</h2>
              <p className="text-secondary" style={{ marginBottom: "2rem" }}>Access Granted</p>
              
              <div style={{ textAlign: "left", backgroundColor: "var(--bg-primary)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--card-border)" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Event</p>
                  <p style={{ fontWeight: 600 }}>{order.eventId?.title || order.eventId}</p>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Attendee Name</p>
                  <p style={{ fontWeight: 600 }}>{order.userId?.name || "Unknown"}</p>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Tier & Quantity</p>
                  <p style={{ fontWeight: 600 }}>{order.tierId} (x{order.quantity})</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Ticket ID</p>
                  <p style={{ fontFamily: "monospace" }}>{order._id.toString()}</p>
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: "2rem" }}>
            <a href="/admin" className="btn btn-outline w-full">Back to Dashboard</a>
          </div>
        </div>
      </main>
    </>
  );
}
