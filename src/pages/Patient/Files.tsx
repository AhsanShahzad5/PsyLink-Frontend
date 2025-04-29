import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GenerateReport from '@/Components/patient/GenerateReport';
import PrescriptionPage from '@/Components/patient/PrescriptionPopUpProps';
import { useRecoilValue } from 'recoil';
import userAtom from '@/atoms/userAtom';

// Updated interface for prescriptions
interface PrescriptionItem {
  medicine: string;
  instructions: string;
  _id: string;
}

interface Prescription {
  _id: string;
  prescriptionId: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  patientGender: string;
  patientAge: string;
  date: string;
  prescription: PrescriptionItem[];
  createdAt: string;
  updatedAt: string;
}

// Interface for Mood Report
interface MoodEntry {
  date: string;
  feeling: string;
  _id: string;
}

interface MoodReport {
  _id: string;
  userId: string;
  patientName: string;
  patientSex: string;
  patientAge: number;
  daysWithMoodLogged: number;
  totalDays: number;
  prescribedMedicines: string;
  moodAvgPercentage: number;
  progressStatus: string;
  moodData: MoodEntry[];
  daysGoingWell: number;
  daysGoingBad: number;
  daysWithNoMood: number;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ReportsResponse {
  success: boolean;
  message: string;
  data: MoodReport[];
  error?: string;
}

export default function Files() {
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);
  const patientId = user?._id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedReport, setSelectedReport] = useState<MoodReport | null>(null);
  const [patientData, setpatientData] = useState<any>();

  // States for data
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reports, setReports] = useState<MoodReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Combined files (prescriptions + reports)
  const [allFiles, setAllFiles] = useState<any[]>([]);

  // Fetch prescriptions and reports when component mounts
  useEffect(() => {
    if (!patientId) {
      setError("User ID not found");
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch prescriptions
        const prescriptionResponse = await fetch(`/api/patient/prescription/${patientId}`);
        
        if (!prescriptionResponse.ok) {
          throw new Error(`HTTP error! status: ${prescriptionResponse.status}`);
        }
        
        const prescriptionData = await prescriptionResponse.json();
        
        // Fetch mood reports
        const reportsResponse = await fetch('http://localhost:8000/api/patient/getPatientReports', {
         method: 'GET',
         
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Important for sending cookies with the request
        });
        
        if (!reportsResponse.ok) {
          throw new Error(`HTTP error! status: ${reportsResponse.status}`);
        }
        
        const reportsData: ReportsResponse = await reportsResponse.json();
        setpatientData(reportsData);
        // Process prescriptions
        let prescriptionFiles: any[] = [];
        if (prescriptionData.success) {
          setPrescriptions(prescriptionData.data);
          
          // Convert prescriptions to file format
          prescriptionFiles = prescriptionData.data.map((prescription: Prescription, index: number) => ({
            id: `p-${prescription._id}`,
            type: "Prescription",
            title: `Prescription - ${formatDate(prescription.date)}`,
            author: prescription.doctorName,
            dateUploaded: formatDate(prescription.createdAt),
            tags: ["Medication", "Health"],
            actions: ["View", "Download"],
            prescriptionData: prescription // Store the full prescription data
          }));
        }
        
        // Process reports
        let reportFiles: any[] = [];
        if (reportsData.success) {
          setReports(reportsData.data);
          
          // Convert reports to file format
          reportFiles = reportsData.data.map((report: MoodReport) => ({
            id: `r-${report._id}`,
            type: "Mood Report",
            title: `Progress Report`,
            author: "System Generated",
            dateUploaded: formatDate(report.createdAt),
            tags: ["Mental Health", "Mood"],
            actions: ["View", "Download"],
            reportData: report // Store the full report data
          }));
        }
        
        // Combine all files and sort by date (newest first)
        const combined = [...prescriptionFiles, ...reportFiles].sort((a, b) => {
          return new Date(b.reportData?.createdAt || b.prescriptionData?.createdAt).getTime() - 
                 new Date(a.reportData?.createdAt || a.prescriptionData?.createdAt).getTime();
        });
        
        setAllFiles(combined);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [patientId]);

  // Format date from ISO to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleViewFile = (file: any) => {
    setSelectedFile(file);
    if (file.type === "Prescription") {
      setSelectedPrescription(file.prescriptionData);
      setIsModalOpen(true);
    } else if (file.type === "Mood Report") {
      setSelectedReport(file.reportData);
      setShowReport(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowReport(false);
    setSelectedFile(null);
    setSelectedPrescription(null);
    setSelectedReport(null);
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 py-4 md:py-8 mt-24 min-h-[600px] bg-[#fff] mx-10 rounded-xl">
      {/* Back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-xl font-medium text-[#02968A] transition-transform transform hover:scale-110"
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
          Files
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : allFiles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No files found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allFiles.map((file) => (
            <div
              key={file.id}
              className="flex flex-col sm:flex-row items-start sm:items-center rounded-xl bg-white p-4 shadow-md border border-gray-200 space-y-4 sm:space-y-0 sm:space-x-4"
            >
              {/* File Type */}
              <div className="flex-1 text-left font-semibold text-gray-800 w-full sm:w-auto">
                {file.type}
              </div>

              {/* Title */}
              <div className="flex-1 text-left font-medium text-gray-800 w-full sm:w-auto">
                {file.title}
              </div>

              {/* Author */}
              <div className="flex-1 text-left sm:text-center text-gray-600 w-full sm:w-auto">
                {file.author}
              </div>

              {/* Date */}
              <div className="flex-1 text-left sm:text-center text-teal-600 font-semibold w-full sm:w-auto">
                {file.dateUploaded}
              </div>

              {/* View Button */}
              <div className="flex justify-start sm:justify-end w-full sm:w-auto">
                <button 
                  className="bg-teal-600 text-white px-4 py-2 hover:bg-teal-700 transition-colors flex items-center rounded-md"
                  onClick={() => handleViewFile(file)}
                >
                  View
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Prescription */}
      {isModalOpen && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
          <div className="relative bg-transparent rounded-lg p-6 w-full max-w-[1000px] max-h-[500px] sm:w-[95%] sm:max-h-screen sm:overflow-y-scroll sm:[&::-webkit-scrollbar]:hidden sm:scrollbar-hide">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-4 text-black hover:text-black text-2xl z-50 transition-transform transform hover:scale-125"
            >
              ✖
            </button>
            <PrescriptionPage prescription={selectedPrescription} />
          </div>
        </div>
      )}

      {/* Modal for Mood Report */}
      {showReport && selectedReport && (
        <GenerateReport
        NotfilesPage={true}
        patientName={patientData.patientName}
        patientAge={patientData.patientAge}
        patientGender={patientData.patientGender}
          medicines={selectedReport.prescribedMedicines || ''}
          moodData={selectedReport.moodData || []}
          setShowReport={setShowReport}
          summary={{
            totalDays: selectedReport.totalDays || 0,
            daysWithMoodLogged: selectedReport.daysWithMoodLogged || 0
          
          }}
        />
      )}
    </div>
  );
}