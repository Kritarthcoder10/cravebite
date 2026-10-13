import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cartItems, restaurantId, deliveryAddress } = body;

    if (!cartItems || cartItems.length === 0 || !restaurantId || !deliveryAddress) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    // Verify prices from DB to avoid client tampering
    const menuItemIds = cartItems.map((item: any) => item.id);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    let calculatedSubtotal = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const dbItem = dbMenuItems.find((db) => db.id === item.id);
      if (!dbItem) {
        return NextResponse.json({ message: `Menu item ${item.name} not found` }, { status: 400 });
      }
      calculatedSubtotal += dbItem.price * item.quantity;
      orderItemsData.push({
        menuItemId: item.id,
        quantity: item.quantity,
        price: dbItem.price,
      });
    }

    const deliveryFee = 5.0; // flat fee
    const taxes = calculatedSubtotal * 0.1; // 10% tax
    const totalAmount = calculatedSubtotal + deliveryFee + taxes;

    // Check if Razorpay keys are placeholders
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMock = !keyId || keyId === "rzp_test_yourkeyhere" || !keySecret || keySecret === "placeholder_secret";

    let razorpayOrderId = "";

    if (isMock) {
      const uniqueId = crypto.randomBytes(8).toString("hex");
      razorpayOrderId = `order_mock_${uniqueId}`;
    } else {
      // Create real Razorpay order (amounts in paise, multiply by 100)
      const options = {
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${crypto.randomBytes(4).toString("hex")}`,
      };
      
      const order = await razorpay.orders.create(options);
      razorpayOrderId = order.id;
    }

    // Create pending Order in database
    const newOrder = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        restaurantId,
        totalAmount,
        status: "PENDING",
        deliveryAddress,
        paymentStatus: "PENDING",
        razorpayOrderId,
        orderItems: {
          create: orderItemsData,
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      razorpayOrderId,
      amount: totalAmount,
      isMock,
      keyId: isMock ? "mock_key" : keyId,
    });
  } catch (error) {
    console.error("Create order payment error:", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}
