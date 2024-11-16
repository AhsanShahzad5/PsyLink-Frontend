
import { UploadImage } from '@/components/uploadImage';
import React, { useState } from 'react';

enum Gender {
  Male = 'Male',
  Female = 'Female'
}

enum Disability {
  Yes = 'Yes',
  No = 'No'
}

const DetailForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [phoneNo, setPhoneNo] = useState('');


  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log("Form Submission:", { fullName, country, age, city, gender, phoneNo });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D3EDEB]">
      <div className="p-8 bg-white shadow-lg w-full max-w-4xl md:max-w-6xl rounded-2xl" style={{ boxShadow: '1px 6px 16px 3px rgba(0,0,0,0.25)' }}>
        <h1 className="text-xl md:text-3xl font-semibold text-center mb-6">Please Enter Further Details.</h1>
        <div className="h-1 w-full bg-[#4EB5AD] my-4"></div>
        <p className="text-center text-lg md:text-2xl font-semibold underline decoration-solid decoration-[#9E00CA] mb-6 text-[#9E00CA]">
          We ensure you that all your personal information is safe with us. Rest assured
        </p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 px-4 md:px-20">
          <InputField label="Full Name" value={fullName} onChange={setFullName} />
          <InputField label="Country" value={country} onChange={setCountry} />
          <InputField label="Age" value={age} onChange={setAge} />
          <InputField label="City" value={city} onChange={setCity} />
          <SelectField label="Gender" value={gender} options={Gender} onChange={(value) => setGender(value as Gender)} />
          <InputField label="Phone No." value={phoneNo} onChange={setPhoneNo} />
          
        </form>
        <UploadImage label="Upload Image" text="Upload Image" />
        <div className="flex justify-center mt-10">
          <button onClick={handleSubmit} className="bg-[#02968A] text-white text-lg md:text-2xl font-bold py-3 px-12 rounded-2xl shadow-lg hover:bg-[#027368] transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-lg md:text-xl font-medium text-gray-700">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string | Gender | Disability;
  options: typeof Gender | typeof Disability;
  onChange: (value: string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange }) => {
  return (
    <div>
      <label className="block text-lg md:text-xl font-medium text-gray-700">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
      >
        <option value="">Select {label}</option>
        {Object.values(options).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DetailForm;
