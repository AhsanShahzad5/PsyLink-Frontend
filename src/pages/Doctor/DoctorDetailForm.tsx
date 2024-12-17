
import { InputField } from '@/Components/InputField';
import BackButton from '@/Components/patient/backButton';
import { SelectField } from '@/Components/SelectField';
import { UploadImage } from '@/Components/UploadImage';
import React, { useState } from 'react';
import axios from 'axios';
import { UserCredentials } from "@/types/User";
import { useDispatch, useSelector } from "react-redux"
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { setPersonalDetails } from '@/slices/doctorDetailsSlice';

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
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [phoneNo, setPhoneNo] = useState('');
  const [imgUrl, setImgUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  console.log(user);
  console.log(user?.name);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
      email: '',
      password: '',
      role: 'patient',
      name: ""
    })

  const handleImageChange = (url: string) => {
    setImgUrl(url);
};
  // const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.preventDefault();
  //   console.log("Form Submission:", { fullName, country, age, city, gender, phoneNo , imgUrl });
  // }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const payload = {
        fullName,
        dateOfBirth,
        gender,
        country,
        city,
        phoneNo,
        image: imgUrl || 'null',
    };

   
  dispatch(setPersonalDetails(payload));

    try {
        const response = await fetch('http://localhost:8000/api/doctor/details/personal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Do not set the Authorization header manually here
            },
            credentials: 'include',  // Ensure that cookies are included in the request
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
            navigate(`/${user?.role}/professionaldetailForm`);
            setMessage('Form submitted successfully!');
        } else {
            setMessage(data.message || 'Failed to submit the form.');
        }
    } catch (error) {
        console.error('Error submitting the form:', error);
        setMessage('Failed to submit the form. Please try again.');
    }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D3EDEB]">
      <div className="p-8 bg-white shadow-lg w-full max-w-4xl md:max-w-6xl rounded-2xl" style={{ boxShadow: '1px 6px 16px 3px rgba(0,0,0,0.25)' }}>
        <BackButton/>
        <h1 className="text-xl md:text-3xl font-semibold text-center mb-6">Please Enter Further Details.</h1>
        
        <div className="h-1 w-full bg-[#4EB5AD] my-4"></div>
        <p className="text-center text-lg md:text-2xl font-semibold underline decoration-solid decoration-[#9E00CA] mb-6 text-[#9E00CA]">
          We ensure you that all your personal information is safe with us. Rest assured
        </p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 px-4 md:px-20">
          <InputField label="Full Name" value={fullName} onChange={setFullName} />
          <InputField label="Country" value={country} onChange={setCountry} />
          {/* Date Picker for Date of Birth */}
          <div>
            <label className="block text-lg md:text-xl font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
            />
          </div>
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
