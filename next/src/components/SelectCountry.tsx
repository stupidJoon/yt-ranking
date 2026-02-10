'use client';

import { CountryDropdown } from '@/components/ui/country-dropdown.tsx';
import { awsCountries } from '@/lib/country';
import { countries } from 'country-data-list';

const awsCountryKeys = awsCountries.map(c => c.code);
const allowedCountries = countries.all.filter((country) => awsCountryKeys.includes(country.alpha2));

export function SelectCountry({ country }: { country: string }) {
  const alpha3 = allowedCountries.find((c) => c.alpha2 === country.toUpperCase())?.alpha3;

  return (
    <CountryDropdown
      placeholder='Select country'
      defaultValue={alpha3}
      options={allowedCountries}
      onChange={(value) => window.location.href = `/${value.alpha2.toLowerCase()}`}
      slim
    />
  )
}
