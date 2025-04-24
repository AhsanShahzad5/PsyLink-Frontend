import React, { useState, useEffect } from 'react';
import BackButton from './../../Components/patient/backButton';
import { InputField } from '@/Components/InputField';
import { SelectField } from '@/Components/SelectField';
import { UploadImage } from '@/Components/UploadImage';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
// import { setPersonalDetails } from '@/slices/patientDetailsSlice';
import { PhoneInputField } from '@/Components/ui/PhoneFieldInput';
import { CountrySelect } from '@/Components/ui/countrySelect';
import { CitySelect } from '@/Components/ui/citySelect';
import userAtom from '@/atoms/userAtom';
import { useRecoilValue } from 'recoil';
import { toast } from "@/hooks/use-toast";

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  // Other = 'Other'
}

export enum Disability {
  Yes = 'Yes',
  No = 'No'
}

const PatientDetailForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [disability, setDisability] = useState<Disability | ''>('');
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
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  // Fetch existing patient details on component mount
  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/patient/details/personal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        const data = await response.json();
        console.log("API Response - Patient Details:", data);
        
        if (response.ok && data.personalInformation) {
          const details = data.personalInformation;
          setFullName(details.fullName || '');
          setAge(details.age ? details.age.toString() : '');
          setGender((details.gender as Gender) || '');
          setDisability((details.disability as Disability) || '');
          
          // Set country and trigger any necessary side effects
          if (details.country) {
            setCountry(details.country);
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
        console.error('Error fetching patient details:', error);
        setMessage('Failed to fetch patient details. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, []);

  const handleImageChange = (url: string) => {
    setImgUrl(url);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const payload = {
      fullName,
      age: parseInt(age),
      gender,
      disability: disability || null,
      country,
      city,
      phoneNo,
      image: imgUrl || 'null',
    };

    //dispatch(setPersonalDetails(payload));
    
    setLoading(true);

    try {
      // Determine whether to use POST or PUT based on whether details already exist
      const endpoint = hasExistingDetails 
        ? 'http://localhost:8000/api/patient/details/personal/update' 
        : 'http://localhost:8000/api/patient/details/personal';
      
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
          toast({
            description: "Personal details submitted successfully!",
            variant: "default",
            duration: 1000
          });
          navigate(`/${user?.role}/home`);
        }
      } else {
        setMessage(data.message || 'Failed to submit the form.');
        toast({
          description: data.message || "Failed to submit the form.",
          variant: "destructive",
          duration: 3000
        });
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
    <div className="flex items-center justify-center min-h-screen bg-[#D3EDEB] mt-[6rem]">
      <div className="p-8 bg-white shadow-lg w-full max-w-4xl md:max-w-6xl rounded-2xl" style={{ boxShadow: '1px 6px 16px 3px rgba(0,0,0,0.25)' }}>
        <BackButton/>
        <h1 className="text-xl md:text-3xl font-semibold text-center mb-6">
          {hasExistingDetails ? 'Update Your Personal Details' : 'Please Enter Your Personal Details'}
        </h1>
        
        <div className="h-1 w-full bg-[#4EB5AD] my-4"></div>
        <p className="text-center text-lg md:text-2xl font-semibold underline decoration-solid decoration-[#9E00CA] mb-6 text-[#9E00CA]">
          We ensure you that all your personal information is safe with us. Rest assured
        </p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 px-4 md:px-20">
          <InputField label="Full Name" value={fullName} onChange={setFullName} />
          <CountrySelect
            label="Country"
            value={country}
            onChange={(label, code) => {
              setCountry(label);
              setCountryCode(code);
              setCity(''); // reset city when country changes
            }}
          />

          <CitySelect
            label="City"
            countryCode={countryCode}
            value={city}
            onChange={setCity}
          />
          <div>
            <label className="block text-lg md:text-xl font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
            />
          </div>
          <SelectField label="Gender" value={gender} options={Gender} onChange={(value) => setGender(value as Gender)} />
          <PhoneInputField
            label="Phone Number"
            value={phoneNo}
            onChange={setPhoneNo}
            isValid={isPhoneValid}
            setIsValid={setIsPhoneValid}
          />
          <SelectField 
            label="Disability (If Any)" 
            value={disability} 
            options={Disability} 
            onChange={(value) => setDisability(value as Disability)} 
          />
        </form>
        <div className="mt-8">
          <UploadImage label="Upload Profile Image" text="Upload Image" onImageChange={handleImageChange} />
          {imgUrl && <img src={imgUrl} alt="Preview" className="mt-4 rounded-[15px] h-48 object-cover mx-auto" />}
        </div>
        
        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {message}
          </div>
        )}
        
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

export default PatientDetailForm;