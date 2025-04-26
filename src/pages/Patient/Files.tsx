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

export default function Files() {
  // Static files data for other file types
  const staticFiles = [
    {
      id: 2,
      type: "Mood Report",
      title: "Monthly Mood Analysis - September 2024",
      author: "System Generated",
      dateUploaded: "4th September, 2024",
      tags: ["Mental Health", "Mood"],
      actions: ["View", "Download", "Add Notes"],
    },
    {
      id: 3,
      type: "Mood Report",
      title: "Weekly Mood Tracker - Week 1",
      author: "System Generated",
      dateUploaded: "1st September, 2024",
      tags: ["Mental Health", "Weekly Tracker"],
      actions: ["View"],
    },
  ];

  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);
  const patientId = user?._id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  
  // States for prescription data
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Combined files (prescriptions + static files)
  const [allFiles, setAllFiles] = useState<any[]>([]);

  // Fetch prescriptions when component mounts
  useEffect(() => {
    if (!patientId) {
      setError("User ID not found");
      setLoading(false);
      return;
    }
    
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/patient/prescription/${patientId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setPrescriptions(data.data);
          
          // Convert prescriptions to file format and combine with static files
          const prescriptionFiles = data.data.map((prescription: Prescription, index: number) => ({
            id: `p-${prescription._id}`,
            type: "Prescription",
            title: `Prescription - ${formatDate(prescription.date)}`,
            author: prescription.doctorName,
            dateUploaded: formatDate(prescription.createdAt),
            tags: ["Medication", "Health"],
            actions: ["View", "Download"],
            prescriptionData: prescription // Store the full prescription data
          }));
          
          setAllFiles([...prescriptionFiles, ...staticFiles]);
        } else {
          setError(data.message || "Failed to fetch prescriptions");
          setAllFiles([...staticFiles]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching prescriptions:", err);
        setAllFiles([...staticFiles]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescriptions();
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
      setShowReport(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowReport(false);
    setSelectedFile(null);
    setSelectedPrescription(null);
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
      {showReport && (
        <GenerateReport
          medicines={''}
          moodData={[]}
          setShowReport={setShowReport}
        />
      )}
    </div>
  );
}