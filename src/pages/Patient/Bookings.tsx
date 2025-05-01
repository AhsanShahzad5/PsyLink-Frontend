import React, { useEffect, useState } from 'react'
import { ArrowLeft, Search, MapPin, Clock, ArrowRight, Star, Phone, Timer } from 'lucide-react'
import Navbar from '@/Components/Navbar'
import ActiveTab from '@/Components/patient/ActiveTab';
import MoodTrackerPage from './MoodProgress';
import PreviousPrograms from './PreviousPrograms';
import PrescriptionPage from '@/Components/patient/PrescriptionPopUp';
import SearchByNameAndLoc from '@/Components/patient/SearchByNameAndLoc';
import DoctorCard from '@/Components/patient/DoctorCard';
import BookedAppointmentCard from '@/Components/patient/BookedAppointmentCard';
import HistoryAppointmentCard from '@/Components/patient/HistoryAppointmentCard';
import { useNavigate } from 'react-router-dom';


interface Doctor {
  id: number;
  doctorName: string;
  specialization: string;
  availableTime: string;
  rating: number;
  reviews: number;
  imageUrl: string;
}

interface BookedAppointment {
  id: number;
  appointmentId: string;
  doctorName: string;
  specialization: string;
  bookedTimeSlot: string; // E.g., "8:00 PM - 9:00 PM"
  date: string; // E.g., "2025-10-25"
  duration: string; // E.g., "60 minutes"
  imageUrl: string;
  status: "active" | "upcoming"; // Active = joinable, Upcoming = not yet joinable
  joinIn: string | null; // Time remaining for upcoming appointments
  meetingLink?: string; // Optional meeting link
}


interface HistoryAppointment {
  id: number | string;
  appointmentId: string;
  doctorName: string;
  specialization: string;
  appointmentTime: string; // E.g., "8:00 PM - 9:00 PM"
  date: string; // E.g., "2025-10-25"
  rating?: number;
  review?: string;
  imageUrl: string;
}

