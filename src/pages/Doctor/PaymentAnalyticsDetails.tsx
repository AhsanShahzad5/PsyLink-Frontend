import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
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
  isAnonymous?: boolean; // Add this field to the type
  patientData: {
    personalInformation: {
      fullName: string;
      phoneNo?: string;
    };
  };
};

const PaymentsReceivedAnalytics = () => {
  const user = useRecoilValue(userAtom);
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthlyStats, setMonthlyStats] = useState({
    today: 0,
    best: 0,
    average: 0,
  });
  const [filteredPayments, setFilteredPayments] = useState<PaymentType[]>([]);

  // Function to format the month and year for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    // Don't allow navigating past the current month
    if (nextMonth <= new Date()) {
      setCurrentMonth(nextMonth);
    }
  };

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
        const allPayments = pdata.data;

        // Sort payments by date (newest first)
        const sortedPayments = allPayments?.sort((a: PaymentType, b: PaymentType) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setPayments(sortedPayments || []);
        
        // Process payments for the current month
        processMonthData(sortedPayments, currentMonth);
        
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

  // When the selected month changes, filter payments and update chart
  useEffect(() => {
    if (payments.length > 0) {
      processMonthData(payments, currentMonth);
    }
  }, [currentMonth, payments]);

  // Process payment data for a specific month
  const processMonthData = (allPayments: PaymentType[], monthDate: Date) => {
    if (!allPayments?.length) {
      setChartData([]);
      setFilteredPayments([]);
      setMonthlyStats({ today: 0, best: 0, average: 0 });
      return;
    }

    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const currentDate = new Date();
    
    // Filter payments for the selected month
    const monthPayments = allPayments.filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate.getMonth() === month && paymentDate.getFullYear() === year;
    });

    // Update the filtered payments list for display
    setFilteredPayments(monthPayments);
    
    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Create a map to store daily totals
    const dailyTotals: { [key: string]: number } = {};
    
    // Initialize all days with zero
    for (let i = 1; i <= daysInMonth; i++) {
      dailyTotals[i] = 0;
    }
    
    // Fill in actual payment amounts by day
    monthPayments.forEach(payment => {
      const paymentDate = new Date(payment.createdAt);
      const day = paymentDate.getDate();
      dailyTotals[day] = (dailyTotals[day] || 0) + payment.amount;
    });
    
    // Convert to chart data format
    const newChartData: ChartDataType[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      newChartData.push({
        name: i.toString(),
        value: dailyTotals[i] || 0
      });
    }
    
    setChartData(newChartData);
    
    // Calculate statistics
    const today = currentDate.getDate();
    const isCurrentMonth = currentDate.getMonth() === month && currentDate.getFullYear() === year;
    const todayTotal = isCurrentMonth ? (dailyTotals[today] || 0) : 0;
    
    const allDailyValues = Object.values(dailyTotals).filter(val => val > 0);
    const bestDay = Math.max(...Object.values(dailyTotals), 0);
    const averageDaily = allDailyValues.length > 0 
      ? allDailyValues.reduce((sum, val) => sum + val, 0) / allDailyValues.length 
      : 0;
    
    setMonthlyStats({
      today: todayTotal,
      best: bestDay,
      average: Math.round(averageDaily * 100) / 100
    });
  };

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
        <h3 className="text-xl font-semibold text-gray-800">{formatMonthYear(currentMonth)}</h3>
        <div className="flex gap-2">
          <button 
            className="p-1 rounded hover:bg-gray-100"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-100"
            onClick={goToNextMonth}
            disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1) > new Date()}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="h-48 mb-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading chart data...</p>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                formatter={(value) => [`Rs ${value}`, 'Amount']}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No payment data available for this month</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Today</span>
          <span className="font-semibold">Rs {monthlyStats.today.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Best</span>
          <span className="font-semibold">Rs {monthlyStats.best.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Average</span>
          <span className="font-semibold">Rs {monthlyStats.average.toFixed(2)}</span>
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
        ) : filteredPayments.length === 0 ? (
          <div className="text-center text-gray-600 py-4">No payments found for {formatMonthYear(currentMonth)}</div>
        ) : (
          <ul className="space-y-3">
            {filteredPayments.map((payment) => (
              <li
                key={payment._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-600 border-2 border-transparent rounded transition-all hover:border-primary hover:rounded-lg p-2"
              >
                <span>{ payment.patientName || payment.patientData?.personalInformation?.fullName }</span>
                <img
                  src={stripeIcon}
                  alt="Payment Method"
                  className="h-12 w-12 hidden sm:block"
                />
                {/* Conditionally display phone number based on isAnonymous flag */}
                <span className="font-medium">
                  {payment.isAnonymous ? "-" : (payment.patientData?.personalInformation?.phoneNo || "N/A")}
                </span>
                <span className="font-medium">Rs {payment.amount}</span>
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