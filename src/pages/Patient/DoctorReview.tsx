import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, Calendar, Clock, FileText, Award, ThumbsUp, FileX, Pill } from 'lucide-react';
import PrescriptionDebugModal from './PrescriptionDebugModal'; // Import the updated component

interface HistoryAppointment {
  id: number | string;
  appointmentId: string;
  doctorName: string;
  specialization: string;
  appointmentTime: string;
  date: string;
  rating?: number;
  review?: string;
  imageUrl: string;
  recommendation?: string;
}

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
  doctorSpecialisation: string;
  patientId: string;
  patientName: string;
  patientGender: string;
  patientAge: string;
  date: string;
  prescription: PrescriptionItem[];
  createdAt: string;
  updatedAt: string;
}

const DoctorReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  // Get the appointment data from location state
  // If no data is passed, use default values
  const appointmentData = location.state?.appointmentData as HistoryAppointment || {
    id: "",
    appointmentId: "APT-20241024-001",
    doctorName: "Dr. Fahad Tariq Aziz",
    specialization: "Psychologist",
    appointmentTime: "1:00 pm - 2:00 pm",
    date: "2024-10-24",
    rating: 4.5,
    review: "The doctor was really patient and Dr Fahad was calming me a lot during the session. It really helped out clearing my thoughts. It's all thanks to Dr Fahad that I'm now capable of working my 24/7 job sanely. Thank you Dr Fahad, I can never truly repay you all my life.",
    imageUrl: "/src/assets/patient/doctor/doctor.png",
    recommendation: "Breathing Course"
  };

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!appointmentData.appointmentId) return;
      console.log("this is appointmentId in the page: ", appointmentData.appointmentId)
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:8000/api/patient/prescription-appointment/${appointmentData.appointmentId}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          // Not throwing error for 404 as it's an expected case (no prescription)
          if (response.status === 404) {
            setPrescription(null);
            setIsLoading(false);
            return;
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("if its success or not :" , data.success)
        if (data.success) {
          // Log the data structure to help with debugging
          console.log("Prescription data received:", data.data);
          
          // Ensure the prescription field exists and is properly structured
          const prescriptionData = {
            ...data.data,
            prescription: Array.isArray(data.data.prescription) ? data.data.prescription : []
          };
          
          setPrescription(prescriptionData);
        } else {
          setError(data.message || 'Failed to fetch prescription');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Failed to fetch prescription:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrescription();
  }, [appointmentData.appointmentId]);
  
  // Format the date to be more readable
  const formattedDate = new Date(appointmentData.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Generate stars based on rating
  const renderRatingStars = () => {
    const rating = appointmentData.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars: React.ReactNode[] = [];
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          className="text-yellow-400 fill-yellow-400" 
          size={24}
        />
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="text-gray-300 fill-gray-300" size={24} />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star className="text-yellow-400 fill-yellow-400" size={24} />
          </div>
        </div>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className="text-gray-300 fill-gray-300" 
          size={24}
        />
      );
    }
    
    return stars;
  };

  // Modal backdrop and close handling
  const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ 
    isOpen, 
    onClose, 
    children 
  }) => {
    if (!isOpen) return null;
    
    // Handle background click to close the modal
    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
    
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-auto"
        onClick={handleBackdropClick}
      >
        <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-4xl">
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              onClose();
            }}
            className="absolute top-4 right-4 z-50 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors shadow-md"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center mt-20 min-h-screen bg-secondary p-4 pt-6">
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10 w-full max-w-5xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-lg font-medium text-[#02968A] hover:text-teal-800 transition-all hover:translate-x-[-4px] mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Appointments
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Appointment Details</h1>
          <p className="text-gray-600">Review your completed session</p>
        </div>

        {/* Content Card with subtle gradient border */}
        <div className="border border-gray-200 rounded-xl p-1 bg-gradient-to-br from-teal-100 via-white to-blue-50">
          <div className="bg-white rounded-lg p-6">
            {/* Doctor details */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Doctor Image */}
              <div className="md:w-1/3">
                <div className="rounded-lg shadow-md overflow-hidden border-4 border-white ring-1 ring-gray-200">
                  <img
                    src={appointmentData.imageUrl}
                    alt={appointmentData.doctorName}
                    className="w-full h-auto aspect-square object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                
                {/* Rating card that overlaps the bottom of the image */}
                <div className="bg-white shadow-md rounded-lg p-3 mt-[-20px] mx-auto w-4/5 relative z-10 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-1 text-center text-gray-700">Your Rating</h3>
                  <div className="flex justify-center items-center gap-1">
                    {renderRatingStars()}
                    <span className="ml-2 font-semibold text-lg">{appointmentData.rating}</span>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="md:w-2/3 space-y-5">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{appointmentData.doctorName}</h2>
                  <p className="text-xl text-teal-600 font-medium">{appointmentData.specialization}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-teal-500 shadow-sm">
                    <Calendar className="text-teal-600" size={20} />
                    <span className="text-lg font-medium">Date:</span>
                    <span className="text-lg">{formattedDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-teal-500 shadow-sm">
                    <Clock className="text-teal-600" size={20} />
                    <span className="text-lg font-medium">Time:</span>
                    <span className="text-lg">{appointmentData.appointmentTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-teal-500 shadow-sm">
                    <FileText className="text-teal-600" size={20} />
                    <span className="text-lg font-medium">Appointment ID:</span>
                    <span className="text-lg">{appointmentData.appointmentId || "N/A"}</span>
                  </div>

                  {appointmentData.recommendation && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-teal-500 shadow-sm">
                      <Award className="text-teal-600" size={20} />
                      <span className="text-lg font-medium">Recommendation:</span>
                      <span className="text-lg">{appointmentData.recommendation}</span>
                    </div>
                  )}
                  
                  {/* Prescription Status */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-teal-500 shadow-sm">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                        <span className="text-lg font-medium">Checking for prescriptions...</span>
                      </>
                    ) : prescription ? (
                      <>
                        <Pill className="text-teal-600" size={20} />
                        <span className="text-lg font-medium">Prescription:</span>
                        <button 
                          onClick={() => setModalOpen(true)}
                          className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          View Prescription
                        </button>
                      </>
                    ) : (
                      <>
                        <FileX className="text-gray-400" size={20} />
                        <span className="text-lg font-medium">Prescription:</span>
                        <span className="text-gray-500">No prescription available</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Review section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <ThumbsUp className="mr-2 text-teal-600" size={22} />
                Your Feedback
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
                {appointmentData.review ? (
                  <div className="relative">
                    <div className="absolute -top-4 -left-2 text-gray-300 opacity-60 transform -rotate-6 text-6xl font-serif">"</div>
                    <p className="text-lg leading-relaxed text-gray-700 px-4 relative z-10">
                      {appointmentData.review}
                    </p>
                    <div className="absolute -bottom-10 -right-2 text-gray-300 opacity-60 transform rotate-6 text-6xl font-serif">"</div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No review provided for this appointment.</p>
                )}
              </div>
            </div>

            {/* Recommendations or follow-up actions */}
            <div className="mt-10 bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Next Steps</h3>
              {appointmentData.recommendation ? (
                <>
                  <p className="text-gray-700 font-medium text-lg">{appointmentData.recommendation}</p>
                  <p className="text-gray-600 mt-2">
                    Follow the recommended course to continue your progress. Your doctor has provided
                    this guidance to help you with your ongoing treatment.
                  </p>
                </>
              ) : (
                <p className="text-gray-600">
                  No specific recommendations were provided for this appointment. Continue with your regular care routine.
                </p>
              )}
              <button className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-medium transition-all transform hover:scale-105">
                Schedule Follow-up
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Prescription Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {prescription && (
          <div className="relative">
            <PrescriptionDebugModal 
              prescription={{
                ...prescription,
                prescription: Array.isArray(prescription.prescription) 
                  ? prescription.prescription 
                  : []
              }} 
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorReviewPage;