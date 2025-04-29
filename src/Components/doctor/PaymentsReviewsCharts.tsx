import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaSpinner } from 'react-icons/fa';

// Define interfaces for our data
interface ReviewStats {
  total: number;
  fiveStarCount: number;
  averageRating: number;
}

interface Payment {
  _id: string;
  amount: number;
  status: string;
  date: string;
}

export const PaymentsandReviewsChart: React.FC = () => {
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    total: 0,
    fiveStarCount: 0,
    averageRating: 0
  });
  
  const [paymentCount, setPaymentCount] = useState<number>(0);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(true);
  const [loadingPayments, setLoadingPayments] = useState<boolean>(true);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);
  const [errorPayments, setErrorPayments] = useState<string | null>(null);

  // Fetch review data
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        // Using the new endpoint for chart data
        const response = await fetch(`http://localhost:8000/api/doctor/reviews/chart`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.status}`);
        }

        const data = await response.json();
        
        // Set statistics
        setReviewStats({
          total: data.total || 0,
          fiveStarCount: data.fiveStarCount || 0,
          averageRating: data.averageRating || 0
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching reviews';
        setErrorReviews(errorMessage);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);

  // Fetch payment data
  useEffect(() => {
    const fetchPayments = async () => {
      setLoadingPayments(true);
      try {
        const response = await fetch('http://localhost:8000/api/payments/doctor', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch payments: ${response.status}`);
        }

        const data = await response.json();
        
        // Set the total number of payments
        setPaymentCount(data.count || 0);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching payments';
        setErrorPayments(errorMessage);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, []);

  // Calculate review pie data
  const reviewPieData = [
    { name: "5 Star Reviews", value: reviewStats.fiveStarCount },
    { name: "Other Reviews", value: reviewStats.total - reviewStats.fiveStarCount }
  ];

  // Calculate appointments pie data (based on payments)
  const appointmentsPieData = [
    { name: "Scheduled", value: paymentCount }, // Each payment represents a scheduled appointment
    { name: "Remaining", value: Math.max(100 - paymentCount, 0) } // Just for visualization
  ];

  const COLORS = ["#059669", "#E5E7EB"];

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Loading component
  const Loading = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <FaSpinner className="animate-spin text-2xl text-[#059669]" />
    </div>
  );

  // Error component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-red-500 text-sm text-center mt-2">
      {message}
    </div>
  );

  return (
    <div className="col-span-2 bg-white rounded-lg shadow-md p-2 h-fit md:mt-[-300px] sm:[mt-0]">
      <div className="flex flex-col md:flex-row justify-center items-center">
        {/* 5 Star Reviews Chart */}
        <div className="relative h-50 m-4">
          <h1 className="text-center">5 star reviews</h1>
          <div className="relative">
            <PieChart width={160} height={160}>
              <Pie
                data={reviewPieData}
                cx={80}
                cy={80}
                innerRadius={50}
                outerRadius={70}
                fill="#059669"
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
              >
                {reviewPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
            
            {loadingReviews && <Loading />}
            
            {!loadingReviews && !errorReviews && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-sm">
                <img
                  src="/src/assets/patient/homepage/Vector.png"
                  alt="User profile"
                  className="h-9 w-7"
                />
              </div>
            )}
          </div>
          
          {errorReviews ? (
            <ErrorMessage message={errorReviews} />
          ) : (
            <>
              <div className="font-semibold text-center">
                {loadingReviews ? "Loading..." : `${reviewStats.fiveStarCount} Five Star`}
              </div>
              <div className="text-gray-500 text-center">
                {loadingReviews ? "" : `Total ${reviewStats.total} Reviews`}
              </div>
            </>
          )}
        </div>
        
        {/* Appointments Scheduled Chart (based on payments) */}
        <div className="relative h-50 m-4">
          <h1 className="text-center">Appointments Scheduled</h1>
          <div className="relative">
            <PieChart width={160} height={160}>
              <Pie
                data={appointmentsPieData}
                cx={80}
                cy={80}
                innerRadius={50}
                outerRadius={70}
                fill="#059669"
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
              >
                {appointmentsPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
            
            {loadingPayments && <Loading />}
            
            {!loadingPayments && !errorPayments && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-sm">
                <img
                  src="/src/assets/patient/homepage/Vector.png"
                  alt="User profile"
                  className="h-9 w-7"
                />
              </div>
            )}
          </div>
          
          {errorPayments ? (
            <ErrorMessage message={errorPayments} />
          ) : (
            <>
              <div className="font-semibold text-center">
                {loadingPayments ? "Loading..." : `${paymentCount} Appointments`}
              </div>
              <div className="text-gray-500 text-center">
                {loadingPayments ? "" : "Keep Working Hard"}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};