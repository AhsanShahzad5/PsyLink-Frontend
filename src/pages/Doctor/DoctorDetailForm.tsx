import React, { useState, useEffect } from 'react';
import BackButton from './../../Components/patient/backButton';
import { InputField } from '@/Components/InputField';
import { SelectField } from '@/Components/SelectField';
import { UploadImage } from '@/Components/UploadImage';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { setPersonalDetails } from '@/slices/doctorDetailsSlice';
import { PhoneInputField } from '@/Components/ui/PhoneFieldInput';
import { CountrySelect } from '@/Components/ui/countrySelect';
import { CitySelect } from '@/Components/ui/citySelect';
import userAtom from '@/atoms/userAtom';
import { useRecoilValue } from 'recoil';
import { toast } from "@/hooks/use-toast";

export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export enum Disability {
  Yes = 'Yes',
  No = 'No'
}

const DetailForm: React.FC = () => {
  const user = useRecoilValue(userAtom);
  const [fullName, setFullName] = useState(`${user.name}`);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [phoneNo, setPhoneNo] = useState('');
  const [imgUrl, setImgUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [city, setCity] = useState('');
  const [hasExistingDetails, setHasExistingDetails] = useState(false);

  const user2 = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    email: '',
    password: '',
    role: 'patient',
    name: ""
  });

  // Fetch existing doctor details on component mount
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/doctor/details/personal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        const data = await response.json();
        console.log("API Response - Doctor Details:", data);
        
        if (response.ok && data.personalDetails) {
          const details = data.personalDetails;
          setFullName(details.fullName || '');
          
          // Format date of birth properly if it exists
          if (details.dateOfBirth) {
            // Make sure the date is in YYYY-MM-DD format for input[type="date"]
            const dob = new Date(details.dateOfBirth);
            if (!isNaN(dob.getTime())) {
              const year = dob.getFullYear();
              const month = String(dob.getMonth() + 1).padStart(2, '0');
              const day = String(dob.getDate()).padStart(2, '0');
              setDateOfBirth(`${year}-${month}-${day}`);
            } else {
              // If date format is already correct or it's a string in YYYY-MM-DD format
              setDateOfBirth(details.dateOfBirth);
            }
          }
          
          setGender((details.gender as Gender) || '');
          
          // Set country and trigger any necessary side effects
          if (details.country) {
            setCountry(details.country);
            // You might need additional logic to set the country code based on country name
            // This is placeholder logic - you might need a mapping function
            // For example, use a function like getCountryCodeFromName(details.country)
          }
          
          // Set city only if it exists
          if (details.city) {
            setCity(details.city);
          }
          
          setPhoneNo(details.phoneNo || '');
          setImgUrl(details.image !== 'null' ? details.image : '');
          setHasExistingDetails(true);
        } else {
          console.log("No existing personal details found or error:", data.message);
          setHasExistingDetails(false);
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        setMessage('Failed to fetch doctor details. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, []);

  const handleImageChange = (url: string) => {
    setImgUrl(url);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    console.log({
      fullName,
      isPhoneValid,
      gender,
      dateOfBirth,
      city,
      country,
      imgUrl
    });
    if (
      !fullName ||
      !isPhoneValid ||
      !gender ||
      !dateOfBirth ||
      !city ||
      !country ||
      !imgUrl
    ) {
      toast({
        description: "Please fill all required fields before submitting.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

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
    setLoading(true);

    try {
      // Determine whether to use POST or PUT based on whether details already exist
      const endpoint = hasExistingDetails 
        ? 'http://localhost:8000/api/doctor/details/personal/update' 
        : 'http://localhost:8000/api/doctor/details/personal';
      
      const method = hasExistingDetails ? 'PUT' : 'POST';
      
      console.log(`Submitting form using ${method} to ${endpoint}`);
      console.log("Form payload:", payload);
      
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (response.ok) {
        if (hasExistingDetails) {
          // If updating existing details
          toast({
            description: "Details updated successfully!",
            variant: "default",
            duration: 1000
          });
          
        
        
          // Navigate to home after update
          setTimeout(() => {
            navigate(`/${user?.role}/home`);
          }, 1000);
        } else {
          // If creating new details
          setMessage('Form submitted successfully!');
          navigate(`/doctor/professionaldetailForm`);
        }
      } else {
        setMessage(data.message || 'Failed to submit the form.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setMessage('Failed to submit the form. Please try again.');
      toast({
        description: "Failed to submit the form. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !message) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#D3EDEB]">
        <div className="p-8 bg-white shadow-lg w-full max-w-4xl md:max-w-6xl rounded-2xl">
          <p className="text-center text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D3EDEB]">
      <div className="p-8 bg-white shadow-lg w-full max-w-4xl md:max-w-6xl rounded-2xl" style={{ boxShadow: '1px 6px 16px 3px rgba(0,0,0,0.25)' }}>
        <BackButton/>
        <h1 className="text-xl md:text-3xl font-semibold text-center mb-6">
          {hasExistingDetails ? 'Update Your Personal Details' : 'Please Enter Further Details'}
        </h1>
        
        <div className="h-1 w-full bg-[#4EB5AD] my-4"></div>
        <p className="text-center text-lg md:text-2xl font-semibold underline decoration-solid decoration-[#9E00CA] mb-6 text-[#9E00CA]">
          We ensure you that all your personal information is safe with us. Rest assured
        </p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 px-4 md:px-20">
          <InputField label="Full Name" value={fullName} onChange={setFullName}  required={true} />
          <CountrySelect
            label="Country"
            value={country}
            onChange={(label, code) => {
              setCountry(label);
              setCountryCode(code);
              setCity(''); // reset city when country changes
            }}
            required={true}
          />

          <CitySelect
            label="City"
            countryCode={countryCode}
            value={city}
            onChange={setCity}
            required={true}
          />
          <div>
          <label className="block text-lg md:text-xl font-medium text-gray-700">
        Date Of Birth  <span className="text-red-500">*</span>
      </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
            />
          </div>
          <SelectField 
            label="Gender" 
            value={gender} 
            options={Gender} 
            onChange={(value) => {
              console.log("Selected Specialization: ", value); // Log selected value
              setGender(value as any);
            }}  
            required={true} />
          <PhoneInputField
            label="Phone Number"
            value={phoneNo}
            onChange={setPhoneNo}
            isValid={isPhoneValid}
            setIsValid={setIsPhoneValid}
            required={true}
          />
        </form>
        <UploadImage label="Upload Image" text="Upload Image" onImageChange={handleImageChange}  required={true} />
        {imgUrl && <img src={imgUrl} alt="Preview" className="mt-4 rounded-[15px] h-48 object-cover" />}
        
        {/* {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {message}
          </div>
        )} */}
        
        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            disabled={!isPhoneValid || loading}
            className={`bg-[#02968A] text-white text-lg md:text-2xl font-bold py-3 px-12 rounded-2xl shadow-lg transition-colors ${
              !isPhoneValid || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#027368]'
            }`}
          >
            {loading ? 'Processing...' : hasExistingDetails ? 'Update' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailForm;