import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { PLAN_PRICES, isValidPlan, getPlanKey } from "@/lib/plansConfig";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planName } = body;

    if (!planName || !isValidPlan(planName)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const planKey = getPlanKey(planName);
    const amount = PLAN_PRICES[planKey];

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("Razorpay API keys are missing in environment variables.");
      return NextResponse.json(
        { error: "Razorpay configuration error on server" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id,
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
