import React, { useState, useEffect } from 'react'
import { ArrowLeft, Search, Clock, ArrowRight } from 'lucide-react'
import ActiveTab from '../../Components/patient/ActiveTab';
import MoodTrackerPage from './MoodProgress';
import PreviousPrograms from './PreviousPrograms';
import PrescriptionPage from '@/Components/patient/PrescriptionPopUpProps.tsx';
import SearchByNameAndLoc from '@/Components/patient/SearchByNameAndLoc';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '@/atoms/userAtom';

// Updated interface based on actual API response
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

interface Course {
  id: number;
  courseName: string;
  status: string;
  tasksDone: string;
}

const courses = [
  {
    id: 1,
    courseName: "Breathing Exercise",
    status: "Ongoing",
    tasksDone: "7/10",
  },
  {
    id: 2,
    courseName: "Breathing Exercise",
    status: "Completed",
    tasksDone: "7/10",
  },
  {
    id: 3,
    courseName: "Mental Imagining",
    status: "Completed",
    tasksDone: "8/10",
  },
  {
    id: 4,
    courseName: "Yoga Wellness",
    status: "Ongoing",
    tasksDone: "5/10",
  },
  {
    id: 5,
    courseName: "Meditation Basics",
    status: "Completed",
    tasksDone: "10/10",
  },
];

export default function Prescription(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'Prescriptions' | 'Mood Progress' | 'Previous Programs'>('Prescriptions');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const user = useRecoilValue(userAtom);
  const patientId = user?._id;
  
  const navigate = useNavigate();
  const tabs = ['Prescriptions', 'Mood Progress', 'Previous Programs'];

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
        } else {
          setError(data.message || "Failed to fetch prescriptions");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching prescriptions:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescriptions();
  }, [patientId]);

  const handleViewClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

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

  // Format time from date string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
   <>
      {/* Main Content */}
   <div className="bg-[#fffff] min-h-screen w-full flex justify-center mt-40 ">
       <div className="w-full max-w-screen-xl p-4 bg-[#fff] mt-1">
     
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
       History
     </button>
   </div>

       <ActiveTab
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={(tab) => setActiveTab(tab as 'Prescriptions' | 'Mood Progress' | 'Previous Programs')}
      />

        {activeTab === 'Prescriptions' && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            
            {/* Search Section */}
            <SearchByNameAndLoc />

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : prescriptions.length === 0 ? (
              <div className="text-center p-4">No prescriptions found.</div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex items-center mb-4 sm:mb-0">
                      {/* <img
                        src={'/src/assets/prescription/doctor.png'}
                        alt={prescription.doctorName}
                        className="w-12 h-12 rounded-full mr-4"
                      /> */}
                      <div>
                        <h3 className="font-bold">{prescription.doctorName}</h3>
                        <p className="text-gray-600 text-left">Doctor</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center">
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-1" />
                        {formatTime(prescription.createdAt)}
                      </div>
                      <div className="text-gray-600 px-20">{formatDate(prescription.date)}</div>
                    </div>
                    
                    <div> 
                      <button 
                        className="bg-teal-600 text-white px-12 py-2 hover:bg-teal-700 transition-colors flex items-center rounded-[6px]"
                        onClick={() => handleViewClick(prescription)}
                      >
                        View
                        <ArrowRight size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

        {activeTab === 'Mood Progress' && (
          <MoodTrackerPage/>
        )}

        {activeTab === 'Previous Programs' && (
          <PreviousPrograms/>
        )}
      </div>
    </div>
    </>
    )
}