import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserSubscription } from '@/lib/subscription';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) redirect('/login');

  const subscription = await getUserSubscription();

  return <DashboardClient subscription={subscription} />;
}
