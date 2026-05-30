import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { agents, type AgentId, type Country } from '@/lib/agents';
import { getUserSubscription } from '@/lib/subscription';

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
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 500 });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://glostaff.vercel.app',
        'X-Title': 'GloStaff Business Agents',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.choices?.[0]?.message?.content || 'No response received.';
    return NextResponse.json({ content: text });
  } catch (e: any) {
    console.error('OpenRouter error:', e);
    return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 500 });
  }
}
