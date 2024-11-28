import React from "react";
import { useLocation ,useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const SessionDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
  const session = location.state;  // Receiving the session data

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg overflow-auto max-h-[470px] h-screen custom-scrollbar">
        {/* Back button */}
        <div className="flex items-center mb-6">
          <FaArrowLeft
            className="text-primary cursor-pointer hover:text-gray-800 mr-4"
            onClick={() => navigate("/admin/sessions")}  // Navigate back to the sessions page
            size={20}
          />
          <h1 className="text-3xl font-semibold">Session ID :  {session.sessionId}</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">  {/* Grid layout with 2 columns on larger screens */}
          <div className="space-y-4">
            <p><strong className="text-primary font-seminold mr-2">Session Date:</strong> {session.sessionDate}</p>
            <p><strong className="text-primary font-seminold mr-2">Doctor Name:</strong> {session.doctorName} (ID: {session.doctorId})</p>
            <p><strong className="text-primary font-seminold mr-2">Doctor ID:</strong> {session.doctorId}</p>
            <p><strong className="text-primary font-seminold mr-2">Doctor's Time in Room:</strong> {session.doctorTimeInRoom}</p>
          </div>

          <div className="space-y-4">
            <p><strong className="text-primary font-seminold mr-2">Session Time:</strong> {session.sessionTime}</p>
            <p><strong className="text-primary font-seminold mr-2">Patient ID:</strong> {session.patientId}</p>
            <p><strong className="text-primary font-seminold mr-2">Patient Name:</strong> {session.patientName} (ID: {session.patientId})</p>
            <p><strong className="text-primary font-seminold mr-2">Patient's Time in Room:</strong> {session.patientTimeInRoom}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;


