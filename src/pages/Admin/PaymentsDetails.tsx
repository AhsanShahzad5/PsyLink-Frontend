import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

interface PaymentDetail {
  paymentId: string;
  amount: number;
  status: string;
  transactionDate: string;
  doctorName: string;
  doctorBankAccount: string;
  patientName: string;
  stripePaymentId: string;
  appointmentId: string;
}

interface PaymentResponse {
  success: boolean;
  data: PaymentDetail;
}

const PaymentDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentId } = location.state || {};
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails();
    } else {
      setError("Payment ID not found");
      setLoading(false);
    }
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: PaymentResponse = await response.json();
      
      if (data.success) {
        setPaymentDetails(data.data);
      } else {
        setError("Failed to load payment details");
      }
    } catch (err) {
      setError("Error fetching payment details");
      console.error("Error fetching payment details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg overflow-auto max-h-[470px] h-screen custom-scrollbar">
        {/* Back button */}
        <div className="flex items-center mb-6">
          <FaArrowLeft
            className="text-primary cursor-pointer hover:text-gray-800 mr-4"
            onClick={() => navigate("/admin/payments")}
            size={20}
          />
          <div className="flex-grow">
            {loading ? (
              <h1 className="text-2xl font-semibold">Loading payment details...</h1>
            ) : error ? (
              <h1 className="text-2xl font-semibold text-red-500">{error}</h1>
            ) : paymentDetails && (
              <>
                <h1 className="text-3xl font-semibold">Transaction ID: {paymentDetails.paymentId}</h1>
             
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading payment details...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            <p>{error}</p>
          </div>
        ) : paymentDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p>
                <strong className="text-primary font-semibold">Stripe Payment ID:</strong> {paymentDetails.stripePaymentId}
              </p>
              <p>
                <strong className="text-primary font-semibold">Doctor Name:</strong> {paymentDetails.doctorName}
              </p>
              <p>
                <strong className="text-primary font-semibold">Doctor Bank Account:</strong> {paymentDetails.doctorBankAccount}
              </p>
              <p>
                <strong className="text-primary font-semibold">Patient Name:</strong> {paymentDetails.patientName}
              </p>
              <p>
                <strong className="text-primary font-semibold">Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  paymentDetails.status === "completed" || paymentDetails.status === "Successful" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {paymentDetails.status}
                </span>
              </p>
              <p>
                <strong className="text-primary font-semibold">Transaction Date:</strong> {paymentDetails.transactionDate}
              </p>
              <p>
                <strong className="text-primary font-semibold">Amount:</strong> Rs.{paymentDetails.amount}
              </p>
              <p>
                <strong className="text-primary font-semibold">Appointment ID:</strong> {paymentDetails.appointmentId}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;