import Navbar from '@/Components/Navbar';
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigation hook if using React Router

const DoctorReviewPage: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
  
      
      <div className="flex justify-center items-center h-full bg-transparent mt-14 sm:mt-10 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-12 mt-2 sm:mt-24 max-w-6xl w-full">
          {/* Back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)} // Navigate back to the previous page
              className="flex items-center text-lg sm:text-xl font-medium text-[#02968A] transition-transform transform hover:scale-110"
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

          {/* Doctor details */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
            <div className="flex-1 pr-0 sm:pr-4">
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Dr Fahad Tariq Aziz</h1>
                <p className="text-lg sm:text-xl text-gray-600 text-center sm:text-left">Psychologist</p>
                <p className="text-lg sm:text-2xl mt-2 text-center sm:text-left">Date of Session: 24th October, 2024</p>
                <p className="text-lg sm:text-2xl text-center sm:text-left">Time: 1:00 pm - 2:00 pm</p>
                <p className="text-lg sm:text-2xl mt-2 text-center sm:text-left">Referred: Breathing Course</p>
                <div className="flex justify-center sm:justify-start items-center mt-4">
                  <span className="text-4xl sm:text-6xl text-yellow-400">★★★★</span>
                  <span className="text-4xl sm:text-6xl text-gray-400">★</span>
                  <span className="text-xl sm:text-2xl ml-2">4.5</span>
                </div>
              </div>
            </div>
            <div className="mt-6 sm:mt-0">
              <img
                src="/src/assets/patient/doctor/doctor.png"
                alt="Dr Fahad Tariq Aziz"
                className="rounded-lg w-48 h-48 sm:w-[300px] sm:h-[300px]"
              />
            </div>
          </div>

          {/* Review section */}
          <div className="mt-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-left">Review</h2>
            <textarea
              className="w-full h-40 sm:h-56 p-4 sm:p-8 mt-2 text-base sm:text-lg text-gray-800 bg-gray-200 rounded-lg"
              readOnly
              value="The doctor was really patient and Dr Fahad was calming me a lot during the session. It really helped out clearing my thoughts. It's all thanks to Dr Fahad that I'm now capable of working my 24/7 job sanely. Thank you Dr Fahad, I can never truly repay you all my life."
            />
          </div>
        </div>
      </div>
    
  );
};

export default DoctorReviewPage;
