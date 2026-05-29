'use client';
import Link from 'next/link';
import { useState } from 'react';
import { plans } from '@/lib/plans';

export default function PricingPage() {
  const [currency, setCurrency] = useState<'ZAR' | 'NZD'>('ZAR');

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="font-display text-xl text-gray-900">BizAgents</Link>
        <Link href="/login" className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Get started</Link>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="font-display text-5xl text-gray-900 mb-4">Simple pricing</h1>
        <p className="text-gray-500 text-lg mb-8">Start free. Scale as you grow.</p>

        <div className="inline-flex border border-gray-200 rounded-lg p-1 mb-12">
          {(['ZAR', 'NZD'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${currency === c ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {c === 'ZAR' ? '🇿🇦 ZAR' : '🇳🇿 NZD'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-8 border text-left relative ${plan.highlight ? 'border-brand-400 bg-brand-50' : 'border-gray-200 bg-white'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <h3 className="font-medium text-gray-900 text-lg mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="font-display text-4xl text-gray-900">
                  {currency === 'ZAR' ? `R${plan.priceZAR}` : `$${plan.priceNZD}`}
                </span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-brand-500 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`block text-center py-3 rounded-xl text-sm font-medium transition-colors ${plan.highlight ? 'bg-brand-600 text-white hover:bg-brand-700' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-400 mt-8">All plans include a 7-day free trial. Cancel anytime.</p>
      </section>
    </div>
  );
}
