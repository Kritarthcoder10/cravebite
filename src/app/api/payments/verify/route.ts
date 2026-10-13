import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ message: "Missing verification parameters" }, { status: 400 });
    }

    let isValid = false;

    // Check if mock order
    if (razorpayOrderId.startsWith("order_mock_")) {
      isValid = razorpaySignature === "mock_signature";
    } else {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        return NextResponse.json({ message: "Key secret not configured" }, { status: 500 });
      }

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");

      isValid = generatedSignature === razorpaySignature;
    }

    if (!isValid) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "FAILED",
          status: "CANCELLED",
        },
      });

      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
    }

    // Update order status on successful verification
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "COMPLETED",
        status: "PREPARING",
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ message: "Failed to verify payment" }, { status: 500 });
  }
}
