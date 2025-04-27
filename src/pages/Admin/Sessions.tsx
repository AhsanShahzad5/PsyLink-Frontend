import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Appointment {
  _id: string;
  appointmentId: string;
  date: string;
  time: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  status: "booked" | "cancelled" | "completed";
  createdAt: string;
}

const Sessions: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch all appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
   
        const response = await fetch("http://localhost:8000/api/admin/session");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setAppointments(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments. Please try again later.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Navigate to SessionDetail page with appointment data
  const handleView = (appointment: Appointment) => {
    // Converting the appointment to match the expected session format
    const sessionData = {
      sessionId: appointment.appointmentId,
      doctorName: appointment.doctorName,
      doctorId: appointment.doctorId,
      doctorTimeInRoom: `${appointment.time} - ${getEndTime(appointment.time)}`,
      sessionDate: appointment.date,
      sessionTime: appointment.time,
      patientName: appointment.patientName,
      patientId: appointment.patientId,
      patientTimeInRoom: `${appointment.time} - ${getEndTime(appointment.time, -15)}`,
    };
    
    navigate("/admin/sessions/session-details", { state: sessionData });
  };

  // Helper function to calculate end time (adding minutes to start time)
  const getEndTime = (startTime: string, addMinutes: number = 30): string => {
    // Check if startTime is in the expected format
    if (!startTime || !startTime.includes(':')) {
      return startTime; // Return original if format is unexpected
    }
    
    let hourStr = startTime.split(':')[0];
    let minuteStr = startTime.split(':')[1];
    
    // Handle format like "10:00 AM"
    if (minuteStr.includes(' ')) {
      const parts = minuteStr.split(' ');
      minuteStr = parts[0];
      const period = parts[1];
      
      let hour = parseInt(hourStr);
      let minute = parseInt(minuteStr);
      
      // Convert to 24-hour format if PM
      if (period === 'PM' && hour < 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }
      
      // Add minutes
      let totalMinutes = hour * 60 + minute + addMinutes;
      let newHour = Math.floor(totalMinutes / 60) % 24;
      let newMinute = totalMinutes % 60;
      
      // Convert back to 12-hour format
      let newPeriod = newHour >= 12 ? 'PM' : 'AM';
      newHour = newHour > 12 ? newHour - 12 : (newHour === 0 ? 12 : newHour);
      
      return `${newHour}:${newMinute.toString().padStart(2, '0')} ${newPeriod}`;
    } else {
      // Handle 24-hour format like "10:00"
      let hour = parseInt(hourStr);
      let minute = parseInt(minuteStr);
      
      // Add minutes
      let totalMinutes = hour * 60 + minute + addMinutes;
      let newHour = Math.floor(totalMinutes / 60) % 24;
      let newMinute = totalMinutes % 60;
      
      return `${newHour}:${newMinute.toString().padStart(2, '0')}`;
    }
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointmentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg h-screen mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Appointments</h1>
          <input
            type="text"
            placeholder="Search by Patient or Doctor"
            className="p-2 border rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="text-gray-500 mb-6">
          <span className="font-semibold">
            {filteredAppointments.length} Appointments Found
          </span>
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : (
          <div className="overflow-auto h-[80%] custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Appointment ID</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Doctor</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                        {appointment.appointmentId}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                        {appointment.time}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                        {appointment.doctorName}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                        {appointment.patientName}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                        <button
                          className="text-teal-500 font-normal hover:underline"
                          onClick={() => handleView(appointment)}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;