import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { enrollments } from "@/lib/schema";

export async function POST(req: Request) {
  // Move the Stripe initialization inside the function!
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed.", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (userId && courseId) {
      await db.insert(enrollments).values({
        userId,
        courseId,
      });
      console.log(`Successfully enrolled user ${userId} in course ${courseId}`);
    }
  }

  return new NextResponse("Webhook received successfully", { status: 200 });
}