import React, { useState } from 'react'
import { ArrowLeft, Search, MapPin, Clock, ArrowRight } from 'lucide-react'
import Navbar from '../../Components/Navbar'
import ActiveTab from '../../Components/ActiveTab';
import MoodTrackerPage from './MoodProgress';
import PreviousPrograms from './PreviousPrograms';
import PrescriptionPage from '@/Components/PrescriptionPopUp';


interface Appointment {
  id: number
  doctorName: string
  specialization: string
  time: string
  date: string
  imageUrl: string
}

const appointments: Appointment[] = [
  {
    id: 1,
    doctorName: 'Dr Fahad Tariq Aziz',
    specialization: 'Psychiatrist',
    time: '12:30pm - 8:00pm',
    date: '8th October, 2024',
    imageUrl: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 2,
    doctorName: 'Dr Fahad Tariq Aziz',
    specialization: 'Psychiatrist',
    time: '12:30pm - 8:00pm',
    date: '8th October, 2024',
    imageUrl: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 3,
    doctorName: 'Dr Fahad Tariq Aziz',
    specialization: 'Psychiatrist',
    time: '12:30pm - 8:00pm',
    date: '8th October, 2024',
    imageUrl: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 4,
    doctorName: 'Dr Fahad Tariq Aziz',
    specialization: 'Psychiatrist',
    time: '12:30pm - 8:00pm',
    date: '8th October, 2024',
    imageUrl: '/placeholder.svg?height=50&width=50',
  },
]


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
  const [activeTab, setActiveTab] = useState<'Prescriptions' | 'Mood Progress' | 'Previous Programs'>('Prescriptions')

  const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

  const handleViewClick = () => {
    setModalOpen(true); // Open the modal when "View" is clicked
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };


  return (
   <>
    <Navbar/>    

    

      {/* Main Content */}
   <div className="bg-[#fffff] min-h-screen w-full flex justify-center mt-32 ">
       <div className="w-full max-w-screen-xl p-4 bg-[#fff] mt-4">
       <nav className="flex justify-between items-center w-full p-2 sm:p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10 mt-24">
  <ArrowLeft className="text-teal-600 mr-2 sm:mr-4" />

  {/* Tabs visible on small screens only */}
  <div className="flex-1 flex sm:hidden overflow-x-auto space-x-2 justify-center px-2">
    <button
      className={`py-1 px-2 min-w-[80px] font-medium text-xs sm:text-sm whitespace-nowrap ${
        activeTab === 'Prescriptions' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
      }`}
      onClick={() => setActiveTab('Prescriptions')}
    >
      Prescriptions
    </button>
    <button
      className={`py-1 px-2 min-w-[80px] font-medium text-xs sm:text-sm whitespace-nowrap ${
        activeTab === 'Mood Progress' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
      }`}
      onClick={() => setActiveTab('Mood Progress')}
    >
      Mood Progress
    </button>
    <button
      className={`py-1 px-2 min-w-[80px] font-medium text-xs sm:text-sm whitespace-nowrap ${
        activeTab === 'Previous Programs' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
      }`}
      onClick={() => setActiveTab('Previous Programs')}
    >
      Previous Programs
    </button>
  </div>

  {/* Tabs visible on larger screens only */}
  <div className="hidden sm:flex justify-between flex-1 px-20 border-b border-gray-200">
    <button
      className={`py-2 px-4 font-medium text-base sm:text-lg ${
        activeTab === 'Prescriptions' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
      }`}
      onClick={() => setActiveTab('Prescriptions')}
    >
      Prescriptions
    </button>
    <button
      className={`py-2 px-4 font-medium text-base sm:text-lg ${
        activeTab === 'Mood Progress' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
      }`}
      onClick={() => setActiveTab('Mood Progress')}
    >
      Mood Progress
    </button>
    <button
      className={`py-2 px-4 font-medium text-base sm:text-lg ${
        activeTab === 'Previous Programs' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
      }`}
      onClick={() => setActiveTab('Previous Programs')}
    >
      Previous Programs
    </button>
  </div>
</nav>


        {activeTab === 'Prescriptions' && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4 rounded-2xl">
              <div className="flex-1 relative rounded-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " size={20} />
                <input
                  type="text"
                  placeholder="Search By Name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors self-start md:self-center">
                Search
              </button>
            </div>

            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex items-center mb-4 sm:mb-0">
                    <img
                    src={'/src/assets/prescription/doctor.png'}
                    //   src={appointment.imageUrl}
                      alt={appointment.doctorName}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-bold">{appointment.doctorName}</h3>
                      <p className="text-gray-600 text-left">{appointment.specialization}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center">
                    
                      <div className="flex items-center text-gray-600 ">
                        <Clock size={16} className="mr-1" />
                        {appointment.time}
                      </div>
                      <div className="text-gray-600 px-20">{appointment.date}</div>
                    </div>
                   
                  
                   <div> 
                    <button 
                        className="bg-teal-600 text-white px-12 py-2 hover:bg-teal-700 transition-colors flex items-center rounded-[6px]"
                        onClick={handleViewClick}
                    >
                      View
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>

                </div>
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




        {activeTab === 'Mood Progress' && (
          
            <MoodTrackerPage/>
            
          
        )}

        {activeTab === 'Previous Programs' && (
            <PreviousPrograms courses={courses}/>
        )}
      </div>
    </div>
    </>
  )
}
