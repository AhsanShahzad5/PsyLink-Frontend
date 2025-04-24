import React from "react";
import { useNavigate } from "react-router-dom";

interface Session {
  sessionId: string;
  doctorName: string;
  doctorId: string;
  doctorTimeInRoom: string;
  sessionDate: string;
  sessionTime: string;
  patientName: string;
  patientId: string;
  patientTimeInRoom: string;
}

const Sessions: React.FC = () => {
  const navigate = useNavigate();

  // Updated session data with additional fields
  const sessionsData: Session[] = [
    {
      sessionId: "S001",
      doctorName: "abbad malik",
      doctorId: "1",
      doctorTimeInRoom: "10:00 AM - 10:30 AM",
      sessionDate: "2024-11-01",
      sessionTime: "10:00 AM",
      patientName: "ahsan doctor",
      patientId: "P001",
      patientTimeInRoom: "10:00 AM - 10:15 AM",
    },
    {
      sessionId: "S002",
      doctorName: "ahsan shahzad",
      doctorId: "2",
      doctorTimeInRoom: "11:00 AM - 11:30 AM",
      sessionDate: "2024-11-02",
      sessionTime: "11:00 AM",
      patientName: "abbad dr new",
      patientId: "P002",
      patientTimeInRoom: "11:00 AM - 11:20 AM",
    },
    {
      sessionId: "S003",
      doctorName: "fahad doctor",
      doctorId: "3",
      doctorTimeInRoom: "2:00 PM - 2:30 PM",
      sessionDate: "2024-11-03",
      sessionTime: "2:00 PM",
      patientName: "ahsan shahzad",
      patientId: "P003",
      patientTimeInRoom: "2:00 PM - 2:15 PM",
    },
    {
      sessionId: "S004",
      doctorName: "ahsan doctor",
      doctorId: "3",
      doctorTimeInRoom: "2:00 PM - 2:30 PM",
      sessionDate: "2024-11-03",
      sessionTime: "2:00 PM",
      patientName: "abbad malik",
      patientId: "P003",
      patientTimeInRoom: "2:00 PM - 2:15 PM",
    },
    {
      sessionId: "S005",
      doctorName: "abbad dr new",
      doctorId: "3",
      doctorTimeInRoom: "2:00 PM - 2:30 PM",
      sessionDate: "2024-11-03",
      sessionTime: "2:00 PM",
      patientName: "fahad doctor",
      patientId: "P003",
      patientTimeInRoom: "2:00 PM - 2:15 PM",
    },
    {
      sessionId: "S006",
      doctorName: "ahsan shahzad",
      doctorId: "3",
      doctorTimeInRoom: "2:00 PM - 2:30 PM",
      sessionDate: "2024-11-03",
      sessionTime: "2:00 PM",
      patientName: "ahsan doctor",
      patientId: "P003",
      patientTimeInRoom: "2:00 PM - 2:15 PM",
    },
    {
      sessionId: "S007",
      doctorName: "abbad malik",
      doctorId: "3",
      doctorTimeInRoom: "2:00 PM - 2:30 PM",
      sessionDate: "2024-11-03",
      sessionTime: "2:00 PM",
      patientName: "abbad dr new",
      patientId: "P003",
      patientTimeInRoom: "2:00 PM - 2:15 PM",
    },
    {
      sessionId: "S007",
      doctorName: "fahad doctor",
      doctorId: "3",
      doctorTimeInRoom: "2:00 PM - 2:30 PM",
      sessionDate: "2024-11-03",
      sessionTime: "2:00 PM",
      patientName: "ahsan doctor",
      patientId: "P003",
      patientTimeInRoom: "2:00 PM - 2:15 PM",
    },
    {
      sessionId: "S007",
      doctorName: "ahsan doctor",
      doctorId: "3",
      doctorTimeInRoom: "2:00 PM - 2:30 PM",
      sessionDate: "2024-11-03",
      sessionTime: "2:00 PM",
      patientName: "ahsan shahzad",
      patientId: "P003",
      patientTimeInRoom: "2:00 PM - 2:15 PM",
    },
    {
      sessionId: "S007",
      doctorName: "abbad dr new",
      doctorId: "3",
      doctorTimeInRoom: "2:00 PM - 2:30 PM",
      sessionDate: "2024-11-03",
      sessionTime: "2:00 PM",
      patientName: "abbad malik",
      patientId: "P003",
      patientTimeInRoom: "2:00 PM - 2:15 PM",
    },
    {
      sessionId: "S007",
      doctorName: "ahsan shahzad",
      doctorId: "3",
      doctorTimeInRoom: "2:00 PM - 2:30 PM",
      sessionDate: "2024-11-03",
      sessionTime: "2:00 PM",
      patientName: "fahad doctor",
      patientId: "P003",
      patientTimeInRoom: "2:00 PM - 2:15 PM",
    },
  ];
  

  // Navigate to SessionDetail page with session data
  const handleView = (session: Session) => {
    navigate("/admin/sessions/session-details", { state: session });
  };

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg h-screen mb-8 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Sessions</h1>
          <input
            type="text"
            placeholder="Search by Patient or Doctor"
            className="p-2 border rounded w-64"
          />
        </div>
        <p className="text-gray-500 mb-6">
          <span className="font-semibold">{sessionsData.length} Sessions Found</span>
        </p>

      
      <div className="overflow-auto h-[80%] custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="">
            <tr className="">
              <th className="px-6 py-3 text-left text-sm font-normal text-primary">Session ID</th>
              <th className="px-6 py-3 text-left text-sm font-normal text-primary">Doctor</th>
              <th className="px-6 py-3 text-left text-sm font-normal text-primary">Patient</th>
             
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessionsData.map((session) => (
              <tr key={session.sessionId}>
                <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                  {session.sessionId}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                  {session.doctorName} 
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                  {session.patientName} 
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                  <button
                    className="text-teal-500 font-normal hover:underline"
                    onClick={() => handleView(session)}
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default Sessions;
