import { ArrowRight, Star } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface DoctorCardProps {
  doctorCard: {
    id: string,
    fullName: string;
    image: string;
    consultationFee: number;
    city: string;
    country: string;
    specialisation: string;
    educationBackground: string;
    startTime: string;
    endTime: string;
    appointments : any
  };
}

export default function DoctorCard({ doctorCard }: DoctorCardProps) {
  const {
    id,
    fullName,
    image,
    consultationFee,
    city,
    country,
    specialisation,
    educationBackground,
    startTime,
    endTime,
    appointments
  } = doctorCard;

//  console.log("Doctor Card 1 :", doctorCard);

  const navigate = useNavigate();

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-screen mx-auto">
        {/* 1st Div: Image */}
        <div className="w-full sm:w-auto sm:flex-shrink-0">
          <img
            src="/src/assets/patient/doctor/doctor.png"
            alt="Doctor"
            className="w-full sm:w-40 h-auto sm:h-40 object-contain"
          />
        </div>
      
        {/* 2nd Div: Doctor Info */}
        <div className="flex-1 mx-6 my-4 sm:my-0">
          {/* Doctor Name, Specialization, and Available Time */}
          <div>
            <h3 className="font-semibold text-lg text-center sm:text-left">{fullName}</h3>
            <p className="text-sm text-gray-500 text-center sm:text-left">{specialisation}</p>
            <p className="text-sm text-gray-500 mt-1 text-center sm:text-left">{startTime} - {endTime}</p>
          </div>
      
          {/* Separator */}
          <hr className="my-4 border-1 border-black mx-auto sm:mx-0 max-w-sm sm:w-auto" />
      
          {/* Reviews and Rating */}
          <div className="flex justify-center sm:justify-start items-center text-gray-500">
            <Star size={16} className="text-yellow-400 mr-1" />
            {/* <span className="text-sm">{doctorCard.rating} ({doctorCard.reviews} reviews)</span> */}
            <span className="text-sm">4.5 (12 reviews)</span>
          </div>
        </div>
      
        {/* 3rd Div: View Button */}
        <div className="w-full sm:w-auto mt-2">
        <button 
            className="w-full sm:w-auto flex items-center justify-center px-10 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            onClick={ () => navigate('/patient/doctor-details ', { state: { doctorCard } })}
            >
          <span className="flex items-center">
            View <ArrowRight size={16} className="ml-2" />
          </span>
        </button>
        </div>
      </div>
    )
  }
  