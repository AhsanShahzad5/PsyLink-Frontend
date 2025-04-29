import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { useLocation } from 'react-router-dom';

interface MoodEntry {
  date: string;
  feeling: string;
}

interface GenerateReportProps {
  NotfilesPage:boolean;
  medicines: string;
  moodData: MoodEntry[];
  patientName: string;
  patientGender: string;
  patientAge: number;
  setShowReport: (show: boolean) => void;
  summary: {
    totalDays: number;
    daysWithMoodLogged: number;
  };
}

interface SaveReportResponse {
  success: boolean;
  message: string;
  data?: {
    reportId: string;
    generatedAt: string;
  };
  error?: string;
}

export default function GenerateReport({ medicines, moodData, setShowReport, summary, patientName ,  patientGender,
  patientAge , NotfilesPage }: GenerateReportProps) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const location = useLocation();

  // This returns something like "/patient/files"
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    
    // Add report title and basic info
    doc.setFontSize(18);
    doc.text('Progress Report', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Name: ${patientName}`, 20, 30);
    doc.text(`Sex: ${patientGender}`, 20, 40);
    doc.text(`Age: ${patientAge}`, 20, 50);
    doc.text(`Days Mood Logged: ${summary.daysWithMoodLogged}/${summary.totalDays}`, 20, 60);
    doc.text(`Prescribed Medicines: ${medicines || 'None'}`, 20, 70);
    
    // Add percentage info
    doc.text(`Mood Average: ${moodAvgPercentage}%`, 20, 80);
    doc.text(`Status: ${moodAvgPercentage >= 70 ? 'Good Progress' : 
             moodAvgPercentage >= 40 ? 'Average Progress' : 'Needs Improvement'}`, 20, 90);
    
    // Draw percentage circle
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(3);
    doc.circle(150, 60, 15); // Circle at x=150, y=60 with radius 15
    doc.text(`${moodAvgPercentage}%`, 150, 60, { align: 'center' });
    
    // Add mood data table
    if (moodData.length > 0) {
      // Table header
      doc.setFillColor(2, 150, 138); // #02968A
      doc.setTextColor(255, 255, 255); // white
      doc.rect(20, 100, 80, 10, 'F');
      doc.rect(100, 100, 80, 10, 'F');
      doc.text('Date', 60, 107, { align: 'center' });
      doc.text('Feeling', 140, 107, { align: 'center' });
      
      // Table rows
      doc.setTextColor(0, 0, 0); // black
      doc.setFillColor(255, 255, 255); // white
      
      let yPos = 110;
      moodData.forEach((entry, index) => {
        // Add a new page if we're running out of space
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        // Draw row background
        doc.setFillColor(index % 2 === 0 ? 245 : 255, 245, 245);
        doc.rect(20, yPos, 160, 10, 'F');
        
        // Draw cell borders
        doc.setDrawColor(200, 200, 200);
        doc.rect(20, yPos, 80, 10);
        doc.rect(100, yPos, 80, 10);
        
        // Add text
        doc.text(entry.date, 60, yPos + 7, { align: 'center' });
        doc.text(entry.feeling, 140, yPos + 7, { align: 'center' });
        
        yPos += 10;
      });
    } else {
      doc.text('No mood data logged yet', 105, 110, { align: 'center' });
    }
    
    // Generate the PDF and save it
    doc.save('Progress_Report.pdf');
  };

  const handleSaveReport = async () => {
    // Reset states
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      // Calculate mood statistics
      const reportData = {
        medicines,
        moodData,
        summary,
        daysGoingWell,
        daysGoingBad,
        daysWithNoMood,
        moodAvgPercentage
      };
      
      // Make API call to save the report
      const response = await fetch('http://localhost:8000/api/patient/createMoodProgressReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
},
        credentials : "include",
        body: JSON.stringify(reportData)
      });
      
      const result: SaveReportResponse = await response.json();
      
      if (result.success) {
        console.log("Report saved successfully:", result.data);
        setSaveSuccess(true);
      } else {
        console.error("Failed to save report:", result.message);
        setSaveError(result.message);
      }
    } catch (error: any) {
      console.error("Error saving report:", error);
      setSaveError(error.message || 'An error occurred while saving the report');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate good days based on your mood categories
  const daysGoingWell = moodData.filter(item => 
    ["neutral", "happy", "joyful"].includes(item.feeling.toLowerCase())
  ).length;
  
  // Filter entries with no mood logged
  const daysWithNoMood = moodData.filter(item => 
    item.feeling === "-" || !item.feeling
  ).length;
  
  // Calculate bad days based on your mood categories
  const daysGoingBad = moodData.filter(item => 
    ["depressed", "sad"].includes(item.feeling.toLowerCase())
  ).length;

  // Calculate mood average percentage (only considering days with mood logged)
  const daysWithMoodLogged = moodData.length - daysWithNoMood;
  const moodAvgPercentage = daysWithMoodLogged > 0 
    ? Math.round((daysGoingWell / daysWithMoodLogged) * 100) 
    : 0;

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
            <p><strong>Name:</strong> {patientName}</p>
            <p><strong>Sex:</strong> {patientGender}</p>
            <p><strong>Age:</strong> {patientAge}</p>
            <p><strong>Days Mood Logged:</strong> {summary.daysWithMoodLogged}/{summary.totalDays}</p>
            <p><strong>Prescribed Medicines:</strong> {medicines || 'None'}</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 rounded-full border-8 border-gray-300 flex items-center justify-center">
              <p className="text-xl font-semibold">{moodAvgPercentage}% Avg</p>
            </div>
            <p className="mt-2 bg-[#02968A] text-white px-4 py-1 rounded-lg">
              {moodAvgPercentage >= 70 ? 'Good Progress' : 
               moodAvgPercentage >= 40 ? 'Average Progress' : 'Needs Improvement'}
            </p>
          </div>
        </div>

        {moodData.length > 0 ? (
          <table className="w-full border border-black text-left text-sm md:text-lg">
            <thead className="bg-[#02968A] text-white">
              <tr>
                <th className="p-2 md:p-4">Date</th>
                <th className="p-2 md:p-4">Feeling</th>
              </tr>
            </thead>
            <tbody>
              {moodData.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 md:p-4">{entry.date}</td>
                  <td className="p-2 md:p-4">{entry.feeling}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">No mood data logged yet</p>
          </div>
        )}
        
        {saveSuccess && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-md">
            Report saved successfully!
          </div>
        )}
        
        {saveError && (
          <div className="mt-4 p-2 bg-red-100 text-red-800 rounded-md">
            Error: {saveError}
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={handleDownloadReport}
            className="bg-[#02968A] text-white text-lg font-semibold rounded-lg px-6 py-2"
          >
            Download Report
          </button>
          
          {!NotfilesPage && (
        <button
          onClick={handleSaveReport}
          disabled={isSaving}
          className={`bg-[#02968A] text-white text-lg font-semibold rounded-lg px-6 py-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSaving ? 'Saving...' : 'Save Report'}
        </button>
      )}
        </div>
      </div>
    </div>
  );
}