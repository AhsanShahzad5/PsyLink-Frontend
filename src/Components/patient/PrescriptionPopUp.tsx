import React from "react";
import TopDesign from "./../../assets/patient/Prescription/TopDesign.png";
import LowerLeftBackground from "./../../assets/patient/Prescription/LowerLeftBackground.png";
import PsyLinkLogo from "./../../assets/patient/Prescription/PsylinkLogo.png";

// Define the interface for prescription items
interface PrescriptionItem {
  medicine: string;
  instructions: string;
}

// Dummy dynamic data
const prescriptionData: PrescriptionItem[] = [
  { medicine: "Xynax 500mg", instructions: "Day & Night - 7 Days" },
  { medicine: "Paracetamol 650mg", instructions: "After Meals - 5 Days" },
  { medicine: "Ibuprofen 200mg", instructions: "Morning Only - 3 Days" },
  { medicine: "Omeprazole 20mg", instructions: "Before Breakfast - 14 Days" },
  { medicine: "Vitamin D3", instructions: "Weekly - 8 Weeks" },
];

const PrescriptionPage: React.FC = () => {
  return (
    <div className="relative w-[900px] h-[850px] bg-white rounded-[20px] shadow-lg overflow-hidden">
      {/* Top Design */}
      <img
        src={TopDesign}
        alt="Top Design"
        className="absolute top-0 left-0 w-full h-[380px] object-cover rounded-t-[20px] z-0"
      />

      {/* Header Section */}
      <div className="absolute top-0 left-0 w-full h-[180px] flex items-center px-6 z-10">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={PsyLinkLogo}
            alt="PsyLink Logo"
            className="w-[50px] h-[60px] top-0 object-contain"
          />
          <h1 className="text-[24px] font-bold text-white ml-2">PsyLink</h1>
        </div>
        {/* Doctor Info */}
        <div className="ml-auto text-right text-white">
          <p className="text-[16px] font-medium text-black pr-4">Date: 8th October, 2024</p>
          <p className="text-[16px] font-medium text-black pr-4">ID: ______</p>
        </div>
      </div>

      {/* Doctor Details */}
      <div className="relative mt-[200px] px-6 z-20 text-left">
        <h2 className="text-[20px] font-semibold">Dr: Fahad Tariq Aziz</h2>
        <p className="text-[20px] font-semibold">Psychiatrist</p>
      </div>

      {/* Patient Details */}
      <div className="px-6 text-right pr-20 mb-40 mt-[-60px]">
        <p className="text-[24px] font-medium">
          Patient's Name: <span className="underline">John Doe</span>
        </p>
        <p className="text-[24px] font-medium">
          Sex: <span className="underline">Male</span>
        </p>
        <p className="text-[24px] font-medium">
          Age: <span className="underline">23</span>
        </p>
      </div>

      {/* Prescription Table */}
      <div className="flex justify-between px-6 mt-6 relative">
        {/* Medicine Column */}
        <div className="flex flex-col w-1/2 pr-4">
          <h3 className="text-[22px] font-bold text-[#02968A] mb-2">
            Medicine
          </h3>
          {prescriptionData.map((item, index) => (
            <p key={index} className="text-[16px] font-medium mb-1">
              {item.medicine}
            </p>
          ))}
        </div>

        {/* Separator Line */}
        <div
          className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-[#000]"
          style={{ transform: "translateX(-50%)" }}
        ></div>

        {/* Instructions Column */}
        <div className="flex flex-col w-1/2 pl-4">
          <h3 className="text-[22px] font-bold text-[#02968A] mb-2">
            Instructions
          </h3>
          {prescriptionData.map((item, index) => (
            <p key={index} className="text-[16px] font-medium mb-1">
              {item.instructions}
            </p>
          ))}
        </div>
      </div>

      {/* Lower Left Background */}
      <img
        src={LowerLeftBackground}
        alt="Lower Left Background"
        className="absolute z-0"
        style={{
          bottom: "-50px", // Moves it lower
          left: "-50px", // Moves it further to the left
          width: "400px",
          height: "400px",
          objectFit: "contain",
        }}
      />

      {/* Footer Section */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-[12px] font-normal text-gray-500">
        <p className="text-[#02968A]">Copyright © 2024 PsyLink | All Rights Reserved</p>
      </div>
    </div>
  );
};

export default PrescriptionPage;
