import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { awsCountries } from '@/lib/country.ts';

export default async function Root() {
  const country = (await headers()).get('x-vercel-ip-country') ?? 'US';
  if (awsCountries.some((c) => c.code === country)) {
    redirect(`/${country.toLowerCase()}`);
  }
  else redirect('/us');
}