export default function Bookings(): JSX.Element {

  const [activeTab, setActiveTab] = useState<'Explore Doctors' | 'Booked Appointments' | 'History'>('Explore Doctors')
  const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [doctors, setDoctors] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState<BookedAppointment[]>([]);
  const [historyAppointments, setHistoryAppointments] = useState<HistoryAppointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleViewClick = () => {
    setModalOpen(true); // Open the modal when "View" is clicked
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  const tabs = ['Explore Doctors', 'Booked Appointments', 'History'];

  //CALLING API FOR GET VERIFIED DOCTORS
  useEffect(() => {
    const fetchVerifiedDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/patient/doctors", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
          console.log(data[0].clinic.fullName);

        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch clinic details");
        }
      } catch (err) {
        return "Error while getting clinic data"
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedDoctors();
  }, []);

  //CALLING API FOR BOOKED APPOINTMENTS
  useEffect(() => {
    const fetchBookedAppointments = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/patient/booked/appointment", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("This is data coming from booked appointment api : ", data);
          setBookedAppointments(data);
        } else {
          console.error("Failed to fetch booked appointments");
        }
      } catch (err) {
        console.error("Error while fetching appointments:", err);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchBookedAppointments();
  }, []);

  // CALLING API FOR HISTORY APPOINTMENTS
  useEffect(() => {
    const fetchHistoryAppointments = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/patient/history/appointment", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("This is data coming from history appointment api : ", data);
          setHistoryAppointments(data);
        } else {
          console.error("Failed to fetch history appointments");
        }
      } catch (err) {
        console.error("Error while fetching history appointments:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistoryAppointments();
  }, []);

  console.log("This is booked appointments data : ", bookedAppointments);
  console.log("This is history appointments data : ", historyAppointments);

  return (
    <>
      {/* <Navbar/>     */}

      {/* Main Content */}
      <div className="bg-[#D3EDEB] min-h-screen w-full flex justify-center mt-32 ">
        <div className="w-full max-w-screen-xl p-4 bg-[#D3EDEB] mt-10">

          <ActiveTab
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={(tab) => setActiveTab(tab as 'Explore Doctors' | 'Booked Appointments' | 'History')}
          />


          {activeTab === 'Explore Doctors' && (
            <div className="bg-[#fff] rounded-xl shadow p-6 mb-6 ">
              {/* Search Section */}
              <SearchByNameAndLoc />

              {/* Doctor Cards */}
              <div className="space-y-4">
                {loading ? (
                  <div
                  className="flex flex-col sm:flex-row items-start min-h-56 justify-center  bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-screen mx-auto">
                    <p>Loading....</p>
                  </div>
                ) : doctors?.map((doctor: any) => (
                  <DoctorCard
                    key={doctor._id} // Use unique ID
                    doctorCard={{
                      id: doctor._id || "N/A",
                      userId : doctor.userId || "N/A",
                      fullName: doctor.clinic?.fullName || "N/A",
                      image: doctor.clinic?.image || "/src/assets/patient/doctor/doctor.png", // Default image if not available   data.clinic.image
                      description: doctor.clinic?.description || "Hi! I'm here to provide expert care and support for your mental wellness journey.",
                      consultationFee: doctor.clinic?.consultationFee || 0, // Default fee if missing
                      city: doctor.clinic?.city || "N/A", // Handle missing city
                      country: doctor.clinic?.country || "N/A", // Handle missing country
                      specialisation: doctor.clinic?.specialisation || "N/A",
                      educationBackground: doctor.clinic?.educationBackground || "N/A",
                      startTime: doctor.clinic?.startTime || "N/A",
                      endTime: doctor.clinic?.endTime || "N/A",
                      appointments: doctor.availability || "N/A",
                      avgRating: doctor.avgRating || "0.0" // Add the avgRating to doctorCard props
                    }}
                  />
                ))}
              </div>


            </div>

          )}

          {/* Modal for Prescription */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
              <div className="relative bg-transparent rounded-lg p-6 w-full max-w-[1000px] max-h-[500px] sm:w-[95%] sm:max-h-screen sm:overflow-y-scroll sm:[&::-webkit-scrollbar]:hidden sm:scrollbar-hide">
                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-6 right-4 text-black hover:text-black text-2xl z-50 transition-transform transform hover:scale-125"
                >
                  ✖
                </button>
                <PrescriptionPage />
              </div>
            </div>
          )}

          {activeTab === 'Booked Appointments' && (
             <div className="bg-[#fff] rounded-xl shadow min-h-[80%] p-6 mb-6 ">
              {loadingAppointments ? (
                <div
                className="flex flex-col sm:flex-row items-start min-h-56 justify-center  bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-screen mx-auto">
                  <p>Loading....</p>
                </div>
              ) : bookedAppointments.length > 0 ? (
                bookedAppointments
                  .filter((appointment) => appointment.status === "active" || appointment.status === "upcoming" || appointment.status === "confirmed")
                  .map((appointment) => (
                    <BookedAppointmentCard key={appointment.id} bookedAppointment={appointment} />
                  ))
              ) : (
                <div
                className="flex flex-col sm:flex-row items-start min-h-56 justify-center  bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-screen mx-auto">
                  <p>No Booked Appointments</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'History' && (
            <div className="bg-[#fff] rounded-xl shadow min-h-[80%] p-6 mb-6 ">
              {loadingHistory ? (
                <div
                className="flex flex-col sm:flex-row items-start min-h-56 justify-center  bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-screen mx-auto">
                  <p>Loading....</p>
                </div>
              ) : historyAppointments.length > 0 ? (
                historyAppointments.map((history) => (
                  <HistoryAppointmentCard key={history.id} historyCard={history} />
                ))
              ) : (
                <div
                className="flex flex-col sm:flex-row items-start min-h-56 justify-center  bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-screen mx-auto">
                  <p>No History Appointments</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}