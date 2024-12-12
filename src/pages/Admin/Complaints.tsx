// Queries.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Query } from "./data/interfaces";


const Complaints: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Pending" | "Ongoing">("Pending");

  const pendingQueries: Query[] = [
    {
      complaintId: "C001",
      complainBy: { patientId: "P001", patientName: "Jane Smith" },
      type: "Billing Issue",
      description: "Incorrect billing amount for the last appointment.",
      images: ["https://via.placeholder.com/100"],
      status: "Pending",
      dateTime: "2024-11-20 09:15 AM",
    },
    {
      complaintId: "C001",
      complainBy: { patientId: "P001", patientName: "Jane Smith" },
      type: "Billing Issue",
      description: "Incorrect billing amount for the last appointment.",
      images: ["https://via.placeholder.com/100"],
      status: "Pending",
      dateTime: "2024-11-20 09:15 AM",
    },
    {
      complaintId: "C001",
      complainBy: { patientId: "P001", patientName: "Jane Smith" },
      type: "Billing Issue",
      description: "Incorrect billing amount for the last appointment.",
      images: ["https://via.placeholder.com/100"],
      status: "Pending",
      dateTime: "2024-11-20 09:15 AM",
    },
    {
      complaintId: "C001",
      complainBy: { patientId: "P001", patientName: "Jane Smith" },
      type: "Billing Issue",
      description: "Incorrect billing amount for the last appointment.",
      images: ["https://via.placeholder.com/100"],
      status: "Pending",
      dateTime: "2024-11-20 09:15 AM",
    },
    {
      complaintId: "C001",
      complainBy: { patientId: "P001", patientName: "Jane Smith" },
      type: "Billing Issue",
      description: "Incorrect billing amount for the last appointment.",
      images: ["https://via.placeholder.com/100"],
      status: "Pending",
      dateTime: "2024-11-20 09:15 AM",
    },
    {
      complaintId: "C001",
      complainBy: { patientId: "P001", patientName: "Jane Smith" },
      type: "Billing Issue",
      description: "Incorrect billing amount for the last appointment.",
      images: ["https://via.placeholder.com/100"],
      status: "Pending",
      dateTime: "2024-11-20 09:15 AM",
    },
    {
      complaintId: "C001",
      complainBy: { patientId: "P001", patientName: "Jane Smith" },
      type: "Billing Issue",
      description: "Incorrect billing amount for the last appointment.",
      images: ["https://via.placeholder.com/100"],
      status: "Pending",
      dateTime: "2024-11-20 09:15 AM",
    },
    {
      complaintId: "C001",
      complainBy: { patientId: "P001", patientName: "Jane Smith" },
      type: "Billing Issue",
      description: "Incorrect billing amount for the last appointment.",
      images: ["https://via.placeholder.com/100"],
      status: "Pending",
      dateTime: "2024-11-20 09:15 AM",
    },
    {
      complaintId: "C001",
      complainBy: { patientId: "P001", patientName: "Jane Smith" },
      type: "Billing Issue",
      description: "Incorrect billing amount for the last appointment.",
      images: ["https://via.placeholder.com/100"],
      status: "Pending",
      dateTime: "2024-11-20 09:15 AM",
    },
    {
      complaintId: "C001",
      complainBy: { patientId: "P001", patientName: "Jane Smith" },
      type: "Billing Issue",
      description: "Incorrect billing amount for the last appointment.",
      images: ["https://via.placeholder.com/100"],
      status: "Pending",
      dateTime: "2024-11-20 09:15 AM",
    },
    {
      complaintId: "C002",
      complainBy: { doctorId: "D001", doctorName: "Dr. John Doe" },
      type: "Technical Issue",
      description: "Unable to access the patient records system.",
      images: ["https://via.placeholder.com/100"],
      status: "Pending",
      dateTime: "2024-11-21 02:30 PM",
    },
  ];

  const ongoingQueries: Query[] = [
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C003",
      complainBy: { patientId: "P002", patientName: "Robert Brown" },
      type: "Appointment Scheduling",
      description: "Difficulty in rescheduling the appointment.",
      images: [],
      status: "Ongoing",
      dateTime: "2024-11-22 11:00 AM",
    },
    {
      complaintId: "C004",
      complainBy: { doctorId: "D002", doctorName: "Dr. Emily Stone" },
      type: "Payment Issue",
      description: "Delayed payment for services rendered.",
      images: ["https://via.placeholder.com/100"],
      status: "Ongoing",
      dateTime: "2024-11-23 04:45 PM",
    },
  ];

  const handleView = (query: Query) => {
    navigate("/admin/complaints/complaint-details", { state: query });
  };

  const displayedQueries = activeTab === "Pending" ? pendingQueries : ongoingQueries;

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white h-screen rounded-lg mb-8 shadow-lg">
        {/* Tabs */}
        <h1 className="text-3xl font-semibold  mb-6">{activeTab} Queries</h1>
        <div className="mb-4">
          <nav className="flex justify-around">
            <button
              className={`flex py-3 px-3 text-center border-b-2 font-medium text-lg ${
                activeTab === "Pending"
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("Pending")}
            >
              Pending
            </button>
            <button
              className={`flex py-3 px-3  text-center border-b-2 font-medium text-lg ${
                activeTab === "Ongoing"
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("Ongoing")}
            >
              Ongoing
            </button>
          </nav>
        </div>

        {/* Header */}
       

        {/* Queries Table */}
        <div className="overflow-auto h-[80%] custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-normal text-primary">Complaint ID</th>
                <th className="px-6 py-3 text-left text-sm font-normal text-primary">Complain By</th>
                <th className="px-6 py-3 text-left text-sm font-normal text-primary">Type</th>
                <th className="px-6 py-3 text-left text-sm font-normal text-primary">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedQueries.map((query) => (
                <tr key={query.complaintId}>
                  <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                    {query.complaintId}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                    {"patientId" in query.complainBy
                      ? query.complainBy.patientName
                      : query.complainBy.doctorName}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                    {query.type}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                    <button
                      className="text-teal-500 font-normal hover:underline"
                      onClick={() => handleView(query)}
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

export default Complaints;
