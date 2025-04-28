import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Payment {
  _id: string;
  doctorName: string;
  patientName: string;
  status: string;
  date: string;
  amount: number;
}

interface PaymentsResponse {
  success: boolean;
  count: number;
  data: Payment[];
}

const Payments: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/payments/getAllPayments", {
        method: "GET",
        headers: {
          
          "Content-Type": "application/json"
        } ,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: PaymentsResponse = await response.json();
      
      if (data.success) {
        setPayments(data.data);
      } else {
        setError("Failed to load payments");
      }
    } catch (err) {
      setError("Error fetching payments data");
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to PaymentDetail page with payment ID
  const handleView = (paymentId: string) => {
    navigate("/admin/payments/payment-details", { state: { paymentId } });
  };

  // Filter payments based on search term
  const filteredPayments = payments.filter(
    (payment) =>
      payment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg mb-8 h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Payments</h1>
          <input
            type="text"
            placeholder="Search by Patient or Doctor"
            className="p-2 border rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="text-gray-500 mb-6">
          <span className="font-semibold">{filteredPayments.length} Payments Found</span>
        </p>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading payments...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-auto h-[80%] custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Doctor Name</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Patient Name</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                      {payment._id}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                      {payment.doctorName}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                      {payment.patientName}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                      <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                      ${payment.amount}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                      {payment.date}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                      <button
                        className="text-teal-500 font-normal hover:underline"
                        onClick={() => handleView(payment._id)}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;