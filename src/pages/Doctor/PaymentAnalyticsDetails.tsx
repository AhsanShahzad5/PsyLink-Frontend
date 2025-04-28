import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { ChevronLeft, ChevronRight } from "lucide-react";
import userAtom from '@/atoms/userAtom';

const stripeIcon = "/stripe.png";

type ChartDataType = {
  name: string;
  value: number;
};

type PaymentType = {
  _id: string;
  patientName: string;
  amount: number;
  createdAt: string;
  patientData: {
    personalInformation: {
      fullName: string;
      phoneNo?: string;
    };
  };
};

// Mock data
const chartData: ChartDataType[] = [
  { name: "10", value: 45 },
  { name: "11", value: 90 },
  { name: "12", value: 65 },
  { name: "13", value: 85 },
  { name: "14", value: 30 },
];

const PaymentsReceivedAnalytics = () => {
  const user = useRecoilValue(userAtom);
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8000/api/payments/doctor`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include',
      });
        
        if (!response.ok) {
          throw new Error('Failed to fetch payment data');
        }
        
        const pdata = await response.json();
        const data = pdata.data;

        // Sort payments by date (newest first) and take only the latest 5
        const sortedPayments = data?.sort((a: PaymentType, b: PaymentType) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        
        setPayments(sortedPayments);
        setError(null);
      } catch (err) {
        setError('Error fetching payment data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user._id) {
      fetchPayments();
    }
  }, [user]);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    // Add ordinal suffix to day
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">March 2023</h3>
        <div className="flex gap-2">
          <button className="p-1 rounded hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={12}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Today</span>
          <span className="font-semibold">$45.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Best</span>
          <span className="font-semibold">$90.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Average</span>
          <span className="font-semibold">$65.00</span>
        </div>
      </div>
      <div className="mt-2 border-t pt-2">
        <div className="flex items-center justify-between p-4">
          {/* Left Text */}
          <h2 className="text-lg font-bold text-black">Payments Received</h2>
        </div>

        {/* Payment List */}
        {isLoading ? (
          <div className="text-center py-4">Loading payments...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : payments.length === 0 ? (
          <div className="text-center text-gray-600 py-4">No recent payments found</div>
        ) : (
          <ul className="space-y-3">
            {payments.map((payment) => (
              <li
                key={payment._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-600 border-2 border-transparent rounded transition-all hover:border-primary hover:rounded-lg p-2"
              >
                <span>{payment.patientData?.personalInformation?.fullName || payment.patientName}</span>
                <img
                  src={stripeIcon}
                  alt="Payment Method"
                  className="h-12 w-12 hidden sm:block"
                />
                <span className="font-medium">{payment.patientData?.personalInformation?.phoneNo || "N/A"}</span>
                <span className="font-medium">{payment.amount || "N/A"}</span>
                <span className="font-medium">{formatDate(payment.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const PaymentAnalyticsDetails = () => {
  const navigate = useNavigate() // The useNavigate hook gives us access to the navigate function

  return (
    <div className='pt-20 max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8'>

      <div className='bg-white rounded-lg p-6'>

        {/* Back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)} // Navigate back to the previous page
            className="flex items-center text-xl font-medium text-[#02968A] transition-transform transform hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Back
          </button>
        </div>
        <PaymentsReceivedAnalytics />
      </div>
    </div>
  )
}

export default PaymentAnalyticsDetails