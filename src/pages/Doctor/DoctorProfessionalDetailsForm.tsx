import { InputField } from '@/Components/InputField';
import { UploadImage } from '@/Components/UploadImage';
import { RootState } from '@/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SelectField } from '@/Components/SelectField';
import { TimeOptions } from '@/lib/types';
import { setProfessionalDetails } from '@/slices/doctorDetailsSlice';

const DetailForm: React.FC = () => {
  const [specialization, setSpecialization] = useState('');
  const [cnicNumber, setCnicNumber] = useState('');
  const [pmdcNumber, setPmdcNumber] = useState('');
  const [educationalBackground, setEducationalBackground] = useState('');
  const [availabilityStart, setAvailabilityStart] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [imgUrl, setImgUrl] = useState<string>('');
  const [isBankDetailsModalOpen, setIsBankDetailsModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    branchCode: '',
    iban: ''
  });
  const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const user = useSelector((state: RootState) => state.auth.user);

    const dispatch = useDispatch();
  console.log(user);
  console.log(user?.name);
  const navigate = useNavigate();

  const handleImageChange = (url: string) => {
    setImgUrl(url);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
   
    console.log({
      specialisation: specialization, // Specialization
      pmdcNumber: pmdcNumber, // PMDC number
      educationalBackground: educationalBackground, // Educational background
      licenseImage: imgUrl || '', // License image URL (or empty string if not available)
      cnicNumber: cnicNumber, // CNIC number
      availableHours: {
        startTime: availabilityStart, // Availability start time
        endTime: availabilityEnd, // Availability end time
      },
      consultationFee: consultationFee, // Consultation fee
      bankDetails: {
        accountHolderName: bankDetails.accountHolderName, // Account holder name
        accountNumber: bankDetails.accountNumber, // Account number
        bankName: bankDetails.bankName, // Bank name
        branchCode: bankDetails.branchCode, // Branch code
        iban: bankDetails.iban, // IBAN
      }
    });

    const payload = {
      specialisation: specialization, // Specialization
      pmdcNumber: pmdcNumber, // PMDC number
      educationalBackground: educationalBackground, // Educational background
      licenseImage: imgUrl || 'null', // License image URL (or empty string if not available)
      cnicNumber: cnicNumber, // CNIC number
      availableHours: {
        startTime: availabilityStart, // Availability start time
        endTime: availabilityEnd, // Availability end time
      },
      consultationFee: consultationFee, // Consultation fee
      bankDetails: {
        accountHolderName: bankDetails.accountHolderName, // Account holder name
        accountNumber: bankDetails.accountNumber, // Account number
        bankName: bankDetails.bankName, // Bank name
        branchCode: bankDetails.branchCode, // Branch code
        iban: bankDetails.iban, // IBAN
      }
  };

  dispatch(setProfessionalDetails(payload));

  

    try {
      const response = await fetch('http://localhost:8000/api/doctor/details/professional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/${user?.role}/thankyoupage`); // Replace with appropriate navigation path
        setMessage('Form submitted successfully!');
      } else {
        setMessage(data.message || 'Failed to submit the form.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setMessage('Failed to submit the form. Please try again.');
    }
  };

  const personalDetails = useSelector((state: RootState) => state.doctorDetails.personalDetails);
const professionalDetails = useSelector((state: RootState) => state.doctorDetails.professionalDetails);

console.log(personalDetails, professionalDetails);


  const handleSaveBankDetails = () => {
    // Save the bank details as an object in the required structure
    setBankDetails({
      accountHolderName: bankDetails.accountHolderName,
      accountNumber: bankDetails.accountNumber,
      bankName: bankDetails.bankName,
      branchCode: bankDetails.branchCode,
      iban: bankDetails.iban,
    });
    setIsBankDetailsModalOpen(false); // Close the modal after saving
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
            
              
              <div className="flex-1">
                <InputField
                  label="Add Bank Account"
                  value={bankAccount}
                  onClick={() => setIsBankDetailsModalOpen(true)} // Open the bank details modal
                />
              </div>
            
            <InputField label="Consultation Fee" value={consultationFee} onChange={setConsultationFee} />
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

      
      {/* Bank Details Modal */}
      {isBankDetailsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 md:w-[600px] lg:w-[800px] max-w-full h-auto mt-10 mb-10">
            <h3 className="text-center text-lg font-semibold">Add Bank Details</h3>
            <div className="mt-4">
            <div className="flex flex-col items-start mb-4">
  <label className="block text-lg md:text-xl font-medium text-gray-700">
    Account Holder Name
  </label>
  <input
    placeholder="Account Holder Name"
    value={bankDetails.accountHolderName}
    onChange={(e: any) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
    className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
  />
</div>

<div className="flex flex-col items-start mb-4">
  <label className="block text-lg md:text-xl font-medium text-gray-700">
    Account Number
  </label>
  <input
    placeholder="Account Number"
    value={bankDetails.accountNumber}
    onChange={(e: any) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
    className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
  />
</div>

<div className="flex flex-col items-start mb-4">
  <label className="block text-lg md:text-xl font-medium text-gray-700">
    Bank Name
  </label>
  <input
    placeholder="Bank Name"
    value={bankDetails.bankName}
    onChange={(e: any) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
    className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
  />
</div>

<div className="flex flex-col items-start mb-4">
  <label className="block text-lg md:text-xl font-medium text-gray-700">
    Branch Code
  </label>
  <input
    placeholder="Branch Code"
    value={bankDetails.branchCode}
    onChange={(e: any) => setBankDetails({ ...bankDetails, branchCode: e.target.value })}
    className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
  />
</div>

<div className="flex flex-col items-start mb-4">
  <label className="block text-lg md:text-xl font-medium text-gray-700">
    IBAN
  </label>
  <input
    placeholder="IBAN"
    value={bankDetails.iban}
    onChange={(e: any) => setBankDetails({ ...bankDetails, iban: e.target.value })}
    className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
  />
</div>

            </div>
            <div className="flex justify-center mt-6">
              <button onClick={handleSaveBankDetails} className="bg-[#02968A] text-white py-2 px-8 rounded-2xl">
                Save Bank Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailForm;
