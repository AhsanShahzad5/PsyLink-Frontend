import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaClock, FaUserMd, FaUser, FaCopy, FaCheck } from "react-icons/fa";

interface SessionData {
  sessionId: string;
  doctorName: string;
  doctorId: string | { _id: string; name?: string; email?: string };
  doctorTimeInRoom: string;
  sessionDate: string;
  sessionTime: string;
  patientName: string;
  patientId: string | { _id: string; name?: string; email?: string };
  patientTimeInRoom: string;
}

const SessionDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = location.state as SessionData;
  const [copiedDoctorId, setCopiedDoctorId] = useState(false);
  const [copiedPatientId, setCopiedPatientId] = useState(false);
  const [copiedSessionId, setCopiedSessionId] = useState(false);

  // If no session data is available, show an error message
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen bg-secondary">
        <div className="p-6 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-semibold text-red-500 mb-4">Session Not Found</h1>
          <p className="mb-6">The session details you're looking for are not available.</p>
          <button 
            onClick={() => navigate("/admin/sessions")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition"
          >
            Return to Sessions
          </button>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to safely render values, avoiding direct object rendering
  const renderSafeValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Helper function to extract ID from object or return the ID directly
  const extractId = (idValue: any): string => {
    if (idValue === null || idValue === undefined) {
      return '';
    }
    if (typeof idValue === 'object' && idValue._id) {
      return idValue._id;
    }
    return String(idValue);
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string, type: 'doctor' | 'patient' | 'session') => {
    navigator.clipboard.writeText(text).then(() => {
      // Set the appropriate copy state to true
      if (type === 'doctor') setCopiedDoctorId(true);
      if (type === 'patient') setCopiedPatientId(true);
      if (type === 'session') setCopiedSessionId(true);
      
      // Reset the copy state after 2 seconds
      setTimeout(() => {
        if (type === 'doctor') setCopiedDoctorId(false);
        if (type === 'patient') setCopiedPatientId(false);
        if (type === 'session') setCopiedSessionId(false);
      }, 2000);
    });
  };

  // Get clean IDs for display and copying
  const doctorId = extractId(session.doctorId);
  const patientId = extractId(session.patientId);
  const sessionId = renderSafeValue(session.sessionId);

  return (
    <div className="flex justify-center py-6 bg-secondary h-screen">
      <div className="w-[95%] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with back button */}
        <div className="bg-white text-primary p-4 flex items-center">
          <button
            className="flex items-center hover:bg-primary-dark rounded-full p-2 transition"
            onClick={() => navigate("/admin/sessions")}
          >
            <FaArrowLeft size={16} className="mr-2" />
            <span>Back to Sessions</span>
          </button>
        </div>
        
        {/* Session ID banner */}
        <div className="bg-gray-50 p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            Session Details: 
            <span className="text-primary ml-2">{sessionId}</span>
            <button 
              onClick={() => copyToClipboard(sessionId, 'session')} 
              className="text-gray-500 hover:text-primary ml-2 focus:outline-none"
              title="Copy Session ID"
            >
              {copiedSessionId ? <FaCheck size={16} className="text-green-500" /> : <FaCopy size={16} />}
            </button>
          </h1>
        </div>
        
        {/* Main content */}
        <div className="p-6">
          {/* Date and Time Section */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              <FaCalendarAlt className="inline mr-2 text-primary" />
              Session Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                  <FaCalendarAlt className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{session.sessionDate ? formatDate(session.sessionDate) : ''}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                  <FaClock className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{renderSafeValue(session.sessionTime)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Doctor and Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor Section */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b border-blue-100 pb-2">
                <FaUserMd className="inline mr-2" />
                Doctor Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{renderSafeValue(session.doctorName)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <div className="flex items-center">
                    <p className="font-medium">{doctorId}</p>
                    <button 
                      onClick={() => copyToClipboard(doctorId, 'doctor')} 
                      className="text-gray-500 hover:text-primary ml-2 focus:outline-none"
                      title="Copy Doctor ID"
                    >
                      {copiedDoctorId ? <FaCheck size={16} className="text-green-500" /> : <FaCopy size={16} />}
                    </button>
                  </div>
                </div>
                {/* Time in Room is commented out as requested
                <div>
                  <p className="text-sm text-gray-500">Time in Room</p>
                  <p className="font-medium">{renderSafeValue(session.doctorTimeInRoom)}</p>
                </div>
                */}
              </div>
            </div>
            
            {/* Patient Section */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-green-700 border-b border-green-100 pb-2">
                <FaUser className="inline mr-2" />
                Patient Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{renderSafeValue(session.patientName)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <div className="flex items-center">
                    <p className="font-medium">{patientId}</p>
                    <button 
                      onClick={() => copyToClipboard(patientId, 'patient')} 
                      className="text-gray-500 hover:text-primary ml-2 focus:outline-none"
                      title="Copy Patient ID"
                    >
                      {copiedPatientId ? <FaCheck size={16} className="text-green-500" /> : <FaCopy size={16} />}
                    </button>
                  </div>
                </div>
                {/* Time in Room is commented out as requested
                <div>
                  <p className="text-sm text-gray-500">Time in Room</p>
                  <p className="font-medium">{renderSafeValue(session.patientTimeInRoom)}</p>
                </div>
                */}
              </div>
            </div>
          </div>
          
          {/* Actions Section */}
          <div className="mt-8 flex justify-end space-x-4">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
              Print Details
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition">
              Edit Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;