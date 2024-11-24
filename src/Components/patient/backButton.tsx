import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function backButton() {
    const navigate = useNavigate();
  return (
    <>
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
       Back
     </button>
   </div>

   </>
  )
}
