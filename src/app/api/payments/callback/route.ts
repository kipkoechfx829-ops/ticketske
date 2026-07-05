import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

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
      await Order.findByIdAndUpdate(external_reference, {
        status: "COMPLETED",
        mpesaReceiptNumber: receipt_number,
      });
    } else if (status === "FAILED" || status === "CANCELLED") {
      await Order.findByIdAndUpdate(external_reference, {
        status: "FAILED",
      });
    }

    // Acknowledge receipt to PayHero
    return NextResponse.json({ message: "Callback processed" }, { status: 200 });
  } catch (error) {
    console.error("PayHero callback error:", error);
    return NextResponse.json({ message: "Callback processing failed" }, { status: 500 });
  }
}
