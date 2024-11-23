import React, { useState } from 'react'
import { ArrowLeft, Search, MapPin, Clock, ArrowRight } from 'lucide-react'
import Navbar from '../../Components/Navbar'
import ActiveTab from '../../Components/patient/ActiveTab';
import MoodTrackerPage from './MoodProgress';
import PreviousPrograms from './PreviousPrograms';
import PrescriptionPage from '@/Components/patient/PrescriptionPopUp';
import SearchByNameAndLoc from '@/Components/patient/SearchByNameAndLoc';


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

  const tabs = ['Prescriptions', 'Mood Progress', 'Previous Programs'];


  return (
   <>
    <Navbar/>    

    

      {/* Main Content */}
   <div className="bg-[#fffff] min-h-screen w-full flex justify-center mt-32 ">
       <div className="w-full max-w-screen-xl p-4 bg-[#fff] mt-4">
     
       <ActiveTab
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={(tab) => setActiveTab(tab as 'Prescriptions' | 'Mood Progress' | 'Previous Programs')}
      />


        {activeTab === 'Prescriptions' && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            
            {/* Search Section */}
            <SearchByNameAndLoc />

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
