import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const PaymentDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payment = location.state;  // Receiving the payment data

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg overflow-auto max-h-[470px] h-screen custom-scrollbar">
        {/* Back button */}
        <div className="flex items-center mb-6">
          <FaArrowLeft
            className="text-primary cursor-pointer hover:text-gray-800 mr-4"
            onClick={() => navigate("/admin/payments")}  // Navigate back to the payments page
            size={20}
          />
          <h1 className="text-3xl font-semibold">Transaction ID: {payment.transactionId}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> {/* Grid layout with 2 columns */}
          <div className="space-y-4">
            <p><strong className="text-primary font-semibold">Doctor Name:</strong> {payment.doctorName}</p>
            <p><strong className="text-primary font-semibold">Doctor Bank Account:</strong> {payment.doctorBankAccount}</p>
            <p><strong className="text-primary font-semibold">Patient Name:</strong> {payment.patientName}</p>
            <p><strong className="text-primary font-semibold">Patient Bank Account:</strong> {payment.patientBankAccount}</p>
            <p><strong className="text-primary font-semibold">Status:</strong> {payment.status}</p>
            <p><strong className="text-primary font-semibold">Transaction Date:</strong> {payment.dateTime}</p>
          </div>

          <div className="space-y-4">
            {payment.status === "Failed" && payment.failureDescription && (
              <p><strong className="text-primary font-semibold">Failure Description:</strong> {payment.failureDescription}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
