'use client';
import { useState, useRef, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { agents, quickPrompts, type AgentId, type Country } from '@/lib/agents';
import type { Subscription } from '@/lib/subscription';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function DashboardClient({ subscription }: { subscription: Subscription }) {
  const { user } = useUser();
  const [country, setCountry] = useState<Country>('sa');
  const [activeAgent, setActiveAgent] = useState<AgentId>('finance');
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const key = `${activeAgent}-${country}`;
  const messages = conversations[key] || [];

  const canUseCountry = (c: Country) => subscription.countries.includes(c);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const agent = agents.find((a) => a.id === activeAgent)!;
  const ctx = agent[country];

  async function send(text: string) {
    if (!text.trim() || loading) return;
    if (!canUseCountry(country)) return;

    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setConversations((prev) => ({ ...prev, [key]: updated }));
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: activeAgent, country, messages: updated }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const reply: Message = { role: 'assistant', content: data.content };
      setConversations((prev) => ({ ...prev, [key]: [...updated, reply] }));
    } catch (e: any) {
      const errMsg: Message = { role: 'assistant', content: e.message || 'Something went wrong. Please try again.' };
      setConversations((prev) => ({ ...prev, [key]: [...updated, errMsg] }));
    } finally {
      setLoading(false);
    }
  }

  const prompts = quickPrompts[activeAgent][country];

  const greeting = messages.length === 0
    ? `Hi${user?.firstName ? ` ${user.firstName}` : ''}! I'm your ${agent.name} agent for your ${country === 'sa' ? 'South African' : 'New Zealand'} company — pre-loaded with ${ctx.sub} context. What would you like help with?`
    : null;

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <span className="font-display text-lg text-gray-900">BizAgents</span>
        <div className="flex items-center gap-4">
          {subscription.planId === 'free' && (
            <Link href="/pricing" className="text-xs bg-brand-50 text-brand-600 border border-brand-100 px-3 py-1.5 rounded-lg font-medium hover:bg-brand-100 transition-colors">
              Upgrade plan
            </Link>
          )}
          <span className="text-xs text-gray-400 hidden sm:block">
            {subscription.planId.charAt(0).toUpperCase() + subscription.planId.slice(1)} plan
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
        {/* Country toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700">Select company context</h2>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
            {(['sa', 'nz'] as Country[]).map((c) => (
              <button
                key={c}
                onClick={() => canUseCountry(c) ? setCountry(c) : null}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  country === c ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-gray-900'
                } ${!canUseCountry(c) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {c === 'sa' ? '🇿🇦 South Africa' : '🇳🇿 New Zealand'}
                {!canUseCountry(c) && <span className="ml-1 text-xs">🔒</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Agent selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {agents.map((a) => (
            <button
              key={a.id}
              onClick={() => setActiveAgent(a.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeAgent === a.id
                  ? 'border-brand-400 bg-brand-50 ring-1 ring-brand-400'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-lg mb-1">{a.icon}</div>
              <div className="text-xs font-medium text-gray-900 leading-tight">{a.name}</div>
              <div className="text-xs text-gray-400 mt-0.5 truncate">{a[country].sub}</div>
            </button>
          ))}
        </div>

        {/* Chat */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ minHeight: '420px', maxHeight: '60vh' }}>
          {/* Chat header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
            <span className="text-xl">{agent.icon}</span>
            <div>
              <div className="text-sm font-medium text-gray-900">{country === 'sa' ? '🇿🇦' : '🇳🇿'} {agent.name}</div>
              <div className="text-xs text-gray-400">{ctx.sub}</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            {greeting && (
              <div className="self-start bg-surface-secondary rounded-xl px-4 py-3 text-sm text-gray-700 max-w-prose leading-relaxed">
                {greeting}
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-xl px-4 py-3 text-sm leading-relaxed max-w-prose whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'self-end bg-brand-600 text-white'
                    : 'self-start bg-surface-secondary text-gray-700'
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-surface-secondary rounded-xl px-4 py-3">
                <div className="flex gap-1 items-center">
                  {[0, 0.15, 0.3].map((d, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          {messages.length === 0 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder={`Ask your ${agent.name.toLowerCase()} agent…`}
              disabled={!canUseCountry(country)}
              className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:opacity-50"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading || !canUseCountry(country)}
              className="bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-brand-700 transition-colors disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>

        {/* Upgrade nudge for restricted country */}
        {!canUseCountry(country) && (
          <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-brand-800">Upgrade to access {country === 'nz' ? 'New Zealand' : 'South Africa'} agents</p>
              <p className="text-xs text-brand-600 mt-0.5">Pro and Team plans include both SA + NZ.</p>
            </div>
            <Link href="/pricing" className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors whitespace-nowrap">
              Upgrade
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
