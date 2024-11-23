
import { InputField } from '@/components/InputField';
import { SelectField } from '@/components/SelectField';
import { UploadImage } from '@/components/UploadImage';
import React, { useState } from 'react';

export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export enum Disability {
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
  const [imgUrl, setImgUrl] = useState<string>("");

  const handleImageChange = (url: string) => {
    setImgUrl(url);
};
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log("Form Submission:", { fullName, country, age, city, gender, phoneNo , imgUrl });
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
        <UploadImage label="Upload Image" text="Upload Image" onImageChange={handleImageChange} />
        {imgUrl && <img src={imgUrl} alt="Preview" className="mt-4 rounded-[15px]" />}

        <div className="flex justify-center mt-10">
          <button onClick={handleSubmit} className="bg-[#02968A] text-white text-lg md:text-2xl font-bold py-3 px-12 rounded-2xl shadow-lg hover:bg-[#027368] transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}


export default DetailForm;
