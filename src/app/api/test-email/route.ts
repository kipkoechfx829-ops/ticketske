import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get("to");

  if (!to) {
    return NextResponse.json(
      { message: "Provide a recipient: /api/test-email?to=you@example.com" },
      { status: 400 }
    );
  }

  if (!process.env.SENDGRID_API_KEY) {
    return NextResponse.json(
      { message: "SENDGRID_API_KEY is not set in environment variables." },
      { status: 500 }
    );
  }

  if (!process.env.SENDGRID_FROM_EMAIL) {
    return NextResponse.json(
      { message: "SENDGRID_FROM_EMAIL is not set in environment variables." },
      { status: 500 }
    );
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      from: { name: "TicketsKE", email: process.env.SENDGRID_FROM_EMAIL },
      to,
      subject: "✅ SendGrid Test — TicketsKE Email Working!",
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #050505; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(to right, #10b981, #3b82f6); padding: 40px; text-align: center;">
            <h1 style="margin: 0; font-size: 1.75rem; color: #fff;">✅ Email Delivery Working!</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85);">TicketsKE SendGrid Test</p>
          </div>
          <div style="padding: 40px;">
            <p style="color: #a1a1aa; line-height: 1.7;">
              This is a test email confirming that <strong style="color: #fff">SendGrid is correctly configured</strong> 
              for TicketsKE.<br/><br/>
              When a customer pays via M-Pesa, an email like this will be automatically sent to their inbox 
              with their ticket details and QR code link.
            </p>
            <div style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <p style="color: #a1a1aa; font-size: 12px; margin: 0 0 4px;">SENT FROM</p>
              <p style="font-family: monospace; color: #10b981; margin: 0;">${process.env.SENDGRID_FROM_EMAIL}</p>
              <p style="color: #a1a1aa; font-size: 12px; margin: 12px 0 4px;">SENT TO</p>
              <p style="font-family: monospace; margin: 0;">${to}</p>
              <p style="color: #a1a1aa; font-size: 12px; margin: 12px 0 4px;">TIMESTAMP</p>
              <p style="font-family: monospace; margin: 0;">${new Date().toISOString()}</p>
            </div>
            <p style="color: #10b981; font-weight: 700; text-align: center; margin-top: 24px;">
              🎉 All systems are go!
            </p>
            <p style="color: #555; font-size: 12px; margin-top: 24px; text-align: center;">
              TicketsKE — Secure Kenyan Event Tickets powered by M-Pesa
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `✅ Test email sent successfully to ${to}`,
      from: process.env.SENDGRID_FROM_EMAIL,
    });
  } catch (error: any) {
    console.error("SendGrid test error:", error?.response?.body || error);
    return NextResponse.json(
      {
        success: false,
        message: "❌ SendGrid test failed.",
        error: error?.response?.body?.errors || error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
