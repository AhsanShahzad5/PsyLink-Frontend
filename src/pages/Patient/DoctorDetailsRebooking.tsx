import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DefaultDoctorImage from '/src/assets/patient/doctor/doctor.png';
import { FaClock } from "react-icons/fa";
import DocReviews from "@/Components/doctor/DocReviews";
import DoctorReviewPage from "./DoctorReview";
import { useSearchParams } from 'react-router-dom';

// Define proper TypeScript interfaces
interface Slot {
  time: string;
  status: 'available' | 'busy' | 'booked';
  bookedBy?: string;
}

interface Availability {
  date: string;
  slots: Slot[];
}

interface Rating {
  TotalStars: number;
  TotalReviews: number;
}

interface DoctorCard {
  id: string;
  userId: string;
  fullName: string;
  image: string;
  consultationFee: number;
  city: string;
  country: string;
  description: string;
  specialisation: string;
  educationBackground: string;
  startTime: string;
  endTime: string;
  appointments: Availability[];
  slots: Slot[];
  rating: Rating;
  status: 'pending' | 'verified';
}

const DoctorProfileRebooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // At the top of your rebooking component, get the parameters
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const patientId = searchParams.get('patientId');
  const doctorId = searchParams.get('doctorId');
  
  // ALL HOOKS MUST BE DECLARED HERE - BEFORE ANY CONDITIONAL RETURNS
  const [doctorCard, setDoctorCard] = useState<DoctorCard | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Derived values that depend on doctorCard
  const availableDates: string[] = doctorCard?.appointments?.map(
    (appointment: Availability) => appointment.date
  ) || [];


  

  const timeSlots: string[] =
    selectedDateIndex !== null && doctorCard?.appointments?.[selectedDateIndex]?.slots
      ? doctorCard.appointments[selectedDateIndex].slots.map((slot: Slot) => slot.time)
      : [];

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (doctorId) {
        try {
          setIsLoading(true);
          
          const response = await fetch(`http://localhost:8000/api/doctor/details/${doctorId}` ,  {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: "include", // Include cookies for authentication
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Doctor details fetched:", data);
          
          if (data.success && data.doctorCard) {
            setDoctorCard(data.doctorCard);
          }
        } catch (error) {
          console.error('Error fetching doctor details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  useEffect(() => {
    if (availableDates.length > 0 && selectedDateIndex === null) {
      setSelectedDateIndex(0);
    }
  }, [availableDates, selectedDateIndex]);

  console.log(doctorId);

  // NOW SAFE TO HAVE CONDITIONAL RETURNS AFTER ALL HOOKS ARE DECLARED
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#02968A]"></div>
      </div>
    );
  }

  if (!doctorCard) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No doctor data available</h2>
          <p className="text-gray-600 mb-4">Please go back and select a doctor.</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#02968A] text-white px-6 py-2 rounded-lg hover:bg-[#026F6A]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    id,
    fullName,
    image,
    consultationFee,
    city,
    country,
    description,
    specialisation,
    educationBackground,
    startTime,
    endTime,
    appointments = [],
    slots = [],
    rating,
    status
  } = doctorCard;

  console.log("Doctor card data:", doctorCard);
  console.log("Image URL:", image);

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatTimeSlot = (timeSlot: string): string => {
    if (!timeSlot) return "";

    const normalizedTime = timeSlot.toUpperCase();

    if (normalizedTime.includes("-")) {
      return normalizedTime;
    }

    try {
      const [hours, minutesWithPeriod] = normalizedTime.split(":");
      if (!minutesWithPeriod) return normalizedTime;

      const minutes = minutesWithPeriod.slice(0, 2);
      const period = minutesWithPeriod.slice(2);

      const formattedHour = hours.startsWith("0") ? hours.slice(1) : hours;

      return `${formattedHour}:${minutes} ${period}`;
    } catch (e) {
      return timeSlot;
    }
  };

  // Modified rebooking handler
  const handleBookAppointment = async () => {
    if (selectedDateIndex === null || !selectedSlot || !doctorCard?.id) {
      alert("Please select a date and time slot.");
      return;
    }

    try {
      // Show loading state
      setIsLoading(true);

      // Format the date properly for the backend
      const selectedDateStr = availableDates[selectedDateIndex];
      
      // Call the existing book appointment API
      const response = await fetch('http://localhost:8000/api/patient/book/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          doctorId: doctorId, // This should be the doctor's _id from your database
          date: selectedDateStr,
          time: selectedSlot ,
          patientId:patientId
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Success - show success message
        alert('Appointment rescheduled successfully!');
        
        // Optional: Log the original appointment info for reference
        console.log('Original appointment ID:', appointmentId);
        console.log('Patient ID:', patientId);
        
        // Redirect to patient dashboard or appointments page
        navigate('/patient/home'); // or wherever you want to redirect
      } else {
        // Handle error
        alert(data.message || 'Failed to reschedule appointment');
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      alert('An error occurred while rescheduling the appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const aboutText = [
    "Welcome! I am a dedicated psychologist based in Pakistan, specializing in mental health and well-being. With a Master's degree in Clinical Psychology from Lahore University of Management Sciences (LUMS), I am committed to helping individuals navigate their mental health challenges and achieve a balanced and fulfilling life. With over 7 years of experience, I have worked with diverse populations, including children, adolescents, and adults, addressing issues such as anxiety, depression, stress, relationship difficulties, and trauma. My approach is rooted in evidence-based practices, combining Cognitive Behavioral Therapy (CBT), mindfulness techniques, and holistic methods to tailor treatment to each individual's unique needs. I believe in creating a safe and supportive environment where clients can openly express their thoughts and feelings. My goal is to empower individuals to understand their emotions, develop coping strategies, and foster resilience in the face of life's challenges. If you're seeking guidance and support, I invite you to reach out. Together, we can embark on a journey towards healing and personal growth.",
  ];

  const formatShowClinicTime = (time24: string): string => {
    if (!time24) return "";
    const [hoursStr, minutes] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const isValidImageUrl = (image: string): boolean => {
    return typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'));
  };

  const AboutSection = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-white p-4">
        {/* Image Section */}
        <div className="sm:col-span-3 flex justify-center pb-5">
          <img
            src={image && isValidImageUrl(image) ? image : DefaultDoctorImage}
            className="w-[140px] h-[180px] sm:w-[240px] sm:h-[240px] bg-gray-200 rounded-lg object-cover"
            alt={fullName}
          />
        </div>

        {/* Info Section */}
        <div className="sm:col-span-6 flex flex-col justify-center p-3 gap-2 sm:gap-4">
          <h1 className="font-outfit font-semibold text-[20px] sm:text-[22px] leading-[28px] sm:leading-[30px] text-left">
            {fullName}
          </h1>
          <p className="font-outfit text-[16px] sm:text-[16px] font-light leading-[20px] sm:leading-[22px] text-left mt-1 sm:mt-2">
            {specialisation}
          </p>
          <p className="font-outfit text-[16px] sm:text-[22px] font-light leading-[20px] sm:leading-[22px] text-left mt-1 sm:mt-2">
            {educationBackground}
          </p>
          <p className="font-outfit text-[16px] sm:text-[16px] font-medium leading-[16px] sm:leading-[16px] text-left mt-3 sm:mt-4 text-gray-700">
            {city}, {country}
          </p>
        </div>

        {/* Timings and Fee */}
        <div className="sm:col-span-3 flex flex-col justify-center items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <FaClock className="text-primary" />
            <p className="font-outfit text-[16px] sm:text-[16px] font-light leading-[20px] sm:leading-[22px] text-center">
              {formatShowClinicTime(startTime)} - {formatShowClinicTime(endTime)}
            </p>
          </div>

          <p className="font-outfit text-[16px] sm:text-[16px] font-light leading-[20px] sm:leading-[22px] text-center mt-2 sm:mt-4">
            Rs.{consultationFee}
          </p>
        </div>
      </div>
    );
  };

  const SelectSlot2 = () => {
    return (
      <div className="bg-white pb-6">
        <div className="mt-6 border-t pt-6">
          <div className="flex gap-4 bg-[#fff] text-[#02968A] rounded-lg py-3 px-4 overflow-x-auto scrollbar-hidden border-y-2">
            {availableDates.map((date: string, index: number) => (
              <button
                key={index}
                className={`text-sm font-semibold px-12 py-2 rounded ${
                  selectedDateIndex === index
                    ? "border-2 border-[#02968A]"
                    : "hover:border-2 hover:border-[#02968A]"
                }`}
                onClick={() => setSelectedDateIndex(index)}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {timeSlots.map((slot: string, index: number) => (
              <div
                key={index}
                className={`bg-gray-100 rounded-lg text-center py-2 sm:py-4 cursor-pointer text-lg sm:text-2xl ${
                  selectedSlot === slot
                    ? "border-2 border-[#02968A]"
                    : "hover:border-2 hover:border-[#02968A]"
                }`}
                onClick={() => setSelectedSlot(slot)}
              >
                <p className="font-outfit text-sm font-light">{formatTimeSlot(slot)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Book Appointment Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleBookAppointment}
            className={`bg-[#02968A] text-white text-sm font-light py-4 px-8 sm:px-12 rounded-lg ${
              selectedSlot && selectedDateIndex !== null && !isLoading
                ? "hover:bg-[#026F6A]"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!selectedSlot || selectedDateIndex === null || isLoading}
          >
            {isLoading ? 'Processing...' : 'Reschedule Appointment'}
          </button>
        </div>
      </div>
    );
  };

  const SelectSlot = () => {
    return (
      <div className="bg-white pb-6">
        <div className="mt-6 border-t pt-6 ">
          <div className="flex gap-4 bg-[#fff] text-[#02968A] rounded-lg py-3 px-4 overflow-x-auto scrollbar-hidden border-y-2">
            {availableDates.map((date: any, index: any) => (
              <button
                key={index}
                className={`text-sm font-semibold px-12 py-2 rounded ${selectedDateIndex === index
                  ? "border-2 border-[#02968A]"
                  : "hover:border-2 hover:border-[#02968A]"
                  }`}
                onClick={() => setSelectedDateIndex(index)}
              >
                {date}
              </button>
            ))}
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {timeSlots.map((slot: any, index: any) => (
              <div
                key={index}
                className={`bg-gray-100 rounded-lg text-center py-2 sm:py-4 cursor-pointer text-lg sm:text-2xl ${selectedSlot === slot
                  ? "border-2 border-[#02968A]"
                  : "hover:border-2 hover:border-[#02968A]"
                  }`}
                onClick={() => setSelectedSlot(slot)}
              >
                <p className="font-outfit text-sm font-light">{slot}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Book Appointment Button
        <div className="flex justify-center mt-8">
          <button
            onClick={handleBookAppointment}
            className={`bg-[#02968A] text-white text-sm font-light py-4 px-8 sm:px-12 rounded-lg ${selectedSlot && selectedDateIndex !== null
              ? "hover:bg-[#026F6A]"
              : "opacity-50 cursor-not-allowed"
              }`}
            disabled={!selectedSlot || selectedDateIndex === null}
          >
            Proceed to Payment
          </button>
        </div> */}

        {/* Book Appointment Button */}
               <div className="flex justify-center mt-8">
          <button
            onClick={handleBookAppointment}
            className={`bg-[#02968A] text-white text-sm font-light py-4 px-8 sm:px-12 rounded-lg ${
              selectedSlot && selectedDateIndex !== null && !isLoading
                ? "hover:bg-[#026F6A]"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!selectedSlot || selectedDateIndex === null || isLoading}
          >
            {isLoading ? 'Processing...' : 'Reschedule Appointment'}
          </button>
        </div>

      </div>
    )
  }
  const ProfileDetails = () => {
    return (
      <div className="bg-white mt-5 pb-4 mb-4 p-4">
        {/* Header */}
        <h2 className="font-outfit font-semibold text-[20px] text-left p-3 sm:text-[22px] bg-white">
          About Me
        </h2>

        {/* Content Section */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 p-3">
          {/* Text Section */}
          <div className="sm:col-span-7">
            {description}
          </div>

          {/* Image Section */}
          <div className="sm:col-span-5 flex justify-end items-start">
            <div className="w-full max-w-[300px] h-auto bg-gray-200 rounded-lg sm:w-[280px] sm:h-[320px]">
              <img
                src={image && isValidImageUrl(image) ? image : DefaultDoctorImage}
                alt="Doctor"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 px-4">
          {/* Patients Treated */}
          <div
            className="flex items-center justify-center text-white rounded-full w-48 h-12 shadow-md sm:w-52 sm:h-12 md:w-56 md:h-14"
            style={{
              background: "linear-gradient(90deg, #047D72 0%, #014B44 100%)",
            }}
          >
            <div className="flex items-center gap-2">
              <p className="font-outfit font-extrabold text-base sm:text-base md:text-lg">
                {rating?.TotalReviews || 0}
              </p>
              <p className="font-outfit font-semibold text-base sm:text-sm md:text-base">
                Patients Treated
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mt-[35px] mx-5 p-12 max-w-[90rem]">
        {/* back button */}
        <div className="flex items-center pt-4 p-2 pb-6 bg-white">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-xl font-medium text-[#02968A] transition-transform transform hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Back
          </button>
        </div>

        {/* Section 1 : Doctor Profile Info */}
        <AboutSection />

        {/* Section 2 : Date Selection Section */}
        <SelectSlot />

        {/* Section 3 : About */}
        <ProfileDetails />

        {/* Section 4 : reviews */}
        {/* <DocReviews doctorId={doctorCard.userId} /> */}
      </div>
    </>
  );
};

export default DoctorProfileRebooking;