import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-gray-900 mb-2">BizAgents</h1>
          <p className="text-gray-500 text-sm">AI agents for SA &amp; NZ businesses</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              card: 'shadow-none border border-gray-200 rounded-2xl',
              headerTitle: 'font-display',
            },
          }}
        />
      </div>
    </div>
  );
}
