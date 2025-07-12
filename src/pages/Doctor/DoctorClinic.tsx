import React, { useEffect, useState } from "react";
import DoctorAboutSection from "@/Components/doctor/DoctorAboutSection";
import DoctorCalender from "@/Components/doctor/DoctorCalender";
import DoctorIntro from "@/Components/doctor/DoctorIntro";
import DoctorStatsBar from "@/Components/doctor/DoctorStatsBar";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";
import DocReviews from "@/Components/doctor/DocReviews";




const DoctorClinic = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clinicDetails, setClinicDetails] = useState(null);
  const [availabilityDetails, setAvailabilityDetails] = useState(null);
  const user = useRecoilValue(userAtom);
  const doctorId = user._id;

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/doctor/status", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch verification status.");
        }

        const data = await response.json();

        if (data.status === "verified") {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (error: any) {
        setErrorMessage(error.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerificationStatus();
  }, []);


  if (isLoading) {
    return (
      <div className="pt-20 max-w-[89rem] mx-auto text-center">
        <p className="text-gray-600 text-lg">Checking your verification status...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="pt-20 max-w-[89rem] mx-auto text-center">
        <p className="text-red-500 text-lg font-semibold">Error: {errorMessage}</p>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <p className="text-red-500 text-lg font-semibold">
            Your status is not verified to set up the clinic.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            The verification process usually takes 1 to 2 days. Please check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-[89rem] mx-auto">
      <div className="flex flex-col">
        <DoctorIntro />
        <DoctorCalender />
        <DoctorAboutSection />
        <DocReviews doctorId={doctorId}/>
      </div>
    </div>
  );
};

export default DoctorClinic;

