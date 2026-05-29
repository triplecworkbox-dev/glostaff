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
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 500 });

  try {
    // Gemini uses 'model' instead of 'assistant' for role
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
    return NextResponse.json({ content: text });
  } catch (e: any) {
    console.error('Gemini error:', e);
    return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 500 });
  }
}
