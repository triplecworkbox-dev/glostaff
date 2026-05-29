'use client';
import Link from 'next/link';

const features = [
  { icon: '📊', title: 'Finance & accounting', desc: 'SARS, VAT, IRD, GST — filing deadlines, provisional tax, PAYE guidance.' },
  { icon: '👥', title: 'HR & payroll', desc: 'BCEA, LRA, CCMA for SA. ERA, Holidays Act, KiwiSaver for NZ.' },
  { icon: '⚖️', title: 'Legal & compliance', desc: 'POPIA, Companies Act, Privacy Act 2020. Know your obligations.' },
  { icon: '📣', title: 'Sales & CRM', desc: 'Market-specific sales strategy for SA and NZ business landscapes.' },
  { icon: '⚙️', title: 'Operations', desc: 'Load-shedding contingency (SA), Pacific supply chain (NZ), vendor management.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-display text-xl text-gray-900">BizAgents</span>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="/login" className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-brand-100">
          🇿🇦 South Africa &amp; 🇳🇿 New Zealand
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-gray-900 leading-tight mb-6">
          AI agents that know<br />
          <span className="italic text-brand-600">your market</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Finance, HR, legal, sales, and ops agents pre-configured for SA and NZ law, tax, and business context. No generic advice — expert guidance for your jurisdiction.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="bg-brand-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-brand-700 transition-colors text-sm">
            Start free trial
          </Link>
          <Link href="/pricing" className="border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm">
            View pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-surface-secondary rounded-2xl p-6 border border-gray-100">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-medium text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
          <div className="bg-brand-600 rounded-2xl p-6 text-white">
            <div className="text-2xl mb-3">🌍</div>
            <h3 className="font-medium mb-2">Dual-jurisdiction</h3>
            <p className="text-sm opacity-80 leading-relaxed">Switch between SA and NZ context instantly. Each agent keeps separate conversations per country.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-4xl text-gray-900 mb-4">Ready to get started?</h2>
        <p className="text-gray-500 mb-8">Join businesses running smarter with AI agents that actually know SA and NZ.</p>
        <Link href="/login" className="bg-brand-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-brand-700 transition-colors text-sm inline-block">
          Start your free trial
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} BizAgents. Built for SA &amp; NZ businesses.</p>
      </footer>
    </div>
  );
}
