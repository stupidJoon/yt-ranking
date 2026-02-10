import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Root() {
  const country = (await headers()).get('x-vercel-ip-country') || 'US';
  redirect(`/${country.toLowerCase()}`);
}
