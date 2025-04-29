import React, { useState } from "react";
import TopDesign from "./../../assets/patient/Prescription/TopDesign.png";
import LowerLeftBackground from "./../../assets/patient/Prescription/LowerLeftBackground.png";
import PsyLinkLogo from "./../../assets/patient/Prescription/PsylinkLogo.png";

// Define the interface for prescription items
interface PrescriptionItem {
  medicine: string;
  instructions: string;
}

interface PrescriptionPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  doctorSpeciality: string;
  patientName: string;
  patientGender: string;
  patientAge: string;
  date: string;
  appointmentId: string | undefined;
  doctorId: string; // Added doctorId
  patientId: string; // Added patientId
}

const PrescriptionPopUp: React.FC<PrescriptionPopUpProps> = ({
  isOpen,
  onClose,
  doctorName,
  doctorSpeciality,
  doctorId,
  patientId,
  patientName,
  patientGender,
  patientAge,
  date,
  appointmentId,
}) => {
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([
    { medicine: "", instructions: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to add more medicine and instruction fields
  const addPrescriptionItem = () => {
    setPrescriptionItems([...prescriptionItems, { medicine: "", instructions: "" }]);
  };

  // Function to update medicine or instruction for a specific item
  const updatePrescriptionItem = (index: number, field: "medicine" | "instructions", value: string) => {
    const updatedItems = [...prescriptionItems];
    updatedItems[index][field] = value;
    setPrescriptionItems(updatedItems);
  };

  // Function to remove a prescription item
  const removePrescriptionItem = (index: number) => {
    if (prescriptionItems.length > 1) {
      const updatedItems = prescriptionItems.filter((_, i) => i !== index);
      setPrescriptionItems(updatedItems);
    }
  };

  // Handle save prescription
  const handleSavePrescription = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Filter out empty items
      const validItems = prescriptionItems.filter(
        item => item.medicine.trim() !== "" && item.instructions.trim() !== ""
      );
      
      if (validItems.length === 0) {
        setError("Please add at least one medicine with instructions");
        setIsSubmitting(false);
        return;
      }

      // Create the prescription data object
      const prescriptionData = {
        doctorName,
        doctorId,
        patientId,
        patientName,
        patientGender,
        patientAge,
        date,
        appointmentId,
        prescription: validItems
      };

      // Make the API call to save the prescription
      const response = await fetch('/api/doctor/prescription/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescriptionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save prescription');
      }

      // Show success message or notification
      alert('Prescription saved successfully!');
      
      // Close the modal
      onClose();
    } catch (err) {
      console.error('Error saving prescription:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[20px] shadow-lg overflow-y-auto overflow-x-hidden">
        {/* Top Design */}
        <img
          src={TopDesign}
          alt="Top Design"
          className="absolute top-0 left-0 w-full h-auto md:h-[380px] object-cover rounded-t-[20px] z-0"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-white rounded-full p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

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
          {/* Doctor Info */}
          <div className="ml-auto mb-5 text-right text-white">
            <p className="text-xs md:text-[16px] font-medium text-white pr-2 md:pr-4">Date: {date}</p>
            <p className="text-xs md:text-[16px] font-medium text-white pr-2 md:pr-4">ID: {appointmentId}</p>
          </div>
        </div>

        {/* Content Container with padding for all screen sizes */}
        <div className="pt-[160px] sm:pt-[180px] md:pt-[200px] px-4 md:px-6 pb-16 relative">
          {/* Doctor Details */}
          <div className="text-left mb-4">
            <h2 className="text-black sm:text-base sm:text-lg md:text-[20px] font-semibold">Dr: {doctorName}</h2>
            <p className="text-black sm:text-base  sm:text-lg md:text-[20px] font-semibold">{doctorSpeciality}</p>
          </div>

          {/* Patient Details */}
          <div className="text-right pr-4 md:pr-20 mb-8 md:mb-28 mt-0 md:mt-[-75px]">
            <p className="text-primary sm:text-xl md:text-[20px] font-medium">
              Patient's Name: <span className="underline">{patientName}</span>
            </p>
            <p className="text-primary  sm:text-xl md:text-[20px] font-medium">
              Sex: <span className="underline">{patientGender}</span>
            </p>
            <p className="text-primary sm:text-xl md:text-[20px] font-medium">
              Age: <span className="underline">{patientAge}</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          {/* Prescription Content */}
          <div className="flex flex-col relative mb-8">
            {/* Headers */}
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <h3 className="text-lg md:text-[22px] font-bold text-[#02968A] w-full sm:w-1/2 pr-0 sm:pr-4 mb-2 sm:mb-0">
                Medicine
              </h3>
              <h3 className="text-lg md:text-[22px] font-bold text-[#02968A] w-full sm:w-1/2 pl-0 sm:pl-4">
                Instructions
              </h3>
            </div>

            {/* Separator Line - only visible on tablet and above */}
            <div
              className="hidden sm:block absolute top-0 bottom-14 left-1/2 w-[2px] bg-[#000]"
              style={{ transform: "translateX(-50%)" }}
            ></div>

            {/* Prescription Items */}
            {prescriptionItems.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row justify-between mb-4">
                <div className="flex w-full sm:w-1/2 pr-0 sm:pr-4 mb-2 sm:mb-0">
                  <input
                    type="text"
                    value={item.medicine}
                    onChange={(e) => updatePrescriptionItem(index, "medicine", e.target.value)}
                    placeholder="Enter medicine name"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {prescriptionItems.length > 1 && (
                    <button
                      onClick={() => removePrescriptionItem(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex w-full sm:w-1/2 pl-0 sm:pl-4">
                  <input
                    type="text"
                    value={item.instructions}
                    onChange={(e) => updatePrescriptionItem(index, "instructions", e.target.value)}
                    placeholder="Enter instructions"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}

            {/* Add More Button with additional margin-top */}
            <div className="flex justify-center mt-8">
              <button
                onClick={addPrescriptionItem}
                className="bg-[#02968A] text-white py-2 px-4 mt-4 rounded-lg hover:bg-[#016d63]"
              >
                + Add More
              </button>
            </div>
          </div>
        </div>

        {/* Lower Left Background - z-index adjusted and positioned to not interfere with content */}
        <div className="absolute bottom-0 left-0 z-0 pointer-events-none">
          <img
            src={LowerLeftBackground}
            alt="Lower Left Background"
            className=" w-[200px] md:w-[300px] lg:w-[300px] bottom-0 "
            style={{
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Footer Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 pb-4 pt-2 relative z-20 bg-white">
          <p className="text-[#02968A] text-xs md:text-sm mb-4 sm:mb-0">Copyright © 2024 PsyLink | All Rights Reserved</p>
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={onClose}
              className="py-1 md:py-2 px-3 md:px-6 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm md:text-black"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSavePrescription}
              className="bg-[#02968A] text-white py-1 md:py-2 px-3 md:px-6 rounded-lg hover:bg-[#016d63] text-sm md:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Prescription'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPopUp;