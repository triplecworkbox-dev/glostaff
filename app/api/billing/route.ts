import { auth, currentUser } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { createBillingPortalSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await currentUser();
  const customerId = user?.privateMetadata?.stripeCustomerId as string;
  if (!customerId) return NextResponse.json({ error: 'No billing account found' }, { status: 400 });

  const session = await createBillingPortalSession(customerId);
  return NextResponse.json({ url: session.url });
}
