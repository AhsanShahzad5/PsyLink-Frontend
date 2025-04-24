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
  
  // Sample dynamic data for doctors
  const exploreDoctors: Doctor[] = [
    {
      id: 1,
      doctorName: "Dr. Fahad Tariq Aziz",
      specialization: "Psychologist",
      availableTime: "12:30pm - 8:00pm",
      rating: 4.8,
      reviews: 47,
      imageUrl: "/src/assets/prescription/doctor1.png",
    },
    {
      id: 2,
      doctorName: "Dr. Fahad Tariq Aziz",
      specialization: "Psychiatrist",
      availableTime: "12:30pm - 8:00pm",
      rating: 4.8,
      reviews: 47,
      imageUrl: "/src/assets/prescription/doctor2.png",
    },
  ];


  interface BookedAppointment {
  id: number;
  appointmentId:string;
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
  id: number;
  appointmentId:string;
  doctorName: string;
  specialization: string;
  appointmentTime: string; // E.g., "8:00 PM - 9:00 PM"
  date: string; // E.g., "2025-10-25"
  rating: number;
  imageUrl: string;
}
  
// const HistoryAppointments: HistoryAppointment[] = [
//   {
//     id: 1,
//     appointmentId:"12345",
//     doctorName: "Dr. Fahad Tariq Aziz",
//     specialization: "Psychologist",
//     appointmentTime: "8:00 PM",
//     date: "2025-10-25",
//     rating: 4.8,
//     imageUrl: "/src/assets/patient/doctor/doctor1.png",
//   },
//   {
//     id: 2,
//     appointmentId:"12345",
//     doctorName: "Dr. Sarah Ahmed",
//     specialization: "Psychiatrist",
//     appointmentTime: "10:00 AM",
//     date: "2025-10-28",
//     rating: 4.8,
//     imageUrl: "/src/assets/patient/doctor/doctor2.png",
//   },
// ];
// const HistoryAppointments: HistoryAppointment[] = [
//   {
//     id: 1,
//     doctorName: "Dr. Fahad Tariq Aziz",
//     specialization: "Psychologist",
//     appointmentTime: "8:00 PM",
//     date: "2025-10-25",
//     rating: 4.8,
//     imageUrl: "/src/assets/patient/doctor/doctor1.png",
//   },
//   {
//     id: 2,
//     doctorName: "Dr. Sarah Ahmed",
//     specialization: "Psychiatrist",
//     appointmentTime: "10:00 AM",
//     date: "2025-10-28",
//     rating: 4.8,
//     imageUrl: "/src/assets/patient/doctor/doctor2.png",
//   },
// ];


export default function Bookings(): JSX.Element {

  // Explore Doctor


  const [activeTab, setActiveTab] = useState<'Explore Doctors' | 'Booked Appointments' | 'History'>('Explore Doctors')
  const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [doctors, setDoctors] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState<BookedAppointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [historyAppointments, setHistoryAppointments] = useState<HistoryAppointment[]>([]);

const moveToHistory = (appointment: BookedAppointment) => {
  // Create a new history appointment object
  const historyAppointment: HistoryAppointment = {
    id: appointment.id,
    doctorName: appointment.doctorName,
    specialization: appointment.specialization,
    appointmentTime: appointment.bookedTimeSlot,
    date: appointment.date,
    rating: 4, // For now, hardcode the rating or fetch it from your backend
    imageUrl: appointment.imageUrl,
    appointmentId: appointment.appointmentId
  };

  // Remove the appointment from the booked appointments
  setBookedAppointments(prevAppointments =>
    prevAppointments.filter(app => app.id !== appointment.id)
  );

  // Add the appointment to the history list
  setHistoryAppointments(prevHistory => [...prevHistory, historyAppointment]);
};


  const handleViewClick = () => {
    setModalOpen(true); // Open the modal when "View" is clicked
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  const tabs = ['Explore Doctors', 'Booked Appointments','History'];

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
          // Process the appointments and move completed ones to history
          const now = new Date();
          data.forEach((appointment: BookedAppointment) => {
            if (new Date(appointment.date) < now && appointment.status !== 'active') {
              moveToHistory(appointment);
            }
          });
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
  {doctors.map((doctor: any) => (
    <DoctorCard
      key={doctor._id} // Use unique ID
      doctorCard={{
        id : doctor._id || "N/A",
        fullName: doctor.clinic.fullName || "N/A",
        image: doctor.image || "/src/assets/patient/doctor/doctor.png", // Default image if not available
        consultationFee: doctor.clinic.consultationFee || 0, // Default fee if missing
        city: doctor.clinic.city || "N/A", // Handle missing city
        country: doctor.clinic.country || "N/A", // Handle missing country
        specialisation: doctor.clinic.specialisation || "N/A",
        educationBackground: doctor.clinic.educationBackground || "N/A",
        startTime: doctor.clinic.startTime || "N/A",
        endTime: doctor.clinic.endTime || "N/A",
        appointments : doctor.availability || "N/A"
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
  <div className="space-y-4">
    {loadingAppointments ? (
      <p>Loading...</p>
    ) : bookedAppointments.length > 0 ? (
      bookedAppointments
        .filter((appointment) => appointment.status === "active" || appointment.status === "upcoming")
        .map((appointment) => (
          <BookedAppointmentCard key={appointment.id} bookedAppointment={appointment} />
        ))
    ) : (
      <p>No Booked Appointments</p>
    )}
  </div>
)}


{activeTab === 'History' && (
  <div className="space-y-4">
    {historyAppointments.length > 0 ? (
      historyAppointments.map((history) => (
        <HistoryAppointmentCard key={history.id} historyCard={history} />
      ))
    ) : (
      <p className="text-center text-xl text-gray-600 font-semibold mt-8">
      <span className="text-teal-600">No History Available</span>
    </p>
    )}
  </div>
)}
      </div>
    </div>
    </>
  )
}
