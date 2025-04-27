import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';

interface PhoneInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
  setIsValid: (valid: boolean) => void;
  required:boolean
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  label,
  value,
  onChange,
  isValid,
  setIsValid,
  required=false
}) => {
  return (
    <div className="flex flex-col items-start w-full">
      <label className="block text-lg md:text-xl font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <PhoneInput
        defaultCountry="IN"
        value={value}
        onChange={(val) => {
          const phone = val || '';
          onChange(phone);
          setIsValid(isValidPhoneNumber(phone));
        }}
        className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
      />
      {!isValid && value && (
        <p className="text-red-500 text-sm mt-1">Invalid phone number</p>
      )}
    </div>
  );
};
