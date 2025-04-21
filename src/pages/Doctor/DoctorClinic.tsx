import React, { useEffect, useState } from "react";
import DoctorAboutSection from "@/Components/doctor/DoctorAboutSection";
import DoctorCalender from "@/Components/doctor/DoctorCalender";
import DoctorIntro from "@/Components/doctor/DoctorIntro";
import DoctorStatsBar from "@/Components/doctor/DoctorStatsBar";
import { Link } from "react-router-dom";

const DoctorClinic = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clinicDetails, setClinicDetails] = useState(null);
  const [availabilityDetails, setAvailabilityDetails] = useState(null);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/doctor/status",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch verification status.");
        }
        const data = await response.json();
        if (data.status === "verified") {
          setIsVerified(true);
          await setupClinic();
        } else {
          setIsVerified(false);
        }
      } catch (error: any) {
        setErrorMessage(error.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    const setupClinic = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/doctor/clinic/setup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to set up the clinic.");
        }
        console.log("Clinic successfully set up!");
      } catch (error: any) {
        setErrorMessage(
          error.message || "Something went wrong while setting up the clinic."
        );
      }
    };
    fetchVerificationStatus();
  }, []);

  useEffect(() => {
    if (!isVerified) return;
    const fetchClinicDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/doctor/get/clinic-details",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(
            errorData.message || "Failed to fetch clinic details"
          );
          return;
        }
        const data = await response.json();
        console.log(
          "API IN DOCTOR CLINIC WHICH BRING CLINIC AND AVAILABILITY",
          data
        );
        setClinicDetails(data.clinic);
        setAvailabilityDetails(data.availability);
      } catch (err) {
        setErrorMessage("Error while getting clinic data");
      }
    };
    fetchClinicDetails();
  }, [isVerified]);

  if (isLoading) {
    return (
      <div className="pt-20 max-w-[89rem] mx-auto text-center">
        <p className="text-gray-600 text-lg">
          Checking your verification status...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="pt-20 max-w-[89rem] mx-auto text-center">
        <p className="text-red-500 text-lg font-semibold">
          Error: {errorMessage}
        </p>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <p className="text-red-500 text-lg font-semibold">
            {" "}
            Your status is not verified to set up the clinic.{" "}
          </p>{" "}
          <p className="text-gray-600 text-sm mt-2">
            {" "}
            The verification process usually takes 1 to 2 days. Please check
            back soon to confirm your status.{" "}
          </p>{" "}
          <p className="text-gray-700 text-sm">
            {" "}
            You can navigate to{" "}
            <Link
              to={"/doctor/detailform"}
              className="text-blue-500 underline hover:text-blue-700 transition-colors"
            >
              {" "}
              Personal Detail Form{" "}
            </Link>{" "}
            or{" "}
            <Link
              to={"/doctor/professionaldetailForm"}
              className="text-blue-500 underline hover:text-blue-700 transition-colors"
            >
              {" "}
              Professional Detail Form{" "}
            </Link>{" "}
            to add or update your details if needed.{" "}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-[89rem] mx-auto">
      <div className="flex flex-col">
        <DoctorIntro clinicDetails={clinicDetails} />{" "}
        <DoctorCalender availabilityDetails={availabilityDetails} />
        <DoctorAboutSection />
        <DoctorStatsBar />
      </div>
    </div>
  );
};

export default DoctorClinic;
