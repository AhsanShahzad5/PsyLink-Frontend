import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DefaultDoctorImage from '/src/assets/patient/doctor/doctor.png';
import { FaClock } from "react-icons/fa";
import DocReviews from "@/Components/doctor/DocReviews";
import DoctorReviewPage from "./DoctorReview";


const DoctorProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctorCard = location.state?.doctorCard;

  if (!doctorCard) {
    return (
      <div>No doctor data available. Please go back and select a doctor.</div>
    );
  }

  console.log("this is doctorCard.id: ", doctorCard.id)

  const {
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
  } = doctorCard;

  console.log(image);

  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  console.table(doctorCard);
  const availableDates = appointments.map(
    (appointment: any) => appointment.date
  );

  useEffect(() => {
    if (availableDates.length > 0 && selectedDateIndex === null) {
      setSelectedDateIndex(0);
    }
  }, [availableDates, selectedDateIndex]);

  const timeSlots =
    selectedDateIndex !== null && appointments[selectedDateIndex]?.slots
      ? appointments[selectedDateIndex].slots.map((slot: any) => slot.time)
      : [];

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

  const handleAnonymousBooking = ()=>{
    if (selectedDateIndex === null || !selectedSlot || !doctorCard?.id) {
      alert("Please select a date and time slot.");
      return;
    }

    
    const selectedDateStr = availableDates[selectedDateIndex];

     // Navigate to payment page with doctor and appointment details
     navigate('/patient/payNow', {
      state: {
        doctor: {
          _id: doctorCard.id,
          personalDetails: {
            fullName: fullName
          },
          userId: doctorCard.userId,
          professionalDetails: {
            specialisation: specialisation,
            consultationFee: consultationFee
          }
        },
        selectedDate: selectedDateStr,
        selectedTime: selectedSlot,
        anonymousBooking : true,
      }
    });

  }

  // Modified to navigate to payment page
  const handleBookAppointment = () => {
    if (selectedDateIndex === null || !selectedSlot || !doctorCard?.id) {
      alert("Please select a date and time slot.");
      return;
    }

    // Format the date properly for the backend
    const selectedDateStr = availableDates[selectedDateIndex];

    // Navigate to payment page with doctor and appointment details
    navigate('/patient/payNow', {
      state: {
        doctor: {
          _id: doctorCard.id,
          personalDetails: {
            fullName: fullName
          },
          userId: doctorCard.userId,
          professionalDetails: {
            specialisation: specialisation,
            consultationFee: consultationFee
          }
        },
        selectedDate: selectedDateStr,
        selectedTime: selectedSlot,
        anonymousBooking : false,
      }
    });
  };

  const aboutText = [
    "Welcome! I am a dedicated psychologist based in Pakistan, specializing in mental health and well-being. With a Master's degree in Clinical Psychology from Lahore University of Management Sciences (LUMS), I am committed to helping individuals navigate their mental health challenges and achieve a balanced and fulfilling life. With over 7 years of experience, I have worked with diverse populations, including children, adolescents, and adults, addressing issues such as anxiety, depression, stress, relationship difficulties, and trauma. My approach is rooted in evidence-based practices, combining Cognitive Behavioral Therapy (CBT), mindfulness techniques, and holistic methods to tailor treatment to each individual's unique needs. I believe in creating a safe and supportive environment where clients can openly express their thoughts and feelings. My goal is to empower individuals to understand their emotions, develop coping strategies, and foster resilience in the face of life's challenges. If you're seeking guidance and support, I invite you to reach out. Together, we can embark on a journey towards healing and personal growth.",
  ];

  const formatShowClinicTime = (time24: string) => {
    if (!time24) return "";
    const [hoursStr, minutes] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    // const ampm = hours >= 12 ? "PM" : "AM";
    const ampm = hours >= 12 ? "" : "";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const isValidImageUrl = (image: string) => {
    return image && (image.startsWith('http://') || image.startsWith('https://'));
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
    )
  }

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

        <div className="flex justify-center gap-3">

        {/* Book Appointment Button */}

        
        <div className="flex justify-center mt-8">
          <button
            onClick={handleBookAppointment}
            className={`bg-[#02968A] text-white text-sm font-light py-4 px-8 sm:px-12 rounded-lg ${selectedSlot && selectedDateIndex !== null
              ? "hover:bg-[#026F6A]"
              : "opacity-50 cursor-not-allowed"
              }`}
            disabled={!selectedSlot || selectedDateIndex === null}
          >
            Proceed to payment
          </button>
        </div>
        {/* Book Appointment Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleAnonymousBooking}
            className={`bg-[#02968A] text-white text-sm font-light py-4 px-8 sm:px-12 rounded-lg ${selectedSlot && selectedDateIndex !== null
              ? "hover:bg-[#026F6A]"
              : "opacity-50 cursor-not-allowed"
              }`}
            disabled={!selectedSlot || selectedDateIndex === null}
          >
            Anonymous Booking
          </button>
        </div>
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
                0
              </p>
              <p className="font-outfit font-semibold text-base sm:text-sm md:text-base">
                Patients Treated
              </p>
            </div>
          </div>
        </div>
      </div>
    )
   }
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

        {/*Section 2 : Date Selection Section */}
        <SelectSlot />


        {/* Section 3 : About */}
       <ProfileDetails/>
        {/* Section 4 : reviews */}
        <DocReviews doctorId={doctorCard.userId} />
      </div>
    </>
  );



};




export default DoctorProfile;