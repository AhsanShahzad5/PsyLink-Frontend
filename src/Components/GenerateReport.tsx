import React, { useState } from 'react'
import jsPDF from 'jspdf';

interface MoodEntry {
    date: string;
    feeling: string;
    courseEnrolled: string;
    sessionDay: string;
  }
  
  interface GenerateReportProps {
    medicines: string;
    moodData: MoodEntry[];
    setShowReport: (show: boolean) => void;
  }


 


export default function GenerateReport({medicines, moodData, setShowReport}: GenerateReportProps) {

    const handleDownloadReport = () => {
        const doc = new jsPDF();
        doc.text('Progress Report', 10, 10);
        doc.text(`Name: John Doe`, 10, 20);
        doc.text(`Sex: Male`, 10, 30);
        doc.text(`Age: 23`, 10, 40);
        doc.text(`Days Mood Logged: 28/30`, 10, 50);
        doc.text(`Programs Enrolled: Breathing Exercise, Mental Imagining, Yoga Wellness`, 10, 60);
        doc.text(`Prescribed Medicines: ${medicines || 'None'}`, 10, 70);
    
        // Generate the PDF and save it
        doc.save('Progress_Report.pdf');
      };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white w-full max-w-4xl h-[700px] p-6 border border-gray-300 rounded-lg shadow-lg z-50 overflow-y-auto">
    <button
                onClick={() => setShowReport(false)}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold flex items-end"
              >
                
               X
              </button>
      <h2 className="text-2xl font-semibold mb-4">Progress Report</h2>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div>
            
          <p><strong>Name:</strong> Jhon Doe</p>
          <p><strong>Sex:</strong> Male</p>
          <p><strong>Age:</strong> 23</p>
          <p><strong>Days Mood Logged:</strong> 28/30</p>
          <p><strong>Programs Enrolled:</strong></p>
          <ul className="list-disc list-inside">
            <li>Breathing Exercise</li>
            <li>Mental Imagining</li>
            <li>Yoga Wellness</li>
          </ul>
          <p><strong>Prescribed Medicines:</strong> {medicines || 'None'}</p>
        </div>
        <div className="text-center">
          <div className="w-32 h-32 rounded-full border-8 border-gray-300 flex items-center justify-center">
            <p className="text-xl font-semibold">70% Avg</p>
          </div>
          <p className="mt-2 bg-[#02968A] text-white px-4 py-1 rounded-lg">Good Progress</p>
        </div>
      </div>

      <table className="w-full border border-black text-left text-sm md:text-lg">
        <thead className="bg-[#02968A] text-white">
          <tr>
            <th className="p-2 md:p-4">Date</th>
            <th className="p-2 md:p-4">Feeling</th>
            <th className="p-2 md:p-4">Course Enrolled</th>
            <th className="p-2 md:p-4">Session Day</th>
          </tr>
        </thead>
        <tbody>
          {moodData.map((entry, index) => (
            <tr key={index} className="border-b">
              <td className="p-2 md:p-4">{entry.date}</td>
              <td className="p-2 md:p-4">{entry.feeling}</td>
              <td className="p-2 md:p-4">{entry.courseEnrolled}</td>
              <td className="p-2 md:p-4">{entry.sessionDay}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button
                onClick={handleDownloadReport}
                className="mt-4 bg-[#02968A] text-white text-lg font-semibold rounded-lg px-6 py-2"
              >
                Download Report
              </button>
    </div>
  </div>
  )
}
