import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStickyNote } from 'react-icons/fa'; // Font Awesome
import { FaTrash } from 'react-icons/fa'; // Font Awesome

//patient data
import { patientData } from "./data/patientpagedata";
import { Patient } from "./data/interfaces";


const Patients: React.FC = () => {
  const navigate = useNavigate();

  

  const handleDetails = (patient: Patient) => {
    navigate("/admin/patients/patient-details", { state: { patient } });
  };

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg mb-8 h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Find Patients</h1>
          <input
            type="text"
            placeholder="Search by Id or Name"
            className="p-2 border rounded w-64"
          />
        </div>
        <p className="text-gray-500 mb-2">
          <span className="font-semibold">{patientData.length} Results Found</span>
        </p>
        <div className="divide-y divide-gray-200 overflow-auto h-[80%] custom-scrollbar">
  {patientData.map((patient) => (
    <div
    key={patient.id}
    className="flex justify-between py-4"
  >
    {/* Left Section: Patient Details */}
    <div className="flex flex-col items-start min-w-[200px]">
      <p className="text-lg font-medium truncate">{patient.name}</p>
      <p className="text-sm text-gray-500 truncate">
        {patient.time} - {patient.date}
      </p>
    </div>
  
    {/* Right Section: Buttons */}
    <div className="flex-shrink-0 flex gap-2">
      <button
        className="px-4 py-2 bg-[#F0F0F0] flex font-light border border-gray-300 text-primary rounded-lg shadow hover:bg-primary hover:text-white"
        onClick={() => handleDetails(patient)}
      >  <FaRegStickyNote className="w-4 h-7 mr-2" />
        Details
      </button>
      <button className="px-4 py-2 flex bg-[#F0F0F0] font-light border border-gray-300 text-primary rounded-lg shadow hover:bg-primary hover:text-white"> <FaTrash className="w-4 h-7 mr-2" />
        Remove
      </button>
    </div>
  </div>
  
  
  ))}
</div>

      </div>
    </div>
  );
};

export default Patients;
