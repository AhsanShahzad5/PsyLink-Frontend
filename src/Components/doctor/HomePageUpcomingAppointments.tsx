import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userAtom from '@/atoms/userAtom';
import { useRecoilValue } from 'recoil';

// Types
export type PreviousRecordType = {
  appointmentId: string;
  date: string;
  time: string;
  status: string;
  rating: number | null;
  review: string | null;
  createdAt: string;
  prescription?: {
    date: string;
    medications: Array<{
      medicine: string;
      instructions: string;
    }>;
  };
};

export type AppointmentType = {
  appointmentId: string;
  date: string;
  time: string;
  patient: string;
  patientId?: string;
  previousRecords?: PreviousRecordType[];
};

export const HomeUpcomingAppointments = () => {
  const user = useRecoilValue(userAtom);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Since we're not using Recoil, let's assume user data is stored elsewhere
  // For example, you might have a context or local storage
  const navigate = useNavigate();
  // const userId = user._id

  // useEffect(() => {
  //   // Get user ID from localStorage or another source
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     try {
  //       const parsedUser = JSON.parse(storedUser);
  //       setUser(parsedUser);
  //       console.log("User loaded from localStorage:", parsedUser);
  //     } catch (e) {
  //       console.error("Error parsing user from localStorage:", e);
  //       setError("Failed to load user data");
  //     }
  //   } else {
  //     console.warn("No user found in localStorage");
  //     setError("User not found - please login again");
  //   }
  // }, []);

  useEffect(() => {

    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        
        // Get userId from the user state
        const userId = user._id;
        
        if (!userId) {
          throw new Error('User ID not found');
        }

        console.log("Fetching appointments for user:", userId);
        
        const response = await fetch(`http://localhost:8000/api/doctor/appointments/upcoming?doctorId=${userId}`,{
          credentials: 'include',
        });
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch appointments: ${response.status}`);
        }

        const data = await response.json();
        console.log("Appointment data received in HomeUpcoming:", data);
        
        if (data.success) {
          setAppointments(data.data);
          setError(null); // Clear any previous errors
        } else {
          throw new Error(data.message || 'No data received from server');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error fetching appointments:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (user._id) {
      fetchAppointments();
      
      // Set up polling to refresh data every 2 minutes
      const intervalId = setInterval(fetchAppointments, 2 * 60 * 1000);
      
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [user._id]);

  const handleViewPreviousRecords = (patientId: string, patientName: string, previousRecords: PreviousRecordType[] = []) => {
    navigate('/doctor/appointments/previous-records', { 
      state: { 
        patientId,
        patientName,
        records: previousRecords
      }
    });
  };

  // Show loading state
  if (isLoading && appointments.length === 0) {
    return (
      <div className="col-span-2 bg-white rounded-lg shadow-md p-5 h-[22.5rem] overflow-auto custom-scrollbar">
        <h3 className="text-2xl font-bold mb-4 text-primary border-b pb-4">
          Upcoming Appointments
        </h3>
        <div className="flex justify-center items-center h-64">
          {/* <p className="text-gray-500">Loading appointments... {user._id ? `(for user: ${user._id})` : '(no user ID found)'}</p> */}
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && appointments.length === 0) {
    return (
      <div className="col-span-2 bg-white rounded-lg shadow-md p-5 h-[22.5rem] overflow-auto custom-scrollbar">
        <h3 className="text-2xl font-bold mb-4 text-primary border-b pb-4">
          Upcoming Appointments
        </h3>
        <div className="flex justify-center items-center h-64 text-center">
          <p className="text-red-500">
             {error}
            <br />
            <button 
              className="mt-2 text-blue-500 underline" 
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (appointments.length === 0) {
    return (
      <div className="col-span-2 bg-white rounded-lg shadow-md p-5 h-[22.5rem] overflow-auto custom-scrollbar">
        <h3 className="text-2xl font-bold mb-4 text-primary border-b pb-4">
          Upcoming Appointments
        </h3>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No upcoming appointments found.</p>
        </div>
      </div>
    );
  }

  // Show appointments
  return (
    <div className="col-span-2 bg-white rounded-lg shadow-md p-5 h-[22.5rem] overflow-auto custom-scrollbar">
      <h3 className="text-2xl font-bold mb-4 text-primary border-b pb-4">
        Upcoming Appointments
      </h3>
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="py-2">Date</th>
            <th className="py-2">Time</th>
            <th className="py-2">Patient</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {appointments.map((appointment, index) => (
            <tr key={appointment.appointmentId || index}>
              <td className="py-3 text-gray-600">{appointment.date}</td>
              <td className="py-3 text-gray-600">{appointment.time}</td>
              <td className="py-3 text-gray-600">{appointment.patient}</td>
              <td className="py-3">
                <button
                  className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primaryHover transition"
                  onClick={() => handleViewPreviousRecords(
                    appointment.patientId || '', 
                    appointment.patient, 
                    appointment.previousRecords
                  )}
                  disabled={!appointment.previousRecords || appointment.previousRecords.length === 0}
                >
                  {(!appointment.previousRecords || appointment.previousRecords.length === 0) 
                    ? 'No Records' 
                    : `View Records (${appointment.previousRecords.length})`}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && (
        <div className="text-center mt-2 text-xs text-gray-400">
          Refreshing...
        </div>
      )}
    </div>
  );
};