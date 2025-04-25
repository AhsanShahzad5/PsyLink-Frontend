import { useState, useEffect } from 'react';
import userAtom from '@/atoms/userAtom';
import { useRecoilValue } from 'recoil';
// Types
type AppointmentType = {
  appointmentId: string;
  date: string;
  time: string;
  patient: string;
  patientId?: string;
};

export const HomeUpcomingAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        
        // Get userId from localStorage (assuming this is how you store it)
        const userId = user._id;
        
        if (!userId) {
          throw new Error('User ID not found');
        }

        console.log("Fetching appointments for user:", userId);
        
        const response = await fetch(`/api/doctor/appointments/upcoming?doctorId=${userId}`);
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch appointments');
        }

        const data = await response.json();
        console.log("Appointment data received:", data);
        
        if (data.success) {
          setAppointments(data.data);
        } else {
          throw new Error(data.message || 'No data received from server');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching appointments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
    
    // Set up polling to refresh data every 2 minutes
    const intervalId = setInterval(fetchAppointments, 2 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Show loading state
  if (isLoading && appointments.length === 0) {
    return (
      <div className="col-span-2 bg-white rounded-lg shadow-md p-5 h-[22.5rem] overflow-auto custom-scrollbar">
        <h3 className="text-2xl font-bold mb-4 text-primary border-b pb-4">
          Upcoming Appointments
        </h3>
        <div className="flex justify-center items-center h-64">
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
            {/* <button 
              className="mt-2 text-blue-500 underline" 
              onClick={() => window.location.reload()}
            >
              Try again
            </button> */}
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
        <tbody className="divide-y">
          {appointments.map((appointment, index) => (
            <tr key={appointment.appointmentId || index}>
              <td className="py-3 text-gray-600">{appointment.date}</td>
              <td className="py-3 text-gray-600">{appointment.time}</td>
              <td className="py-3 text-gray-600">{appointment.patient}</td>
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

// import { useState, useEffect } from 'react';
// import userAtom from '@/atoms/userAtom';
// import { useRecoilValue } from 'recoil';
// // Types
// type AppointmentType = {
//   appointmentId: string;
//   date: string;
//   time: string;
//   patient: string;
//   patientId?: string;
// };

// export const HomeUpcomingAppointments = () => {
//   const [appointments, setAppointments] = useState<AppointmentType[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const user = useRecoilValue(userAtom);

 

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         setIsLoading(true);
        
//         // Get doctorId from somewhere (local storage, context, etc.)
//         // For demonstration purposes, I'll assume it comes from localStorage
//         const doctorId = user._id;
//         console.log("this is doctorId in doctorHomePage", doctorId)
        
//         if (!doctorId) {
//           throw new Error('Doctor ID not found');
//         }

//         const response = await fetch(`/api/doctor/appointments/upcoming?doctorId=${doctorId}`);
        
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to fetch appointments');
//         }

//         const data = await response.json();
        
//         if (data.success) {
//           setAppointments(data.data);
//         } else {
//           throw new Error(data.message || 'No data received from server');
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An unknown error occurred');
//         console.error('Error fetching appointments:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAppointments();
    
//     // Set up polling to refresh data every 5 minutes
//     const intervalId = setInterval(fetchAppointments, 5 * 60 * 1000);
    
//     // Clean up interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   // Show loading state
//   if (isLoading && appointments.length === 0) {
//     return (
//       <div className="col-span-2 bg-white rounded-lg shadow-md p-5 h-[22.5rem] overflow-auto custom-scrollbar">
//         <h3 className="text-2xl font-bold mb-4 text-primary border-b pb-4">
//           Upcoming Appointments
//         </h3>
//         <div className="flex justify-center items-center h-64">
//           <p className="text-gray-500">Loading appointments...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show error state
//   if (error && appointments.length === 0) {
//     return (
//       <div className="col-span-2 bg-white rounded-lg shadow-md p-5 h-[22.5rem] overflow-auto custom-scrollbar">
//         <h3 className="text-2xl font-bold mb-4 text-primary border-b pb-4">
//           Upcoming Appointments
//         </h3>
//         <div className="flex justify-center items-center h-64 text-center">
//           <p className="text-red-500">
//             Error loading appointments: {error}
//             <br />
//             <button 
//               className="mt-2 text-blue-500 underline" 
//               onClick={() => window.location.reload()}
//             >
//               Try again
//             </button>
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Show empty state
//   if (appointments.length === 0) {
//     return (
//       <div className="col-span-2 bg-white rounded-lg shadow-md p-5 h-[22.5rem] overflow-auto custom-scrollbar">
//         <h3 className="text-2xl font-bold mb-4 text-primary border-b pb-4">
//           Upcoming Appointments
//         </h3>
//         <div className="flex justify-center items-center h-64">
//           <p className="text-gray-500">No upcoming appointments found.</p>
//         </div>
//       </div>
//     );
//   }

//   // Show appointments
//   return (
//     <div className="col-span-2 bg-white rounded-lg shadow-md p-5 h-[22.5rem] overflow-auto custom-scrollbar">
//       <h3 className="text-2xl font-bold mb-4 text-primary border-b pb-4">
//         Upcoming Appointments
//       </h3>
//       <table className="w-full">
//         <tbody className="divide-y">
//           {appointments.map((appointment, index) => (
//             <tr key={appointment.appointmentId || index}>
//               <td className="py-3 text-gray-600">{appointment.date}</td>
//               <td className="py-3 text-gray-600">{appointment.time}</td>
//               <td className="py-3 text-gray-600">{appointment.patient}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {isLoading && (
//         <div className="text-center mt-2 text-xs text-gray-400">
//           Refreshing...
//         </div>
//       )}
//     </div>
//   );
// };