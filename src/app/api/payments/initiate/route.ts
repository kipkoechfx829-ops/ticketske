import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

const PAYHERO_USERNAME = process.env.PAYHERO_USERNAME!;
const PAYHERO_PASSWORD = process.env.PAYHERO_PASSWORD!;
const PAYHERO_CHANNEL_ID = process.env.PAYHERO_CHANNEL_ID!;

function getBasicAuthToken() {
  const credentials = `${PAYHERO_USERNAME}:${PAYHERO_PASSWORD}`;
  return Buffer.from(credentials).toString("base64");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized - please log in" }, { status: 401 });
    }

    const { phoneNumber, eventId, tierId, tierName, amount, quantity } = await req.json();

    if (!phoneNumber || !eventId || !tierId || !amount) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Format phone number: ensure it starts with 254
    let formattedPhone = phoneNumber.replace(/\s/g, "").replace(/^0/, "254").replace(/^\+/, "");

    await connectToDatabase();

    // Create a PENDING order first
    const order = await Order.create({
      userId: (session.user as any).id,
      eventId,
      tierId,
      quantity: quantity || 1,
      totalAmount: amount,
      status: "PENDING",
    });

    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/payments/callback`;

    // Initiate PayHero STK Push
    const payheroResponse = await fetch("https://backend.payhero.co.ke/api/v2/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${getBasicAuthToken()}`,
      },
      body: JSON.stringify({
        amount: amount,
        phone_number: formattedPhone,
        channel_id: Number(PAYHERO_CHANNEL_ID),
        provider: "m-pesa",
        external_reference: order._id.toString(),
        callback_url: callbackUrl,
      }),
    });

    const payheroData = await payheroResponse.json();

    if (!payheroResponse.ok) {
      // Mark order as failed if STK push initiation fails
      await Order.findByIdAndUpdate(order._id, { status: "FAILED" });
      return NextResponse.json(
        { message: payheroData.message || "STK push initiation failed" },
        { status: 400 }
      );
    }

    // Store the PayHero reference in the order
    await Order.findByIdAndUpdate(order._id, {
      mpesaReceiptNumber: payheroData.reference,
    });

    return NextResponse.json({
      message: "STK Push sent! Check your phone.",
      orderId: order._id.toString(),
      reference: payheroData.reference,
    });
  } catch (error) {
    console.error("PayHero payment error:", error);
    return NextResponse.json({ message: "Payment initiation failed" }, { status: 500 });
  }
}
