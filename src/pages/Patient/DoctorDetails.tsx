import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DoctorProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctorCard = location.state?.doctorCard;

  if (!doctorCard) {
    return <div>No doctor data available. Please go back and select a doctor.</div>;
  }

  console.log("Doctor Card:", doctorCard);

  // Destructure doctorCard object
  const {
    fullName,
    image,
    consultationFee,
    city,
    country,
    specialisation,
    educationBackground,
    startTime,
    endTime,
    appointments = [],
  } = doctorCard;
  
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isAppointmentSuccess, setIsAppointmentSuccess] = useState(false);
  
  // Extract unique dates from appointments
  const availableDates = appointments.map((appointment:any) => appointment.date);

  useEffect(() => {
    if (availableDates.length > 0 && selectedDateIndex === null) {
      setSelectedDateIndex(0); // Select the first date by default
    }
  }, [availableDates, selectedDateIndex]);

  // Time slots for the selected date
  const timeSlots =
    selectedDateIndex !== null && appointments[selectedDateIndex]?.slots
      ? appointments[selectedDateIndex].slots.map((slot:any) => slot.time)
      : [];


      const formatDate = (dateString: string): string => {
        if (!dateString) return ""; // Handle empty strings or null
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
      };


      const handleBookAppointment = async () => {
        if (selectedDateIndex === null || !selectedSlot || !doctorCard?.id) {
          alert("Please select a date and time slot.");
          return;
        }
      
        const payload = {
          doctorId: doctorCard.id, // Accessing doctor ID
          date: availableDates[selectedDateIndex], // Date in original format
          time: selectedSlot, // Selected time slot
        };

        console.log("payload : " , payload);
      
        try {
          const response = await fetch("http://localhost:8000/api/patient/book/appointment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(payload), // Send payload as JSON
          });
      
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



      const reviews = [
        {
          id: 1,
          name: "Abdul Rafay",
          rating: 5,
          comment:
            "He is an amazing Doctor who has really much supported me through all my problems. He has guided me along the way and the sessions are really helpful. Thank you Doctor ♥",
          timeAgo: "7d ago",
        },
        {
          id: 2,
          name: "Sarah Ahmed",
          rating: 5,
          comment:
            "Dr. Abdul is truly exceptional. His guidance and support have helped me tremendously. I’m forever grateful for his sessions.",
          timeAgo: "10d ago",
        },
        {
          id: 3,
          name: "Ali Khan",
          rating: 5,
          comment:
            "Wonderful experience! Dr. Abdul's expertise and care made a huge difference in my life. Highly recommend!",
          timeAgo: "2w ago",
        },
        {
          id: 4,
          name: "Maria Ali",
          rating: 4,
          comment:
            "Great doctor! Helped me through a tough time and provided excellent guidance. Highly appreciated.",
          timeAgo: "3w ago",
        },
        {
          id: 5,
          name: "John Doe",
          rating: 4,
          comment:
            "Good experience overall. The sessions were effective, and I feel better than before.",
          timeAgo: "1mo ago",
        },
        {
          id: 6,
          name: "Jane Smith",
          rating: 5,
          comment:
            "Highly recommend Dr. Abdul! His professionalism and care are unmatched. Truly thankful!",
          timeAgo: "2mo ago",
        },
      ];
    
      const [currentPage, setCurrentPage] = useState(1);
      const reviewsPerPage = 3;
    
      const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    
      // Get reviews for the current page
      const displayedReviews = reviews.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage
      );
    
      const handlePageChange = (page:any) => {
        setCurrentPage(page);
      };
    
      const handleViewMore = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };
    


  return (
    <>
      <div className="mt-[100px] bg-white p-14 rounded-2xl shadow-lg max-w-[90rem] mx-auto">
        {/* Back Button */}
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
            <p className="font-outfit text-[16px] sm:text-[18px] font-light leading-[20px] sm:leading-[22px] text-center">
              {startTime} - {endTime}
            </p>
            <p className="font-outfit text-[16px] sm:text-[18px] font-light leading-[20px] sm:leading-[22px] text-center mt-2 sm:mt-4">
              Rs.{consultationFee}
            </p>
            <p className="font-outfit text-[14px] sm:text-[16px] text-[#2C43D6] font-light leading-[18px] sm:leading-[20px] text-center underline mt-2">
              ★4.8 (224 reviews)
            </p>
          </div>
        </div>

        {/* Date Selection Section */}
        <div className="mt-8 border-t border-gray-300 pt-4">
          <div className="flex gap-4 bg-[#fff] text-[#02968A] rounded-lg py-3 px-4 overflow-x-auto scrollbar-hidden border-y-2">
            {availableDates.map((date:any, index:any) => (
              <button
                key={index}
                className={`text-sm font-semibold px-12 py-2 rounded ${
                  selectedDateIndex === index
                    ? "border-2 border-[#02968A]"
                    : "hover:border-2 hover:border-[#02968A]"
                }`}
                onClick={() => setSelectedDateIndex(index)}
              >
                 {/* {formatDate(date)}  */}
                {date}
              </button>
            ))}
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {timeSlots.map((slot:any, index:any) => (
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
                Your appointment has been scheduled. Thank you for choosing us.
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
{aboutText.map((paragraph, index) => (
<p
  key={index}
  className="font-outfit text-[22px] font-light text-left text-[#000] mb-6"
>
  {paragraph}
</p>
))}
</div>

{/* Image Section */}
<div className="sm:col-span-5 flex justify-center items-start">
<div className="w-full max-w-[579px] h-auto bg-gray-200 rounded-lg sm:w-[439px] sm:h-[500px]">
{/* Placeholder for image */}
<img
  src="/src/assets/patient/doctor/doctor.jpg"
  alt="Dr Fahad Tariq Aziz"
  className="w-full h-full object-fit rounded-lg"
/>
</div>
</div>
</div>







  {/* Statistics Section */}
  <div className="flex flex-wrap justify-center gap-8 mt-16">
  {/* Patients Treated */}
  <div className="flex items-center justify-center text-white rounded-full w-80 h-24 shadow-md sm:w-64 sm:h-20 md:w-80 md:h-24" style={{ background: 'linear-gradient(90deg, #047D72 0%, #014B44 100%)' }}>
    <div className="flex items-center gap-2">
      <p className="font-outfit font-extrabold text-2xl sm:text-xl md:text-2xl">234</p>
      <p className="font-outfit font-semibold text-2xl sm:text-lg md:text-2xl">Patients Treated</p>
    </div>
  </div>

  {/* Five Star Reviews */}
  <div className="flex items-center justify-center text-white rounded-full w-80 h-24 shadow-md sm:w-64 sm:h-20 md:w-80 md:h-24" style={{ background: 'linear-gradient(90deg, #047D72 0%, #014B44 100%)' }}>
    <div className="flex items-center gap-2">
      <p className="font-outfit font-extrabold text-2xl sm:text-xl md:text-2xl">70</p>
      <p className="font-outfit font-semibold text-2xl sm:text-lg md:text-2xl">Five Star Reviews</p>
    </div>
  </div>
</div>











 {/* Title */}
 <h1 className="font-outfit mt-8 p-4   text-3xl font-semibold leading-[42px] text-left">
        Reviews
      </h1>

      {/* Review Cards */}
      <div className="mt-5 space-y-4 p-4">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="flex items-center bg-gray-100 rounded-lg p-4 shadow-md"
          >
            {/* Profile Picture */}
            <div className="w-14 h-14 rounded-full bg-teal-700 flex items-center justify-center text-white font-medium text-lg">
              {review.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            {/* Review Content */}
            <div className="ml-4 flex-1">
              <div className="font-outfit text-lg font-medium text-left text-gray-800">
                {review.name}
              </div>
              <div className="font-outfit text-yellow-400 text-left text-base">
                {"★".repeat(review.rating)}
              </div>
              <div className="font-outfit text-sm font-light text-left text-gray-600 mt-2">
                {review.comment}
              </div>
            </div>

            {/* Timestamp */}
            <div className="font-outfit text-sm font-light text-gray-500 mr-2 mb-14">
              {review.timeAgo}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-5 space-x-2">
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-9 h-9 rounded-md ${
                pageNum === currentPage
                  ? "bg-teal-700 text-white"
                  : "bg-gray-300 text-black"
              } font-outfit text-sm font-medium`}
            >
              {pageNum}
            </button>
          );
        })}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-9 h-9 rounded-md bg-gray-300 text-black font-outfit text-sm font-medium"
          >
            &gt;
          </button>
        )}
      </div>

      {/* View More */}
      <div
        onClick={handleViewMore}
        className={`mt-4 text-center font-outfit text-sm font-light text-teal-700 underline cursor-pointer ${
          currentPage === totalPages ? "hidden" : ""
        }`}
      >
        View More
      </div>
    





</div>
    </>
  );
};

export default DoctorProfile;
