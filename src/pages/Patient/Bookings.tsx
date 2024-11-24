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
  
const initialBookedAppointments: BookedAppointment[] = [
  {
    id: 1,
    doctorName: "Dr. Fahad Tariq Aziz",
    specialization: "Psychologist",
    bookedTimeSlot: "8:00 PM",
    date: "2025-10-25",
    duration: "60 minutes",
    imageUrl: "/src/assets/patient/doctor/doctor1.png",
    status: "active",
    joinIn: "",
    meetingLink: "https://video-call-platform.com/meeting/12345",
  },
  {
    id: 2,
    doctorName: "Dr. Sarah Ahmed",
    specialization: "Psychiatrist",
    bookedTimeSlot: "10:00 AM",
    date: "2025-10-28",
    duration: "60 minutes",
    imageUrl: "/src/assets/patient/doctor/doctor2.png",
    status: "upcoming",
    joinIn: "5 Days",
    meetingLink: "https://video-call-platform.com/meeting/67890",
  },
];

interface HistoryAppointment {
  id: number;
  doctorName: string;
  specialization: string;
  appointmentTime: string; // E.g., "8:00 PM - 9:00 PM"
  date: string; // E.g., "2025-10-25"
  rating: number;
  imageUrl: string;
}
  
const HistoryAppointments: HistoryAppointment[] = [
  {
    id: 1,
    doctorName: "Dr. Fahad Tariq Aziz",
    specialization: "Psychologist",
    appointmentTime: "8:00 PM",
    date: "2025-10-25",
    rating: 4.8,
    imageUrl: "/src/assets/patient/doctor/doctor1.png",
  },
  {
    id: 2,
    doctorName: "Dr. Sarah Ahmed",
    specialization: "Psychiatrist",
    appointmentTime: "10:00 AM",
    date: "2025-10-28",
    rating: 4.8,
    imageUrl: "/src/assets/patient/doctor/doctor2.png",
  },
];





export default function Bookings(): JSX.Element {

  // Explore Doctor


  const [activeTab, setActiveTab] = useState<'Explore Doctors' | 'Booked Appointments' | 'History'>('Explore Doctors')

  const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

  const navigate = useNavigate();


  const handleViewClick = () => {
    setModalOpen(true); // Open the modal when "View" is clicked
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  const tabs = ['Explore Doctors', 'Booked Appointments','History'];


  //Booked Appointments


  const [appointments, setAppointments] = useState<BookedAppointment[]>(
    initialBookedAppointments
  );
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update current date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const convertTo24HourFormat = (time: string): string => {
    const [hoursMinutes, period] = time.split(" ");
    const [hours, minutes] = hoursMinutes.split(":").map(Number);

    let adjustedHours = period === "PM" && hours < 12 ? hours + 12 : hours;
    adjustedHours = period === "AM" && hours === 12 ? 0 : adjustedHours;

    return `${adjustedHours.toString().padStart(2, "0")}:${minutes}:00`;
  };

  // Update appointment statuses dynamically
  useEffect(() => {
    const updatedAppointments = appointments.map((appointment) => {
      const appointmentDateTime = new Date(
        `${appointment.date}T${convertTo24HourFormat(
          appointment.bookedTimeSlot
        )}`
      );
      const isActive = currentDateTime >= appointmentDateTime;
      return {
        ...appointment,
        status: isActive ? "active" : "upcoming", // Explicitly assign union type value
        joinIn: isActive ? "" : calculateTimeDifference(appointmentDateTime),
      } as BookedAppointment; // Ensure the returned object matches BookedAppointment
    });
    setAppointments(updatedAppointments);
  }, [currentDateTime]);

  const calculateTimeDifference = (appointmentDateTime: Date): string => {
    const diffInMs = appointmentDateTime.getTime() - currentDateTime.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24);
    const diffInMinutes = Math.floor((diffInMs / (1000 * 60)) % 60);

    if (diffInDays > 0) return `${diffInDays} Days`;
    if (diffInHours > 0) return `${diffInHours} Hours`;
    if (diffInMinutes > 0) return `${diffInMinutes} Minutes`;
    return "Starting Soon";
  };


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
            {exploreDoctors.map((doctor) => (
               <DoctorCard key={doctor.id} doctorCard={doctor} />
            
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
  {initialBookedAppointments.map((appointment) => (
    <BookedAppointmentCard key={appointment.id} bookedAppointment={appointment} />
  ))}
</div>
)}


        {activeTab === 'History' && (
           
          
            <div className="space-y-4">
              {HistoryAppointments.map((history) => (
                 <HistoryAppointmentCard key={history.id} historyCard={history} />
              
              ))}
            </div>
  
        )}
      </div>
    </div>
    </>
  )
}
