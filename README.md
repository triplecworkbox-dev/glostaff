# BizAgents — SA & NZ Business Agent Platform

AI-powered business agents pre-configured for South African and New Zealand companies. Built with Next.js 14, Clerk auth, Stripe billing, and the Anthropic API.

---

## Tech stack

| Layer | Service |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | Clerk |
| Payments | Stripe |
| AI | Anthropic Claude (claude-sonnet-4) |
| Hosting | Vercel |
| Styling | Tailwind CSS |

---

## Setup (30 minutes)

### 1. Clone and install

```bash
git clone <your-repo>
cd bizagents
npm install
cp .env.example .env.local
```

### 2. Anthropic API key

1. Go to https://console.anthropic.com
2. Create an API key
3. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`

### 3. Clerk auth

1. Create a free account at https://clerk.com
2. Create a new application
3. Copy your keys into `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   ```

### 4. Stripe payments

1. Create account at https://stripe.com
2. Go to Dashboard > Products and create 3 products:
   - **Starter**: R499/mo (ZAR) + NZ$49/mo (NZD) — create two prices
   - **Pro**: R999/mo + NZ$99/mo
   - **Team**: R1999/mo + NZ$199/mo
3. Copy the Price IDs and add to `.env.local`
4. For webhooks: install Stripe CLI and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the webhook secret into `.env.local`

### 5. Run locally

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo at https://vercel.com/new

**Add all environment variables** in Vercel dashboard under Settings > Environment Variables.

**Stripe webhook for production:**
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the signing secret into your Vercel env vars

---

## Project structure

```
app/
  page.tsx              # Landing page
  pricing/page.tsx      # Pricing page (ZAR/NZD toggle)
  login/page.tsx        # Clerk auth
  dashboard/
    page.tsx            # Server component (fetches subscription)
    DashboardClient.tsx # Interactive agent dashboard
  api/
    chat/route.ts       # Secure Anthropic API proxy
    stripe/route.ts     # Create checkout session
    billing/route.ts    # Stripe billing portal
    webhooks/stripe/    # Stripe webhook handler
lib/
  agents.ts             # Agent definitions + system prompts
  plans.ts              # Pricing plan config
  stripe.ts             # Stripe client + helpers
  subscription.ts       # Read user subscription from Clerk metadata
middleware.ts           # Clerk route protection
```

---

## How subscriptions work

1. User signs up via Clerk
2. Clicks upgrade → `/api/stripe` creates a Stripe Checkout session
3. Stripe redirects back on success
4. Stripe fires `checkout.session.completed` webhook
5. `/api/webhooks/stripe` writes `planId` to Clerk user's `privateMetadata`
6. `getUserSubscription()` reads this metadata on every dashboard load
7. Dashboard shows/locks countries based on plan

---

## Customising agents

Edit `lib/agents.ts` to:
- Add new agents (e.g. Marketing, Customer Support)
- Update system prompts with your industry context
- Change quick prompts

---

## Monetisation tips

- Start with **Pro** as the default CTA (both countries)
- Offer annual billing at 2 months free (add to Stripe products)
- Add a **7-day free trial** in Stripe checkout
- Target: SA accountants, NZ-SA dual operators, immigration consultants, SME advisors

---

## Support

Built with Claude by Anthropic. For issues, customisations, or white-label enquiries, contact your developer.
