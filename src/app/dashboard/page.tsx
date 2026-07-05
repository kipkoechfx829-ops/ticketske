import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Event from "@/models/Event";
import TicketCard from "@/components/TicketCard";

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
              <TicketCard key={order._id.toString()} order={JSON.parse(JSON.stringify(order))} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
