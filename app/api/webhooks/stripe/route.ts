import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { clerkClient } from '@clerk/nextjs';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) {
    console.error('Webhook signature failed:', e.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  async function updateUserMeta(userId: string, data: Record<string, string>) {
    await clerkClient.users.updateUserMetadata(userId, { privateMetadata: data });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, planId } = session.metadata || {};
      if (userId && planId) {
        await updateUserMeta(userId, {
          planId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          subscriptionStatus: 'active',
        });
      }
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await updateUserMeta(userId, {
          subscriptionStatus: sub.status,
          stripeSubscriptionId: sub.id,
        });
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await updateUserMeta(userId, {
          planId: 'free',
          subscriptionStatus: 'cancelled',
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
