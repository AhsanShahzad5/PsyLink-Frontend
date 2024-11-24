import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GenerateReport from '@/Components/patient/GenerateReport';
import PrescriptionPage from '@/Components/patient/PrescriptionPopUp';


export default function Files() {

    const files = [
        {
          id: 1,
          type: "Prescription",
          title: "Medication Plan - October 2024",
          author: "Dr. Fahad Tariq Aziz",
          dateUploaded: "4th October, 2024",
          tags: ["Medication", "Health"],
          actions: ["View", "Download"],
        },
        {
          id: 2,
          type: "Mood Report",
          title: "Monthly Mood Analysis - September 2024",
          author: "System Generated",
          dateUploaded: "4th September, 2024",
          tags: ["Mental Health", "Mood"],
          actions: ["View", "Download", "Add Notes"],
        },
        {
          id: 3,
          type: "Mood Report",
          title: "Weekly Mood Tracker - Week 1",
          author: "System Generated",
          dateUploaded: "1st September, 2024",
          tags: ["Mental Health", "Weekly Tracker"],
          actions: ["View"],
        },
        // Add more file objects as needed
      ];

  const navigate = useNavigate();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleViewFile = (file:any) => {
    setSelectedFile(file);
    if (file.type === "Prescription") {
      setIsModalOpen(true);
    } else if (file.type === "Mood Report") {
      setShowReport(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowReport(false);
    setSelectedFile(null);
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 py-4 md:py-8 mt-24 min-h-[600px] bg-[#fff] mx-10 rounded-xl">
      {/* Back button */}
     <div className="flex items-center mb-6">
     <button
       onClick={() => navigate(-1)} // Navigate back to the previous page
       className="flex items-center text-xl font-medium text-[#02968A]  transition-transform transform hover:scale-110 "
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
       Files
     </button>
   </div>

      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex flex-col sm:flex-row items-start sm:items-center rounded-xl bg-white p-4 shadow-md border border-gray-200 space-y-4 sm:space-y-0 sm:space-x-4"
          >
            {/* Course Name */}
            <div className="flex-1 text-left font-semibold text-gray-800 w-full sm:w-auto">
              {file.type}
            </div>

            {/* Status */}
            <div className="flex-1 text-left sm:text-center text-gray-600 w-full sm:w-auto">
              {file.author}
            </div>

            {/* Tasks Done */}
            <div className="flex-1 text-left sm:text-center text-teal-600 font-semibold w-full sm:w-auto">
              {file.dateUploaded}
            </div>

            {/* View Button */}
            <div className="flex justify-start sm:justify-end w-full sm:w-auto">
              <button 
                  className="bg-teal-600 text-white px-4 py-2 hover:bg-teal-700 transition-colors flex items-center rounded-md"
                  onClick={() => handleViewFile(file)}
                  >
                View
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>


        {/* Modal for Prescription */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
          <div className="relative bg-transparent rounded-lg p-6 w-full max-w-[1000px] max-h-[500px] sm:w-[95%] sm:max-h-screen sm:overflow-y-scroll sm:[&::-webkit-scrollbar]:hidden sm:scrollbar-hide">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-4 text-black hover:text-black text-2xl z-50 transition-transform transform hover:scale-125"
            >
              ✖
            </button>
            <PrescriptionPage />
          </div>
        </div>
      )}

      {/* Modal for Mood Report */}
      {showReport && (
        <GenerateReport
        //   medicines={selectedFile?.medicines || []}
        //   moodData={selectedFile?.moodData || []}
          medicines={''}
          moodData={[]}
          setShowReport={setShowReport}
        />
      )}


    </div>
  );
}
