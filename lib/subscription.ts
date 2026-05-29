import { auth, currentUser } from '@clerk/nextjs';

export type PlanId = 'free' | 'starter' | 'pro' | 'team';

export interface Subscription {
  planId: PlanId;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status?: string;
  countries: ('sa' | 'nz')[];
  monthlyMessageLimit: number;
}

const planDefaults: Record<PlanId, Subscription> = {
  free: { planId: 'free', countries: ['sa'], monthlyMessageLimit: 10 },
  starter: { planId: 'starter', countries: ['sa'], monthlyMessageLimit: 100 },
  pro: { planId: 'pro', countries: ['sa', 'nz'], monthlyMessageLimit: 500 },
  team: { planId: 'team', countries: ['sa', 'nz'], monthlyMessageLimit: 999999 },
};

export async function getUserSubscription(): Promise<Subscription> {
  const user = await currentUser();
  if (!user) return planDefaults.free;

  const meta = user.privateMetadata as Record<string, string>;
  const planId = (meta?.planId as PlanId) || 'free';

  return {
    ...planDefaults[planId],
    stripeCustomerId: meta?.stripeCustomerId,
    stripeSubscriptionId: meta?.stripeSubscriptionId,
    status: meta?.subscriptionStatus,
  };
}
