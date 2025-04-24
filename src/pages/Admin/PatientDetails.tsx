import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

// Define interfaces for our data structures
interface PersonalInformation {
  disability?: string;
  // Add other personal information fields as needed
}

interface Appointment {
  _id: string;
  doctorId: string;
  date: string;
  time: string;
  status: string;
}

interface Appointments {
  upcoming: Appointment[];
  previous: Appointment[];
}

interface Program {
  planName?: string;
  _id: string;
}

interface Programs {
  applied: Program[];
  previous: Program[];
}

interface MoodEntry {
  date: string;
  mood: string;
}

interface File {
  name: string;
  uploadedAt: string;
}

interface Note {
  content: string;
  createdAt: string;
}

interface Patient {
  personalInformation: PersonalInformation;
  appointments: Appointments;
  programs: Programs;
  id: string;
  userId: string;
  dailyMood: MoodEntry[];
  doctorPreference: string;
  files: File[];
  notes: Note[];
}

interface FormattedAppointment {
  sessionId: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
}

const PatientDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/admin/patients/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: Patient = await response.json();
        setPatient(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Failed to load patient data");
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-600">Loading patient data...</h1>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-600">
          {error || "No Patient Data Found"}
        </h1>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primaryHover"
          onClick={() => navigate("/admin/patients")}
        >
          Go Back
        </button>
      </div>
    );
  }

  // Extract relevant information from the API response
  const {  personalInformation, appointments, programs, userId, dailyMood, doctorPreference, files, notes } = patient;
  
  // Format appointments for display
  const formattedAppointments: FormattedAppointment[] = [
    ...(appointments.upcoming || []).map(appt => ({
      sessionId: appt._id,
      doctor: appt.doctorId,
      date: appt.date,
      time: appt.time,
      status: appt.status
    })),
    ...(appointments.previous || []).map(appt => ({
      sessionId: appt._id,
      doctor: appt.doctorId,
      date: appt.date,
      time: appt.time,
      status: appt.status
    }))
  ];

  return (
    <div className="p-6 bg-secondary">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg h-screen p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <FaArrowLeft
            className="text-primary cursor-pointer hover:text-gray-800 mr-4"
            onClick={() => navigate("/admin/patients")}
            size={20}
          />
          <h1 className="text-3xl font-semibold">Patient Profile</h1>
          <div className="ml-auto flex gap-4">
            <button className="px-4 w-32 py-2 rounded-xl bg-primary text-white shadow hover:bg-primaryHover">
              Ban
            </button>
            <button className="px-4 py-2 w-32 rounded-xl bg-red-500 text-white shadow hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
        <div className="overflow-auto h-5/6 custom-scrollbar">
          {/* Patient Details Section */}
          <h2 className="text-xl font-semibold mb-4 text-primary text-left">Patient Details</h2>
          <div className="mb-6 border-t border-gray-200 pt-4">
            <table className="table-auto w-full text-left border-collapse">
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-semibold text-gray-600">User ID:</td>
                  <td className="py-2">{id}</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-semibold text-gray-600">Disability:</td>
                  <td className="py-2">{personalInformation?.disability || "None specified"}</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-semibold text-gray-600">Doctor Preference:</td>
                  <td className="py-2">{doctorPreference || "None"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Appointments Section */}
          <h2 className="text-xl font-semibold mb-4 text-primary text-left">Appointments</h2>
          <div className="mb-6 border-t border-gray-200 pt-4">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600">
                  <th className="py-2">Session ID</th>
                  <th className="py-2">Doctor</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {formattedAppointments.length > 0 ? (
                  formattedAppointments.map((appointment, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2">{appointment.sessionId}</td>
                      <td className="py-2">{appointment.doctor}</td>
                      <td className="py-2">{appointment.date}</td>
                      <td className="py-2">{appointment.time}</td>
                      <td className="py-2">{appointment.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-2 text-center text-gray-500">
                      No Appointments Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Programs Section */}
          <h2 className="text-xl font-semibold mb-4 text-primary text-left">Programs</h2>
          <div className="mb-6 border-t border-gray-200 pt-4">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600">
                  <th className="py-2">Program Name</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {programs && (programs.applied.length > 0 || programs.previous.length > 0) ? (
                  <>
                    {programs.applied.map((program, index) => (
                      <tr key={`applied-${index}`} className="border-t border-gray-200">
                        <td className="py-2">{program.planName || program._id}</td>
                        <td className="py-2">Applied</td>
                      </tr>
                    ))}
                    {programs.previous.map((program, index) => (
                      <tr key={`previous-${index}`} className="border-t border-gray-200">
                        <td className="py-2">{program.planName || program._id}</td>
                        <td className="py-2">Completed</td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={2} className="py-2 text-center text-gray-500">
                      No Programs Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Daily Mood Section */}
          <h2 className="text-xl font-semibold mb-4 text-primary text-left">Daily Mood Entries</h2>
          <div className="mb-6 border-t border-gray-200 pt-4">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600">
                  <th className="py-2">Date</th>
                  <th className="py-2">Mood</th>
                </tr>
              </thead>
              <tbody>
                {dailyMood && dailyMood.length > 0 ? (
                  dailyMood.map((entry, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2">{entry.date}</td>
                      <td className="py-2">{entry.mood}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-2 text-center text-gray-500">
                      No Mood Entries Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Files Section */}
          <h2 className="text-xl font-semibold mb-4 text-primary text-left">Files</h2>
          <div className="border-t border-gray-200 pt-4">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600">
                  <th className="py-2">File Name</th>
                  <th className="py-2">Uploaded On</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files && files.length > 0 ? (
                  files.map((file, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2">{file.name}</td>
                      <td className="py-2">{new Date(file.uploadedAt).toLocaleDateString()}</td>
                      <td className="py-2">
                        <button className="text-teal-500 font-semibold hover:underline">
                          View →
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-2 text-center text-gray-500">
                      No Files Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Notes Section */}
          <h2 className="text-xl font-semibold my-4 text-primary text-left">Notes</h2>
          <div className="border-t border-gray-200 pt-4">
            {notes && notes.length > 0 ? (
              notes.map((note, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold mb-2">{new Date(note.createdAt).toLocaleDateString()}</div>
                  <div>{note.content}</div>
                </div>
              ))
            ) : (
              <div className="py-2 text-center text-gray-500">No Notes Found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;