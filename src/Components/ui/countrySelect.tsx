import React from 'react';
import Select from 'react-select';
import countries from 'world-countries';

const formattedCountries = countries.map((country) => ({
  label: country.name.common,
  value: country.cca2,
}));

interface CountrySelectProps {
    label: string;
    value: string;
    onChange: (label: string, code: string) => void;
    required?: boolean;
  }

export const CountrySelect: React.FC<CountrySelectProps> = ({ label, value, onChange,  required = false }) => {
  const selectedOption = formattedCountries.find((c) => c.label === value);

  return (
    <div className="flex flex-col items-start w-full">
      <label className="block text-lg md:text-xl font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Select
        options={formattedCountries}
        value={selectedOption}
        onChange={(option) => onChange(option?.label || '', option?.value || '')}
        className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
        classNamePrefix="react-select"
        placeholder="Select a country"
      />
    </div>
  );
};
