import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// This endpoint receives payment status from PayHero after the user completes payment
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("PayHero callback received:", JSON.stringify(data, null, 2));

    // PayHero sends: { status, external_reference, amount, phone_number, receipt_number, ... }
    const { status, external_reference, receipt_number } = data;

    if (!external_reference) {
      return NextResponse.json({ message: "Missing external_reference" }, { status: 400 });
    }

    await connectToDatabase();

    if (status === "SUCCESS") {
      // Update the order to COMPLETED
      const order = await Order.findByIdAndUpdate(
        external_reference,
        { status: "COMPLETED", mpesaReceiptNumber: receipt_number },
        { new: true }
      );

      // Send confirmation email if we have the order and API key
      if (order && process.env.RESEND_API_KEY) {
        try {
          const user = await User.findById(order.userId);
          if (user?.email) {
            const ticketId = order._id.toString();
            const shortId = ticketId.slice(-8).toUpperCase();
            const dashboardUrl = `${process.env.NEXTAUTH_URL || "https://ticketske-glzl.onrender.com"}/dashboard`;

            await resend.emails.send({
              from: "TicketsKE <tickets@resend.dev>",
              to: user.email,
              subject: `Your Ticket is Confirmed! 🎟️ [${shortId}]`,
              html: `
                <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #050505; color: #fff; border-radius: 16px; overflow: hidden;">
                  <div style="background: linear-gradient(to right, #10b981, #3b82f6); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; font-size: 2rem; color: #fff;">🎟️ You're In!</h1>
                    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85);">Your ticket is confirmed</p>
                  </div>
                  
                  <div style="padding: 40px;">
                    <p style="color: #a1a1aa; margin-bottom: 8px;">Hi <strong style="color: #fff">${user.name}</strong>,</p>
                    <p style="color: #a1a1aa; line-height: 1.6;">
                      Great news! Your M-Pesa payment was successful and your ticket has been confirmed. Show the QR code in your dashboard at the gate.
                    </p>
                    
                    <div style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 24px; margin: 24px 0;">
                      <div style="margin-bottom: 12px;">
                        <p style="color: #a1a1aa; font-size: 12px; margin: 0 0 4px;">TICKET ID</p>
                        <p style="font-family: monospace; font-size: 1.2rem; color: #10b981; margin: 0;">${shortId}</p>
                      </div>
                      <div style="margin-bottom: 12px;">
                        <p style="color: #a1a1aa; font-size: 12px; margin: 0 0 4px;">TIER</p>
                        <p style="font-weight: 600; margin: 0;">${order.tierId} (×${order.quantity})</p>
                      </div>
                      <div style="margin-bottom: 12px;">
                        <p style="color: #a1a1aa; font-size: 12px; margin: 0 0 4px;">AMOUNT PAID</p>
                        <p style="font-weight: 600; color: #10b981; margin: 0;">KES ${order.totalAmount?.toLocaleString()}</p>
                      </div>
                      ${receipt_number ? `<div>
                        <p style="color: #a1a1aa; font-size: 12px; margin: 0 0 4px;">M-PESA RECEIPT</p>
                        <p style="font-family: monospace; margin: 0;">${receipt_number}</p>
                      </div>` : ""}
                    </div>
                    
                    <div style="text-align: center; margin-top: 32px;">
                      <a href="${dashboardUrl}" style="background: #10b981; color: #fff; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 700; display: inline-block;">
                        View My QR Ticket
                      </a>
                    </div>
                    
                    <p style="color: #555; font-size: 12px; margin-top: 32px; text-align: center;">
                      TicketsKE — Secure Kenyan Event Tickets powered by M-Pesa
                    </p>
                  </div>
                </div>
              `,
            });
          }
        } catch (emailError) {
          // Don't fail the callback if email fails
          console.error("Failed to send confirmation email:", emailError);
        }
      }
    } else if (status === "FAILED" || status === "CANCELLED") {
      await Order.findByIdAndUpdate(external_reference, { status: "FAILED" });
    }

    // Acknowledge receipt to PayHero
    return NextResponse.json({ message: "Callback processed" }, { status: 200 });
  } catch (error) {
    console.error("PayHero callback error:", error);
    return NextResponse.json({ message: "Callback processing failed" }, { status: 500 });
  }
}

