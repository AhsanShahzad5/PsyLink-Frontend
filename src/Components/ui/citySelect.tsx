import React from 'react';
import Select from 'react-select';
import { City, Country } from 'country-state-city';

interface CitySelectProps {
  label: string;
  countryCode: string; // e.g., 'IN', 'US'
  value: string;
  onChange: (value: string) => void;
}

export const CitySelect: React.FC<CitySelectProps> = ({
  label,
  countryCode,
  value,
  onChange
}) => {
  const cities = countryCode ? City.getCitiesOfCountry(countryCode) : [];

  const options = cities?.map((city) => ({
    label: city.name,
    value: city.name
  }));

  const selectedOption = options?.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col items-start w-full">
      <label className="block text-lg md:text-xl font-medium text-gray-700 ">{label}</label>
      <Select
        options={options}
        value={selectedOption}
        onChange={(option) => onChange(option?.value || '')}
        isDisabled={!countryCode}
        placeholder={countryCode ? "Select city" : "Select country first"}
        className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
        classNamePrefix="react-select"
      />
    </div>
  );
};
