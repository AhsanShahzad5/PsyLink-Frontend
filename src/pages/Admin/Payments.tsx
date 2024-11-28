import React from "react";
import { useNavigate } from "react-router-dom";

interface Payment {
  transactionId: string;
  doctorId: string;
  doctorName: string; // Added doctor name
  doctorBankAccount: string; // Added doctor bank account number
  patientId: string;
  patientName: string; // Added patient name
  patientBankAccount: string; // Added patient bank account number
  status: "Successful" | "Failed";
  dateTime: string;
  failureDescription?: string; // Optional field for failed transactions
}

const Payments: React.FC = () => {
  const navigate = useNavigate();

  // Sample payments data
  const paymentsData: Payment[] = [
    {
      transactionId: "T001",
      doctorId: "1",
      doctorName: "Dr. John Doe",
      doctorBankAccount: "123-456-789",
      patientId: "P001",
      patientName: "Jane Smith",
      patientBankAccount: "987-654-321",
      status: "Successful",
      dateTime: "2024-11-01 10:30 AM",
    },
    {
      transactionId: "T002",
      doctorId: "2",
      doctorName: "Dr. Emily Stone",
      doctorBankAccount: "234-567-890",
      patientId: "P002",
      patientName: "Robert Brown",
      patientBankAccount: "876-543-210",
      status: "Failed",
      dateTime: "2024-11-02 11:00 AM",
      failureDescription: "Payment gateway error",
    },
    {
      transactionId: "T003",
      doctorId: "3",
      doctorName: "Dr. Sarah Lee",
      doctorBankAccount: "345-678-901",
      patientId: "P003",
      patientName: "Lucy White",
      patientBankAccount: "765-432-109",
      status: "Successful",
      dateTime: "2024-11-03 2:30 PM",
    },
    // Add more payments here...
  ];

  // Navigate to PaymentDetail page with payment data
  const handleView = (payment: Payment) => {
    navigate("/admin/payments/payment-details", { state: payment });
  };

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg overflow-auto max-h-[470px] h-screen custom-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Payments</h1>
          <input
            type="text"
            placeholder="Search by Patient or Doctor"
            className="p-2 border rounded w-64"
          />
        </div>
        <p className="text-gray-500 mb-6">
          <span className="font-semibold">{paymentsData.length} Payments Found</span>
        </p>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal text-primary">Transaction ID</th>
              <th className="px-6 py-3 text-left text-sm font-normal text-primary">Doctor Name</th>
              <th className="px-6 py-3 text-left text-sm font-normal text-primary">Patient Name</th>
              <th className="px-6 py-3 text-left text-sm font-normal text-primary">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentsData.map((payment) => (
              <tr key={payment.transactionId}>
                <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                  {payment.transactionId}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                  {payment.doctorName}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                  {payment.patientName}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                  {payment.status}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                  <button
                    className="text-teal-500 font-normal hover:underline"
                    onClick={() => handleView(payment)}
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
  );
};

export default Payments;
