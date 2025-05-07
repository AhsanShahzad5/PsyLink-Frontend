import React from 'react';
import TopDesign from "./../../assets/patient/Prescription/TopDesign.png";
import LowerLeftBackground from "./../../assets/patient/Prescription/LowerLeftBackground.png";
import PsyLinkLogo from "./../../assets/patient/Prescription/PsylinkLogo.png";

// Updated interface based on actual API response
interface PrescriptionItem {
  medicine: string;
  instructions: string;
  _id: string;
}

interface PrescriptionProps {
  prescription: {
    _id: string;
    prescriptionId: string;
    doctorId: string;
    doctorName: string;
    doctorSpecialisation: string;
    patientId: string;
    patientName: string;
    patientGender: string;
    patientAge: string;
    date: string;
    prescription: PrescriptionItem[];
    createdAt: string;
    updatedAt: string;
  };
}

const PrescriptionDebugModal: React.FC<PrescriptionProps> = ({ prescription }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-[20px] shadow-lg overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
      {/* Top Design */}
      <img
        src={TopDesign}
        alt="Top Design"
        className="absolute top-0 left-0 w-full h-auto md:h-[380px] object-cover rounded-t-[20px] z-0"
      />

      {/* Header Section */}
      <div className="absolute top-0 left-0 w-full h-auto md:h-[180px] flex items-center px-4 md:px-6 z-10">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={PsyLinkLogo}
            alt="PsyLink Logo"
            className="w-[40px] h-[48px] md:w-[50px] md:h-[60px] object-contain"
          />
          <h1 className="text-lg md:text-[24px] font-bold text-white ml-2">PsyLink</h1>
        </div>
        {/* Prescription Info */}
        <div className="ml-auto text-right text-white">
          <p className="text-xs md:text-[16px] font-medium text-white pr-2 md:pr-4">Date: {formatDate(prescription.date)}</p>
          <p className="text-xs md:text-[16px] font-medium text-white pr-2 md:pr-4">ID: {prescription.prescriptionId}</p>
        </div>
      </div>

      {/* Content Container */}
      <div className="pt-[160px] sm:pt-[180px] md:pt-[200px] px-4 md:px-6 pb-16 relative">
        {/* Doctor Details */}
        <div className="text-left mb-4">
          <h2 className="text-black sm:text-base sm:text-lg md:text-[20px] font-semibold">Dr: {prescription.doctorName}</h2>
          <p className="text-black sm:text-base sm:text-lg md:text-[20px] font-semibold">{prescription.doctorSpecialisation}</p>
        </div>

        {/* Patient Details */}
        <div className="text-right pr-4 md:pr-20 mb-8 md:mb-16 mt-0 md:mt-[-60px]">
          <p className="text-primary sm:text-xl md:text-[24px] font-medium">
            Patient's Name: <span className="underline">{prescription.patientName}</span>
          </p>
          <p className="text-primary sm:text-xl md:text-[24px] font-medium">
            Sex: <span className="underline">{prescription.patientGender}</span>
          </p>
          <p className="text-primary sm:text-xl md:text-[24px] font-medium">
            Age: <span className="underline">{prescription.patientAge}</span>
          </p>
        </div>

        {/* Prescription Content */}
        <div className="flex flex-col relative mt-36 mb-8">
          {/* Headers */}
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <h3 className="text-lg md:text-[22px] font-bold text-[#02968A] w-full sm:w-1/2 pr-0 sm:pr-4 mb-2 sm:mb-0">
              Management Plan
            </h3>
            <h3 className="text-lg md:text-[22px] font-bold text-[#02968A] w-full sm:w-1/2 pl-0 sm:pl-4">
              Instructions
            </h3>
          </div>

          {/* Separator Line - only visible on tablet and above */}
          <div
            className="hidden sm:block absolute top-0 bottom-0 left-1/2 w-[2px] bg-[#000]"
            style={{ transform: "translateX(-50%)" }}
          ></div>

          {/* Prescription Items */}
          {prescription.prescription.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row justify-between mb-4">
              <div className="w-full sm:w-1/2 pr-0 sm:pr-4 mb-2 sm:mb-0">
                <p className="p-2 bg-gray-50 rounded border border-gray-200">{item.medicine}</p>
              </div>
              <div className="w-full sm:w-1/2 pl-0 sm:pl-4">
                <p className="p-2 bg-gray-50 rounded border border-gray-200">{item.instructions}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lower Left Background */}
      <div className="absolute bottom-0 left-0 z-0 pointer-events-none">
        <img
          src={LowerLeftBackground}
          alt="Lower Left Background"
          className="w-[200px] md:w-[300px] lg:w-[300px] bottom-0"
          style={{
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row justify-center items-center px-4 md:px-6 pb-4 pt-2 relative z-20 bg-white">
        <p className="text-[#02968A] text-xs md:text-sm mb-4 sm:mb-0">Copyright © 2024 PsyLink | All Rights Reserved</p>
        {/* <div>
          <button className="bg-[#02968A] text-white py-1 md:py-2 px-3 md:px-6 rounded-lg hover:bg-[#016d63] text-sm md:text-base">
            Download PDF
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PrescriptionDebugModal;