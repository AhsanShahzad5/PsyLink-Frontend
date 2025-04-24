import { Phone, Timer } from "lucide-react";
import React from "react";

interface BookedAppointment {
  id: number;
  appointmentId: string;
  doctorName: string;
  specialization: string;
  bookedTimeSlot: string; // E.g., "8:00 PM - 9:00 PM"
  date: string; // E.g., "2025-10-25"
  duration: string; // E.g., "60 minutes"
  imageUrl: string;
  status: "active" | "upcoming"; // Active = joinable, Upcoming = not yet joinable
  joinIn: string | null; // Time remaining for upcoming appointments
  meetingLink?: string; // Optional meeting link
}

interface BookedAppointmentProps {
  bookedAppointment: BookedAppointment;
}
export default function BookedAppointmentCard({
  bookedAppointment,
}: BookedAppointmentProps) {
  return (
    <div
      key={bookedAppointment.id}
      className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-screen mx-auto"
    >
      {/* Doctor Image */}
      <div className="w-full sm:w-auto sm:flex-shrink-0 mb-4 sm:mb-0">
        <img
          src="/src/assets/patient/doctor/doctor.png"
          alt={bookedAppointment.doctorName}
          className="w-full sm:w-40 h-auto sm:h-40 object-contain"
        />
      </div>

      {/* Appointment Details */}
      <div className="flex-1 mx-6">
        <h3 className="font-semibold text-lg text-center sm:text-left">
          {bookedAppointment.doctorName}
        </h3>
        <p className="text-sm text-gray-500 text-center sm:text-left">
          {bookedAppointment.specialization}
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mt-2 items-center sm:items-start">
          <div className="flex items-center gap-1">
            <Timer size={16} className="text-black" />
            {bookedAppointment.bookedTimeSlot}
          </div>
          <p className="text-black">
            {new Date(bookedAppointment.date).toDateString()}
          </p>
        </div>

        {/* Separator */}
        <hr className="my-4 border-1 border-black mx-auto sm:mx-0 max-w-sm sm:w-auto" />

        {/* Duration */}
        <p className="text-black text-center sm:text-left">
          <strong>Duration:</strong> {bookedAppointment.duration}
        </p>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">

        {/* use to check join call button, comment other part below --- Start */}

        {/* <a
          href={`/patient/video-preview?appointmentId=${bookedAppointment.appointmentId}`}
          className="w-full sm:w-auto px-10 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center"
        >
          <Phone size={16} className="mr-2 text-white" />
          <span>Join Call</span>
        </a> */}

      {/* use to check join call button --- End */}

        {/* Use this for actual implementation */}
        {bookedAppointment.status === "active" ? (
          <a
            // href={bookedAppointment.meetingLink}
            href={`/patient/video-preview?appointmentId=${bookedAppointment.appointmentId}`}
            className="w-full sm:w-auto px-10 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Join Call
          </a>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full sm:w-auto mt-2">
            <button className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-not-allowed">
              <div className="flex items-center justify-center text-center w-full">
                <Phone size={16} className="mr-2 text-black" />
                <span className="text-black">Join Call</span>
              </div>
            </button>
            <span className="text-teal-600 text-sm flex items-center justify-center w-full">
              Join in: <strong>{bookedAppointment.joinIn}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
