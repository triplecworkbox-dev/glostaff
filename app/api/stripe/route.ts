import { auth, currentUser } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { plans } from '@/lib/plans';

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await currentUser();
  const { planId } = await req.json();

  const plan = plans.find((p) => p.id === planId);
  if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

  const priceId = process.env[plan.stripePriceEnvKey];
  if (!priceId) return NextResponse.json({ error: 'Price not configured' }, { status: 500 });

  const email = user?.emailAddresses[0]?.emailAddress || '';

  try {
    const session = await createCheckoutSession({ userId, userEmail: email, priceId, planId });
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error('Stripe error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
