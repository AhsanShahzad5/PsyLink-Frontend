import { ArrowRight, Star, Timer } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom';

interface HistoryAppointment {
  id: number | string;
  appointmentId: string;
  doctorName: string;
  specialization: string;
  appointmentTime: string; // E.g., "8:00 PM - 9:00 PM"
  date: string; // E.g., "2025-10-25"
  rating?: number;
  review?: string;
  status: string; // Added status field
  isAnonymous: boolean;
  imageUrl: string;
}

interface HistoryCardProps {
    historyCard: HistoryAppointment; // Define the expected prop type
  }

  export default function HistoryAppointmentCard({historyCard}: HistoryCardProps) {

    const navigate = useNavigate()

    // Function to get status styling
    const getStatusStyle = (status: string) => {
      switch (status.toLowerCase()) {
        case 'completed':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'missed':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    // Function to get status icon
    const getStatusIcon = (status: string) => {
      switch (status.toLowerCase()) {
        case 'completed':
          return '✓';
        case 'cancelled':
          return '✗';
        case 'missed':
          return '⚠';
        default:
          return '•';
      }
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-screen mx-auto mb-4">
        {/* 1st Div: Image */}
        <div className="w-full sm:w-auto sm:flex-shrink-0 mb-4 sm:mb-0">
          <img
            src={historyCard.imageUrl}
            alt="Doctor"
            className="w-full sm:w-40 h-auto sm:h-40 object-contain"
          />
        </div>
      
        {/* 2nd Div: Doctor Info */}
        <div className="flex-1 mx-6">
          {/* Doctor Name, Specialization, and Appointment Time */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 className="font-semibold text-lg text-center sm:text-left">{historyCard.doctorName}</h3>
              {/* Status Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(historyCard.status)} flex items-center space-x-1 mt-2 sm:mt-0 self-center sm:self-auto`}>
                <span>{getStatusIcon(historyCard.status)}</span>
                <span className="capitalize">{historyCard.status}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center sm:text-left">{historyCard.specialization}</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 items-center sm:items-start">
              <div className="flex items-center gap-1">
                <Timer size={16} className="text-black" />
                {historyCard.appointmentTime}
              </div>
              <p className="text-black">
                {new Date(historyCard.date).toDateString()}
            {historyCard.isAnonymous && (<span className="text-black">Anonymous Consultation</span>)}
              </p>
            </div>
          </div>
      
          {/* Separator */}
          <hr className="my-4 border-1 border-black mx-auto sm:mx-0 max-w-sm sm:w-auto" />

          {/* Reviews and Rating - Only show for completed appointments */}
          {historyCard.status === 'completed' && historyCard.rating && (
            <div className="flex justify-center sm:justify-start items-center text-gray-500">
              <Star size={16} className="text-yellow-400 mr-1" />
              <span className="text-sm">Rated {historyCard.rating}/5</span>
            </div>
          )}

          {/* Status-specific messages */}
          {historyCard.status === 'missed' && (
            <div className="text-center sm:text-left">
              <p className="text-sm text-orange-600 font-medium">
                Appointment was missed
              </p>
            </div>
          )}

          {historyCard.status === 'cancelled' && (
            <div className="text-center sm:text-left">
              <p className="text-sm text-red-600 font-medium">
                Appointment was cancelled
              </p>
            </div>
          )}
        </div>
      
        {/* 3rd Div: View Button */}
        <div className="w-full sm:w-auto mt-2">
        <button className="w-full sm:w-auto flex items-center justify-center px-10 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            onClick={() => navigate('/patient/doctor-review', { 
              state: { appointmentData: historyCard } 
            })}
        >
          <span className="flex items-center">
            View <ArrowRight size={16} className="ml-2" />
          </span>
        </button>
        </div>
      </div>
    )
  }