import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { agents, type AgentId, type Country } from '@/lib/agents';
import { getUserSubscription } from '@/lib/subscription';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const subscription = await getUserSubscription();
  const { agentId, country, messages } = await req.json() as {
    agentId: AgentId;
    country: Country;
    messages: { role: 'user' | 'assistant'; content: string }[];
  };

  if (!subscription.countries.includes(country)) {
    return NextResponse.json({ error: 'Upgrade your plan to access this country.' }, { status: 403 });
  }

  const agent = agents.find((a) => a.id === agentId);
  if (!agent) return NextResponse.json({ error: 'Invalid agent' }, { status: 400 });

  const systemPrompt = agent[country].system;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content.find((c) => c.type === 'text')?.text || '';
    return NextResponse.json({ content: text });
  } catch (e: any) {
    console.error('Anthropic error:', e);
    return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 500 });
  }
}
