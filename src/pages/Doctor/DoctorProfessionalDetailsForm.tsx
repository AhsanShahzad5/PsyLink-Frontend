import { InputField } from "@/Components/InputField";
import { UploadImage } from "@/Components/UploadImage";
import { RootState } from "@/store";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SelectField } from "@/Components/SelectField";
import { TimeOptions } from "@/lib/types";
import { setProfessionalDetails } from "@/slices/doctorDetailsSlice";
import { BankDetailsModal } from "@/Components/ui/bankDetailModal";
import BackButton from "@/Components/patient/backButton";
import { toast } from "@/hooks/use-toast";

const ProfessionalDetailForm: React.FC = () => {
  const [specialization, setSpecialization] = useState("");
  const [cnicNumber, setCnicNumber] = useState("");
  const [pmdcNumber, setPmdcNumber] = useState("");
  const [educationalBackground, setEducationalBackground] = useState("");
  const [availabilityStart, setAvailabilityStart] = useState("09:00 am");
  const [availabilityEnd, setAvailabilityEnd] = useState("09:00 pm");
  const [consultationFee, setConsultationFee] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const [isBankDetailsModalOpen, setIsBankDetailsModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    branchCode: "",
    iban: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch existing professional details on component mount to check if they exist
  // useEffect(() => {
  //   const fetchProfessionalDetails = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8000/api/doctor/details/professional', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         credentials: 'include',
  //       });
        
  //       const data = await response.json();
  //       console.log("API Response - Professional Details:", data);
        
  //       if (response.ok && data.professionalDetails) {
  //         // If details already exist, navigate to home/dashboard
  //         toast({
  //           description: "You have already submitted professional details.",
  //           variant: "default",
  //           duration: 3000
  //         });
  //         //navigate(`/${user?.role}/home`);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching professional details:', error);
  //     }
  //   };

  //   fetchProfessionalDetails();
  // }, [navigate, user?.role]);


  useEffect(() => {
    const fetchProfessionalDetails = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/doctor/details/professional', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        const data = await response.json();
        console.log("API Response - Professional Details:", data);
        
        if (response.ok && data.professionalDetails) {
          // Pre-populate form fields with existing data
          const details = data.professionalDetails;
          setSpecialization(details.specialisation || "");
          setCnicNumber(details.cnicNumber || "");
          setPmdcNumber(details.pmdcNumber || "");
          setEducationalBackground(details.educationalBackground || "");
          setAvailabilityStart(details.availableHours?.startTime || "");
          setAvailabilityEnd(details.availableHours?.endTime || "");
          setConsultationFee(details.consultationFee || "");
          setImgUrl(details.licenseImage || "");
          
          // Handle bank details if they exist
          if (details.bankDetails) {
            setBankDetails({
              accountHolderName: details.bankDetails.accountHolderName || "",
              accountNumber: details.bankDetails.accountNumber || "",
              bankName: details.bankDetails.bankName || "",
              branchCode: details.bankDetails.branchCode || "",
              iban: details.bankDetails.iban || "",
            });
            
            // Update the visible bank account field
            if (details.bankDetails.bankName && details.bankDetails.accountNumber) {
              setBankAccount(`${details.bankDetails.bankName} - ${details.bankDetails.accountNumber.slice(-4)}`);
            }
          }
          
          toast({
            description: "Loaded your existing professional details.",
            variant: "default",
            duration: 3000
          });
          
          // Comment out the navigation if you want to allow editing
          // navigate(`/${user?.role}/home`);
        }
      } catch (error) {
        console.error('Error fetching professional details:', error);
      }
    };
  
    fetchProfessionalDetails();
  }, [navigate, user?.role]);

  const handleImageChange = (url: string) => {
    setImgUrl(url);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log({
      specialization,
      cnicNumber,
      educationalBackground,
      availabilityStart,
      availabilityEnd,
      consultationFee,
      bankAccount,
      imgUrl
    });
    if (
      ! specialization ||
      ! cnicNumber ||
      ! educationalBackground ||
      ! availabilityStart ||
      ! availabilityEnd ||
      ! consultationFee ||
      ! bankAccount ||
      ! imgUrl
    ) {
      toast({
        description: "Please fill all required fields before submitting.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const payload = {
      specialisation: specialization,
      pmdcNumber: pmdcNumber,
      educationalBackground: educationalBackground,
      licenseImage: imgUrl || "null",
      cnicNumber: cnicNumber,
      availableHours: {
        startTime: availabilityStart,
        endTime: availabilityEnd,
      },
      consultationFee: consultationFee,
      bankDetails: {
        accountHolderName: bankDetails.accountHolderName,
        accountNumber: bankDetails.accountNumber,
        bankName: bankDetails.bankName,
        branchCode: bankDetails.branchCode,
        iban: bankDetails.iban,
      },
    };
    console.log("payload", payload);

    dispatch(setProfessionalDetails(payload));
    setLoading(true);

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
      console.log("API Response:", data);
      
      if (response.ok) {
        setMessage('Professional details submitted successfully!');
        navigate('/doctor/thankyoupage');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#D3EDEB]">
        <div className="p-8 bg-white shadow-lg w-full max-w-4xl md:max-w-6xl rounded-2xl">
          <p className="text-center text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const handlePmdcChange = (value: string) => {
    // Remove any non-numeric characters and hyphen
    let numericValue = value.replace(/[^\d]/g, '');
    let letter = value.replace(/[^A-Za-z]/g, ''); // Extract the letter part

    if (numericValue.length > 6) {
      numericValue = numericValue.slice(0, 6); // Limit to 6 digits
    }

    // Format PMDC number as "123456 - M"
    let formattedPmdc = numericValue;
    if (numericValue.length === 6 && letter.length > 0) {
      formattedPmdc = numericValue + ' - ' + letter.toUpperCase();
    }

    setPmdcNumber(formattedPmdc);
  };

  const validatePmdcNumber = (value: string) => {
    // Regular expression for validation: 6 digits, followed by ' - ' and 1 letter
    const regex = /^\d{6} - [A-Za-z]$/;
    return regex.test(value);
  };

  return (
    <div className="mt-5 p-5">
      <BackButton className="ml-10"/>
      <div className="flex items-center justify-center min-h-screen bg-[#D3EDEB]">
        <div
          className="p-8 bg-white shadow-lg w-full max-w-4xl md:max-w-6xl rounded-2xl"
          style={{ boxShadow: "1px 6px 16px 3px rgba(0,0,0,0.25)" }}
        >
          <h1 className="text-xl md:text-3xl font-semibold text-center mb-6">
            Please Enter Professional Details
          </h1>
          <div className="h-1 w-full bg-[#4EB5AD] my-4"></div>
          <p className="text-center text-lg md:text-2xl font-semibold underline decoration-solid decoration-[#9E00CA] mb-6 text-[#9E00CA]">
            We ensure you that all your personal information is safe with us. Rest assured
          </p>
          <div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 px-4 md:px-20">
            <SelectField
  label="Specialization"
  value={specialization}
  onChange={(value) => {
    console.log("Selected Specialization: ", value); // Log selected value
    setSpecialization(value);
  }}

  required={true}
  options={['Psychologist', 'Psychiatrist']}
/>
              <InputField
                label="CNIC Number"
                value={cnicNumber}
                onChange={(value) => {
                  let numericValue = value.replace(/\D/g, '');
              
                  if (numericValue.length > 13) {
                    numericValue = numericValue.slice(0, 13);
                  }
              
                  let formattedCnic = numericValue;
                  if (numericValue.length > 5) {
                    formattedCnic = numericValue.slice(0, 5) + '-' + numericValue.slice(5);
                  }
                  if (numericValue.length > 12) {
                    formattedCnic = formattedCnic.slice(0, 13) + '-' + formattedCnic.slice(13);
                  }
              
                  setCnicNumber(formattedCnic);
                }}
                required={true}
              />
               <div className="relative">
    <InputField
      label="PMDC Number"
      value={pmdcNumber}
      onChange={handlePmdcChange}
    />
    {!validatePmdcNumber(pmdcNumber) && pmdcNumber && (
      <p className="text-red-500 text-sm absolute bottom-[-24px] left-0">
        Please enter a valid PMDC number in the format: 123456 - M
      </p>
    )}
  </div>
              <InputField
                label="Educational Background"
                value={educationalBackground}
                onChange={setEducationalBackground}
                required={true}
              />
              {/* <div className="md:col-span-2 flex gap-4">
                <div className="flex-1">
                  <SelectField
                    label="Availability Hours (Start)"
                    value={availabilityStart}
                    options={TimeOptions}
                    onChange={setAvailabilityStart}
                    required={true}
                  />
                </div>
                <div className="flex-1">
                  <SelectField
                    label="Availability Hours (End)"
                    value={availabilityEnd}
                    options={TimeOptions}
                    onChange={setAvailabilityEnd}
                    required={true}
                  />
                </div>
              </div> */}

              <div className="flex-1">
                <InputField
                  label="Add Bank Account"
                  value={bankAccount}
                  onClick={() => setIsBankDetailsModalOpen(true)}
                  readOnly={true}
                  required={true}
                />
              </div>

              <InputField
                label="Consultation Fee"
                value={consultationFee}
                onChange={(value) => {
                  let numericValue = value.replace(/[^\d]/g, '');
              
                  const formattedFee = numericValue ? `${numericValue}` : '';
              
                  setConsultationFee(formattedFee);
                }}
                required={true}
              />
            </form>
            <div className="my-9">

            </div>
            <UploadImage
              label="License/Certification Proof"
              text="Choose image"
              onImageChange={handleImageChange}
              required={true}
            />
            {imgUrl && (
              <img src={imgUrl} alt="Preview" className="mt-4 rounded-[15px] h-48 object-cover mx-auto" />
            )}
          </div>

          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
              {message}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-[#02968A] text-white text-lg md:text-2xl font-bold py-3 px-12 rounded-2xl shadow-lg transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#027368]'
              }`}
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </div>

        {/* Bank Details Modal */}
        <BankDetailsModal
          isBankDetailsModalOpen={isBankDetailsModalOpen}
          handleSaveBankDetails={(values: any) => {
            setBankDetails(values);
            setBankAccount(`${values.bankName} - ${values.accountNumber.slice(-4)}`);
            setIsBankDetailsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default ProfessionalDetailForm;