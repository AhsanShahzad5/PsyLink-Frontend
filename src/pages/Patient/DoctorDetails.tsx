import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DefaultDoctorImage from '/src/assets/patient/doctor/doctor.png';
import { FaClock } from "react-icons/fa";

const DoctorProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctorCard = location.state?.doctorCard;

  if (!doctorCard) {
    return (
      <div>No doctor data available. Please go back and select a doctor.</div>
    );
  }

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

  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isAppointmentSuccess, setIsAppointmentSuccess] = useState(false);

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
        if (!dateString) return ""; // Handle empty strings or null
        
        try {
          const date = new Date(dateString);
          // Check if the date is valid
          if (isNaN(date.getTime())) {
            return dateString; // Return original string if invalid date
          }
          
          // Format as "Mon, 26 Apr" (Short day, day number, short month)
          return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
          });
        } catch (e) {
          return dateString; // Return original string if there's an error
        }
      };

      const formatTimeSlot = (timeSlot: string): string => {
        if (!timeSlot) return "";
        
        // Handle both formats: "09:00am" and "09:00AM" into "9:00 AM"
        const normalizedTime = timeSlot.toUpperCase();
        
        // Remove extra formats if needed
        if (normalizedTime.includes("-")) {
          return normalizedTime; // Return the full range if it's already in a range format
        }
        
        // Try to format the time nicely
        try {
          const [hours, minutesWithPeriod] = normalizedTime.split(":");
          if (!minutesWithPeriod) return normalizedTime;
          
          const minutes = minutesWithPeriod.slice(0, 2);
          const period = minutesWithPeriod.slice(2);
          
          // Remove leading zero for hours
          const formattedHour = hours.startsWith("0") ? hours.slice(1) : hours;
          
          return `${formattedHour}:${minutes} ${period}`;
        } catch (e) {
          return timeSlot; // Return original if parsing fails
        }
      };
    
    

  const handleBookAppointment = async () => {
    if (selectedDateIndex === null || !selectedSlot || !doctorCard?.id) {
      alert("Please select a date and time slot.");
      return;
    }
    const payload = {
      doctorId: doctorCard.id,
      date: availableDates[selectedDateIndex],
      time: selectedSlot,
    };
    try {
      const response = await fetch(
        "http://localhost:8000/api/patient/book/appointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setIsAppointmentSuccess(true);
        console.log("Response:", data);
      } else {
        const error = await response.json();
        console.error("Error response:", error);
        alert("Failed to book appointment. Please try again.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("An error occurred. Please try again later.");
    }
  };

  const aboutText = [
    "Welcome! I am a dedicated psychologist based in Pakistan, specializing in mental health and well-being. With a Master's degree in Clinical Psychology from Lahore University of Management Sciences (LUMS), I am committed to helping individuals navigate their mental health challenges and achieve a balanced and fulfilling life. With over 7 years of experience, I have worked with diverse populations, including children, adolescents, and adults, addressing issues such as anxiety, depression, stress, relationship difficulties, and trauma. My approach is rooted in evidence-based practices, combining Cognitive Behavioral Therapy (CBT), mindfulness techniques, and holistic methods to tailor treatment to each individual's unique needs. I believe in creating a safe and supportive environment where clients can openly express their thoughts and feelings. My goal is to empower individuals to understand their emotions, develop coping strategies, and foster resilience in the face of life's challenges. If you're seeking guidance and support, I invite you to reach out. Together, we can embark on a journey towards healing and personal growth.",
  ];

  const formatShowClinicTime = (time24: string) => {
    if (!time24) return "";
    const [hoursStr, minutes] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // 0 -> 12
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };
  

  const isValidImageUrl = (image: string) => {
    return image.startsWith('http://') || image.startsWith('https://');
  };

  
  return (
    <>
      <div className="mt-[100px] bg-white p-14 rounded-2xl shadow-lg max-w-[90rem] mx-auto">
        <div className="flex items-center mb-6">
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

        {/* Doctor Profile Info */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* Image Section */}
          <div className="sm:col-span-3 flex justify-center">
            <img
              src={image}
              className="w-[200px] h-[180px] sm:w-[315px] sm:h-[285px] bg-gray-200 rounded-lg"
              alt="img"
            />
          </div>

          {/* Info Section */}
          <div className="sm:col-span-6 flex flex-col justify-center p-4 gap-2 sm:gap-4">
            <h1 className="font-outfit font-semibold text-[20px] sm:text-[24px] leading-[28px] sm:leading-[30px] text-left">
              {fullName}
            </h1>
            <p className="font-outfit text-[16px] sm:text-[18px] font-light leading-[20px] sm:leading-[22px] text-left mt-1 sm:mt-2">
              {specialisation}
            </p>
            <p className="font-outfit text-[16px] sm:text-[22px] font-light leading-[20px] sm:leading-[22px] text-left mt-1 sm:mt-2">
              {educationBackground}
            </p>
            <p className="font-outfit text-[18px] sm:text-[18px] font-medium leading-[16px] sm:leading-[18px] text-left mt-3 sm:mt-4 text-gray-700">
              {city}, {country}
            </p>
          </div>

          {/* Timings and Fee */}
          <div className="sm:col-span-3 flex flex-col justify-center items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
  <FaClock className="text-primary" />
  <p className="font-outfit text-[16px] sm:text-[18px] font-light leading-[20px] sm:leading-[22px] text-center">
    {formatShowClinicTime(startTime)} - {formatShowClinicTime(endTime)}
  </p>
</div>


            <p className="font-outfit text-[16px] sm:text-[18px] font-light leading-[20px] sm:leading-[22px] text-center mt-2 sm:mt-4">
              Rs.{consultationFee}
            </p>
          </div>
        </div>

        {/* Date Selection Section */}
        <div className="mt-8 border-t border-gray-300 pt-4">
          <div className="flex gap-4 bg-[#fff] text-[#02968A] rounded-lg py-3 px-4 overflow-x-auto scrollbar-hidden border-y-2">
            {availableDates.map((date: any, index: any) => (
              <button
                key={index}
                className={`text-sm font-semibold px-12 py-2 rounded ${
                  selectedDateIndex === index
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
                className={`bg-gray-100 rounded-lg text-center py-4 sm:py-6 cursor-pointer text-lg sm:text-2xl ${
                  selectedSlot === slot
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

        {/* Book Appointment Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleBookAppointment}
            className={`bg-[#02968A] text-white text-sm font-light py-4 px-8 sm:px-12 rounded-lg ${
              selectedSlot && selectedDateIndex !== null
                ? "hover:bg-[#026F6A]"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!selectedSlot || selectedDateIndex === null}
          >
            Book Online Appointment
          </button>
        </div>

        {/* Success Modal */}
        {isAppointmentSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <div className="text-center">
                <div className="text-4xl text-green-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-16 h-16 mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m0 0a9 9 0 11-6.75 3.75A9 9 0 0115 10z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Appointment Booked Successfully!
                </h2>
                <p className="mt-4 text-gray-600">
                  Your appointment has been scheduled. Thank you for choosing
                  us.
                </p>
                <button
                  onClick={() => setIsAppointmentSuccess(false)}
                  className="mt-6 px-6 py-3 bg-[#02968A] text-white rounded-lg hover:bg-[#026F6A]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <hr className="border-gray-400 my-4 p-4" />

        {/* Header */}
        <h2 className="font-outfit font-semibold text-[30px]  text-left p-4 sm:text-[30px] ">
          About Me
        </h2>

        {/* Content Section */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 p-4">
          {/* Text Section */}
          <div className="sm:col-span-7">
            {description}
          </div>

          {/* Image Section */}
          <div className="sm:col-span-5 flex justify-center items-start">
            <div className="w-full max-w-[579px] h-auto bg-gray-200 rounded-lg sm:w-[439px] sm:h-[500px]">
              {/* Placeholder for image */}
              <img
                   src={image && isValidImageUrl(image) ? image : DefaultDoctorImage}
                   alt="Doctor"
                    className="w-full h-full object-cover"
                  />

            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          {/* Patients Treated */}
          <div
            className="flex items-center justify-center text-white rounded-full w-80 h-24 shadow-md sm:w-64 sm:h-20 md:w-80 md:h-24"
            style={{
              background: "linear-gradient(90deg, #047D72 0%, #014B44 100%)",
            }}
          >
            <div className="flex items-center gap-2">
              <p className="font-outfit font-extrabold text-2xl sm:text-xl md:text-2xl">
                0
              </p>
              <p className="font-outfit font-semibold text-2xl sm:text-lg md:text-2xl">
                Patients Treated
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorProfile;
