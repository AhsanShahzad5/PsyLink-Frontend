import React from 'react';
import jsPDF from 'jspdf';
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

const PrescriptionPage: React.FC<PrescriptionProps> = ({ prescription }) => {
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

  // Function to convert image to base64
  const getImageBase64 = (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  };

  // PDF Download Function
  const downloadPDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add background gradient/color
      pdf.setFillColor(248, 250, 252); // Light blue-gray background
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Header Section with colored background
      pdf.setFillColor(2, 150, 138); // Teal color
      pdf.rect(0, 0, pageWidth, 50, 'F');

      // Add PsyLink Logo and Title (you may need to convert logo to base64)
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PsyLink', 20, 25);

      // Add Date and ID in header
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${formatDate(prescription.date)}`, pageWidth - 80, 20);
      pdf.text(`ID: ${prescription.prescriptionId}`, pageWidth - 80, 30);

      // Doctor Details
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Dr: ${prescription.doctorName}`, 20, 70);
      pdf.setFont('helvetica', 'normal');
      pdf.text(prescription.doctorSpecialisation, 20, 80);

      // Patient Details
      pdf.setTextColor(2, 150, 138);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Patient's Name: ${prescription.patientName}`, pageWidth - 100, 70);
      pdf.text(`Sex: ${prescription.patientGender}`, pageWidth - 100, 80);
      pdf.text(`Age: ${prescription.patientAge}`, pageWidth - 100, 90);

      // Management Plan Headers
      pdf.setTextColor(2, 150, 138);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Management Plan', 20, 120);
      pdf.text('Instructions', pageWidth / 2 + 10, 120);

      // Draw separator line
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(pageWidth / 2, 110, pageWidth / 2, 120 + (prescription.prescription.length * 25));

      // Add prescription items
      let yPosition = 140;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');

      prescription.prescription.forEach((item, index) => {
        // Medicine (left side)
        const medicineLines = pdf.splitTextToSize(item.medicine, (pageWidth / 2) - 30);
        pdf.text(medicineLines, 20, yPosition);

        // Instructions (right side)
        const instructionLines = pdf.splitTextToSize(item.instructions, (pageWidth / 2) - 30);
        pdf.text(instructionLines, pageWidth / 2 + 10, yPosition);

        // Add background rectangles for better readability
        pdf.setFillColor(245, 245, 245);
        pdf.rect(15, yPosition - 8, (pageWidth / 2) - 25, Math.max(medicineLines.length, instructionLines.length) * 5 + 6, 'F');
        pdf.rect(pageWidth / 2 + 5, yPosition - 8, (pageWidth / 2) - 25, Math.max(medicineLines.length, instructionLines.length) * 5 + 6, 'F');

        // Re-add text over rectangles
        pdf.setTextColor(0, 0, 0);
        pdf.text(medicineLines, 20, yPosition);
        pdf.text(instructionLines, pageWidth / 2 + 10, yPosition);

        yPosition += Math.max(medicineLines.length, instructionLines.length) * 5 + 15;
      });

      // Footer
      pdf.setTextColor(2, 150, 138);
      pdf.setFontSize(10);
      pdf.text('Copyright © 2024 PsyLink | All Rights Reserved', pageWidth / 2, pageHeight - 20, { align: 'center' });

      // Add decorative elements
      pdf.setFillColor(2, 150, 138);
      pdf.circle(15, pageHeight - 30, 8, 'F');
      pdf.circle(pageWidth - 15, pageHeight - 30, 8, 'F');

      // Save the PDF
      pdf.save(`Prescription_${prescription.prescriptionId}_${prescription.patientName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-[20px] shadow-lg overflow-hidden relative">
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
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 pb-4 pt-2 relative z-20 bg-white">
        <p className="text-[#02968A] text-xs md:text-sm mb-4 sm:mb-0">Copyright © 2024 PsyLink | All Rights Reserved</p>
        <div>
          <button 
            onClick={downloadPDF}
            className="bg-[#02968A] text-white py-2 px-6 rounded-lg hover:bg-[#016d63] transition-colors duration-200 text-sm md:text-base flex items-center gap-2"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;