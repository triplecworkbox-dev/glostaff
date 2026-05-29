export interface Plan {
  id: string;
  name: string;
  priceZAR: number;
  priceNZD: number;
  interval: 'month';
  description: string;
  features: string[];
  highlight?: boolean;
  stripePriceEnvKey: string;
}

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceZAR: 499,
    priceNZD: 49,
    interval: 'month',
    description: 'For solo founders and small teams',
    stripePriceEnvKey: 'STRIPE_PRICE_STARTER_MONTHLY',
    features: [
      '1 country (SA or NZ)',
      'All 5 agents',
      '100 messages / month',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceZAR: 999,
    priceNZD: 99,
    interval: 'month',
    description: 'For growing businesses',
    highlight: true,
    stripePriceEnvKey: 'STRIPE_PRICE_PRO_MONTHLY',
    features: [
      'Both SA + NZ',
      'All 5 agents',
      '500 messages / month',
      'Conversation history',
      'Priority email support',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    priceZAR: 1999,
    priceNZD: 199,
    interval: 'month',
    description: 'For teams and accountants',
    stripePriceEnvKey: 'STRIPE_PRICE_TEAM_MONTHLY',
    features: [
      'Both SA + NZ',
      'All 5 agents',
      'Unlimited messages',
      'Up to 5 team members',
      'Conversation history',
      'Dedicated support',
    ],
  },
];
