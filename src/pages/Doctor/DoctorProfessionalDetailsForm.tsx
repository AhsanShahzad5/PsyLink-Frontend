import { InputField } from '@/components/InputField';
import { SelectField } from '@/components/SelectField';
import { UploadImage } from '@/components/UploadImage';
import { TimeOptions } from '@/lib/types';
import React, { useState } from 'react';

// Define the options for time selection

const DetailForm: React.FC = () => {
  const [specialization, setSpecialization] = useState('');
  const [cnicNumber, setCnicNumber] = useState('');
  const [pmdcNumber, setPmdcNumber] = useState('');
  const [educationalBackground, setEducationalBackground] = useState('');
  const [availabilityStart, setAvailabilityStart] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [imgUrl, setImgUrl] = useState<string>("");

  const handleImageChange = (url: string) => {
    setImgUrl(url);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log("Form Submission:", {
      specialization,
      cnicNumber,
      pmdcNumber,
      educationalBackground,
      availabilityStart,
      availabilityEnd,
      consultationFee,
      bankAccount,
      imgUrl,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D3EDEB]">
      <div className="p-8 bg-white shadow-lg w-full max-w-4xl md:max-w-6xl rounded-2xl" style={{ boxShadow: '1px 6px 16px 3px rgba(0,0,0,0.25)' }}>
        <h1 className="text-xl md:text-3xl font-semibold text-center mb-6">Please Enter Professional Details.</h1>
        <div className="h-1 w-full bg-[#4EB5AD] my-4"></div>
        <p className="text-center text-lg md:text-2xl font-semibold underline decoration-solid decoration-[#9E00CA] mb-6 text-[#9E00CA]">
          We ensure you that all your personal information is safe with us. Rest assured
        </p>
        <div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 px-4 md:px-20">
          <InputField label="Specialization" value={specialization} onChange={setSpecialization} />
          <InputField label="CNIC Number" value={cnicNumber} onChange={setCnicNumber} />
          <InputField label="PMDC Number" value={pmdcNumber} onChange={setPmdcNumber} />
          <InputField label="Educational Background" value={educationalBackground} onChange={setEducationalBackground} />
          <div className="md:col-span-2 flex gap-4">
            <div className="flex-1">
              <SelectField label="Availability Hours (Start)" value={availabilityStart} options={TimeOptions} onChange={setAvailabilityStart} />
            </div>
            <div className="flex-1">
              <SelectField label="Availability Hours (End)" value={availabilityEnd} options={TimeOptions} onChange={setAvailabilityEnd} />
            </div>
          </div>
          <InputField label="Consultation Fee" value={consultationFee} onChange={setConsultationFee} />
          <InputField label="Add Bank Account" value={bankAccount} onChange={setBankAccount} />
        </form>
          <UploadImage label="License/Certification Proof" text="Choose image" onImageChange={handleImageChange} />
        {imgUrl && <img src={imgUrl} alt="Preview" className="mt-4 rounded-[15px]" />}
        </div>

        <div className="flex justify-center mt-10">
          <button onClick={handleSubmit} className="bg-[#02968A] text-white text-lg md:text-2xl font-bold py-3 px-12 rounded-2xl shadow-lg hover:bg-[#027368] transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailForm;
