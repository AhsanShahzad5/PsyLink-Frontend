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
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  };

  // Enhanced PDF Download Function with fixed styling
const downloadPDF = async () => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Convert images to base64
    let topDesignBase64: string;
    let lowerLeftBgBase64: string;
    let logoBase64: string;

    try {
      [topDesignBase64, lowerLeftBgBase64, logoBase64] = await Promise.all([
        getImageBase64(TopDesign),
        getImageBase64(LowerLeftBackground),
        getImageBase64(PsyLinkLogo)
      ]);
    } catch (error) {
      console.warn('Could not load images, proceeding without them:', error);
      topDesignBase64 = '';
      lowerLeftBgBase64 = '';
      logoBase64 = '';
    }

    // Add white background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Add top design background image
    if (topDesignBase64) {
      try {
        // Scale the top design to cover the top portion similar to the page
        const topImageHeight = 100; // Adjust based on your design
        pdf.addImage(topDesignBase64, 'PNG', 0, 0, pageWidth, topImageHeight);
      } catch (error) {
        console.warn('Could not add top design image:', error);
      }
    } else {
      // Fallback: Add a gradient-like background for the header
      pdf.setFillColor(2, 150, 138);
      pdf.rect(0, 0, pageWidth, 50, 'F');
    }

    // Header Section - Logo and Title
    if (logoBase64) {
      try {
        pdf.addImage(logoBase64, 'PNG', 15, 15, 12, 15);
      } catch (error) {
        console.warn('Could not add logo:', error);
      }
    }

    // PsyLink Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PsyLink', 32, 27);

    // Date and ID in header (top right)
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${formatDate(prescription.date)}`, pageWidth - 15, 20, { align: 'right' });
    pdf.text(`ID: ${prescription.prescriptionId}`, pageWidth - 15, 28, { align: 'right' });

    // Doctor Details (left side, below header) - Changed to WHITE
    const doctorY = 60;
    pdf.setTextColor(255, 255, 255); // Changed to white
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Dr: ${prescription.doctorName}`, 20, doctorY);
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(prescription.doctorSpecialisation, 20, doctorY + 8);

    // Patient Details (right side, fixed positioning)
    const patientY = 60;
    pdf.setTextColor(2, 150, 138); // Primary color
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');

    // Fixed patient details positioning - moved labels to the left, answers to the right
    const labelX = pageWidth - 80; // Position for labels
    const answerX = pageWidth - 30; // Position for answers (shifted right)

    // Patient Name
    pdf.text(`Patient's Name:`, labelX, patientY, { align: 'left' });
    pdf.text(prescription.patientName, answerX, patientY, { align: 'left' });
    // Add underline for patient name
    pdf.setDrawColor(2, 150, 138);
    pdf.setLineWidth(0.5);
    pdf.line(answerX, patientY + 1, answerX + pdf.getTextWidth(prescription.patientName), patientY + 1);

    // Sex
    pdf.text(`Sex:`, labelX, patientY + 8, { align: 'left' });
    pdf.text(prescription.patientGender, answerX, patientY + 8, { align: 'left' });
    // Add underline for sex
    pdf.line(answerX, patientY + 9, answerX + pdf.getTextWidth(prescription.patientGender), patientY + 9);

    // Age
    pdf.text(`Age:`, labelX, patientY + 16, { align: 'left' });
    pdf.text(prescription.patientAge, answerX, patientY + 16, { align: 'left' });
    // Add underline for age
    pdf.line(answerX, patientY + 17, answerX + pdf.getTextWidth(prescription.patientAge), patientY + 17);

    // Management Plan and Instructions Headers
    const headersY = 120;
    pdf.setTextColor(2, 150, 138);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    
    pdf.text('Management Plan', 20, headersY);
    pdf.text('Instructions', pageWidth / 2 + 10, headersY);

    // Draw separator line (vertical line between columns)
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(1);
    pdf.line(pageWidth / 2, headersY + 5, pageWidth / 2, headersY + 25 + (prescription.prescription.length * 25));

    // Add prescription items with styling similar to the page
    let yPosition = headersY + 15;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    prescription.prescription.forEach((item, index) => {
      const itemHeight = 20;
      
      // Background rectangles (like the gray boxes in the page)
      pdf.setFillColor(248, 249, 250); // Light gray background
      pdf.setDrawColor(229, 229, 229); // Gray border
      pdf.setLineWidth(0.5);
      
      // Left box (Medicine)
      pdf.rect(15, yPosition - 5, (pageWidth / 2) - 20, itemHeight, 'FD');
      // Right box (Instructions)
      pdf.rect(pageWidth / 2 + 5, yPosition - 5, (pageWidth / 2) - 20, itemHeight, 'FD');

      // Medicine text (left side)
      const medicineLines = pdf.splitTextToSize(item.medicine, (pageWidth / 2) - 30);
      pdf.setTextColor(0, 0, 0);
      pdf.text(medicineLines, 18, yPosition + 2);

      // Instructions text (right side)
      const instructionLines = pdf.splitTextToSize(item.instructions, (pageWidth / 2) - 30);
      pdf.text(instructionLines, pageWidth / 2 + 8, yPosition + 2);

      yPosition += Math.max(itemHeight, Math.max(medicineLines.length, instructionLines.length) * 5) + 5;
    });

    // Add lower left background image - ENLARGED
    if (lowerLeftBgBase64) {
      try {
        const lowerBgWidth = 90; // Increased from 60
        const lowerBgHeight = 120; // Increased from 60
        pdf.addImage(lowerLeftBgBase64, 'PNG', 0, pageHeight - lowerBgHeight, lowerBgWidth, lowerBgHeight);
      } catch (error) {
        console.warn('Could not add lower background image:', error);
      }
    }

    // Footer with styling (removed decorative circles)
    const footerY = pageHeight - 15;
    pdf.setTextColor(2, 150, 138);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Copyright © 2024 PsyLink | All Rights Reserved', pageWidth / 2, footerY, { align: 'center' });

    // Removed the decorative circles from footer

    // Save the PDF with proper filename
    pdf.save(`Prescription_${prescription.prescriptionId}_${prescription.patientName}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};


// shorter 
return (
  <div className="w-full max-w-4xl mx-auto bg-white rounded-[20px] shadow-lg overflow-hidden relative h-screen max-h-screen">
    {/* Top Design */}
    <img
      src={TopDesign}
      alt="Top Design"
      className="absolute top-0 left-0 w-full h-[200px] md:h-[250px] object-cover rounded-t-[20px] z-0"
    />

    {/* Header Section */}
    <div className="absolute top-0 left-0 w-full h-[100px] md:h-[120px] flex items-center px-4 md:px-6 z-10">
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
      <div className="ml-auto text-right">
        <p className="text-xs md:text-[16px] font-medium pr-2 md:pr-4">Date: {formatDate(prescription.date)}</p>
        <p className="text-xs md:text-[16px] font-medium pr-2 md:pr-4 mt-2">ID: {prescription.prescriptionId}</p>
      </div>
    </div>

    {/* Content Container */}
    <div className="pt-[120px] md:pt-[140px] px-4 md:px-6 pb-4 relative flex flex-col h-full">
      {/* Doctor Details */}
      <div className="text-left mb-2 md:mb-4">
        <h2 className="text-black sm:text-base sm:text-lg md:text-[20px] font-semibold">Dr: {prescription.doctorName}</h2>
        <p className="text-black sm:text-base sm:text-lg md:text-[20px] font-semibold">{prescription.doctorSpecialisation}</p>
      </div>

      {/* Patient Details */}
      <div className="text-right pr-4 md:pr-20 mb-4 md:mb-6">
        <p className="text-primary sm:text-xl md:text-[20px] font-medium">
          Patient's Name: <span className="underline">{prescription.patientName}</span>
        </p>
        <p className="text-primary sm:text-xl md:text-[20px] font-medium">
          Sex: <span className="underline">{prescription.patientGender}</span>
        </p>
        <p className="text-primary sm:text-xl md:text-[20px] font-medium">
          Age: <span className="underline">{prescription.patientAge}</span>
        </p>
      </div>

      {/* Prescription Content */}
      <div className="flex flex-col relative flex-grow min-h-0 mb-4">
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

        {/* Prescription Items - Scrollable container */}
        <div className="flex-grow overflow-y-auto pr-2">
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
      <div className="absolute bottom-16 left-0 z-0 pointer-events-none">
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
      <div className="flex flex-col sm:flex-row justify-between items-center pb-4 pt-2 relative z-20 bg-white border-t border-gray-200 mt-auto">
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
  </div>
);

// original
  // return (
  //   <div className="w-full max-w-4xl mx-auto bg-white rounded-[20px] shadow-lg overflow-hidden relative">
  //     {/* Top Design */}
  //     <img
  //       src={TopDesign}
  //       alt="Top Design"
  //       className="absolute top-0 left-0 w-full h-auto md:h-[380px] object-cover rounded-t-[20px] z-0"
  //     />

  //     {/* Header Section */}
  //     <div className="absolute top-0 left-0 w-full h-auto md:h-[180px] flex items-center px-4 md:px-6 z-10">
  //       {/* Logo */}
  //       <div className="flex items-center">
  //         <img
  //           src={PsyLinkLogo}
  //           alt="PsyLink Logo"
  //           className="w-[40px] h-[48px] md:w-[50px] md:h-[60px] object-contain"
  //         />
  //         <h1 className="text-lg md:text-[24px] font-bold text-white ml-2">PsyLink</h1>
  //       </div>
  //       {/* Prescription Info */}
  //       <div className="ml-auto text-right text-white">
  //         <p className="text-xs md:text-[16px] font-medium text-white pr-2 md:pr-4">Date: {formatDate(prescription.date)}</p>
  //         <p className="text-xs md:text-[16px] font-medium text-white pr-2 md:pr-4">ID: {prescription.prescriptionId}</p>
  //       </div>
  //     </div>

  //     {/* Content Container */}
  //     <div className="pt-[160px] sm:pt-[180px] md:pt-[200px] px-4 md:px-6 pb-16 relative">
  //       {/* Doctor Details */}
  //       <div className="text-left mb-4">
  //         <h2 className="text-black sm:text-base sm:text-lg md:text-[20px] font-semibold">Dr: {prescription.doctorName}</h2>
  //         <p className="text-black sm:text-base sm:text-lg md:text-[20px] font-semibold">{prescription.doctorSpecialisation}</p>
  //       </div>

  //       {/* Patient Details */}
  //       <div className="text-right pr-4 md:pr-20 mb-8 md:mb-16 mt-0 md:mt-[-60px]">
  //         <p className="text-primary sm:text-xl md:text-[24px] font-medium">
  //           Patient's Name: <span className="underline">{prescription.patientName}</span>
  //         </p>
  //         <p className="text-primary sm:text-xl md:text-[24px] font-medium">
  //           Sex: <span className="underline">{prescription.patientGender}</span>
  //         </p>
  //         <p className="text-primary sm:text-xl md:text-[24px] font-medium">
  //           Age: <span className="underline">{prescription.patientAge}</span>
  //         </p>
  //       </div>

  //       {/* Prescription Content */}
  //       <div className="flex flex-col relative mt-36 mb-8">
  //         {/* Headers */}
  //         <div className="flex flex-col sm:flex-row justify-between mb-4">
  //           <h3 className="text-lg md:text-[22px] font-bold text-[#02968A] w-full sm:w-1/2 pr-0 sm:pr-4 mb-2 sm:mb-0">
  //             Management Plan
  //           </h3>
  //           <h3 className="text-lg md:text-[22px] font-bold text-[#02968A] w-full sm:w-1/2 pl-0 sm:pl-4">
  //             Instructions
  //           </h3>
  //         </div>

  //         {/* Separator Line - only visible on tablet and above */}
  //         <div
  //           className="hidden sm:block absolute top-0 bottom-0 left-1/2 w-[2px] bg-[#000]"
  //           style={{ transform: "translateX(-50%)" }}
  //         ></div>

  //         {/* Prescription Items */}
  //         {prescription.prescription.map((item, index) => (
  //           <div key={index} className="flex flex-col sm:flex-row justify-between mb-4">
  //             <div className="w-full sm:w-1/2 pr-0 sm:pr-4 mb-2 sm:mb-0">
  //               <p className="p-2 bg-gray-50 rounded border border-gray-200">{item.medicine}</p>
  //             </div>
  //             <div className="w-full sm:w-1/2 pl-0 sm:pl-4">
  //               <p className="p-2 bg-gray-50 rounded border border-gray-200">{item.instructions}</p>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     {/* Lower Left Background */}
  //     <div className="absolute bottom-0 left-0 z-0 pointer-events-none">
  //       <img
  //         src={LowerLeftBackground}
  //         alt="Lower Left Background"
  //         className="w-[200px] md:w-[300px] lg:w-[300px] bottom-0"
  //         style={{
  //           maxWidth: "100%",
  //           objectFit: "contain",
  //         }}
  //       />
  //     </div>

  //     {/* Footer Section */}
  //     <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 pb-4 pt-2 relative z-20 bg-white">
  //       <p className="text-[#02968A] text-xs md:text-sm mb-4 sm:mb-0">Copyright © 2024 PsyLink | All Rights Reserved</p>
  //       <div>
  //         <button 
  //           onClick={downloadPDF}
  //           className="bg-[#02968A] text-white py-2 px-6 rounded-lg hover:bg-[#016d63] transition-colors duration-200 text-sm md:text-base flex items-center gap-2"
  //         >
  //           <svg 
  //             className="w-4 h-4" 
  //             fill="none" 
  //             stroke="currentColor" 
  //             viewBox="0 0 24 24"
  //           >
  //             <path 
  //               strokeLinecap="round" 
  //               strokeLinejoin="round" 
  //               strokeWidth={2} 
  //               d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
  //             />
  //           </svg>
  //           Download PDF
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default PrescriptionPage;