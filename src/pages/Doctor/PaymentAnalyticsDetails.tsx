import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { ChevronLeft, ChevronRight } from "lucide-react";

const stripeIcon = "/stripe.png";

type ChartDataType = {
  name: string;
  value: number;
};

// Mock data
const chartData: ChartDataType[] = [
  { name: "10", value: 45 },
  { name: "11", value: 90 },
  { name: "12", value: 65 },
  { name: "13", value: 85 },
  { name: "14", value: 30 },
];

const payments = [
  {
    name: "Muhammad Shafaat Farooq",
    amountPaid: "Rs 1400",
    amountDue: "Rs 1400",
    paymentMethod: stripeIcon,
    phoneNumber: "+926476477474",
    date: "25th October, 2024",
  },
  {
    name: "Muhammad Shafaat Farooq",
    amountPaid: "Rs 1400",
    amountDue: "Rs 1400",
    paymentMethod: stripeIcon,
    phoneNumber: "+926476477474",
    date: "25th October, 2024",
  },
  {
    name: "Muhammad Shafaat Farooq",
    amountPaid: "Rs 1400",
    amountDue: "Rs 1400",
    paymentMethod: stripeIcon,
    phoneNumber: "+926476477474",
    date: "25th October, 2024",
  },
  {
    name: "Muhammad Shafaat Farooq",
    amountPaid: "Rs 1400",
    amountDue: "Rs 1400",
    paymentMethod: stripeIcon,
    phoneNumber: "+926476477474",
    date: "25th October, 2024",
  },
];

const PaymentsReceivedAnaytics = () => {

  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit ">
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

      <div className="h-48 mb-6 ">
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

          {/* Right Button */}
          <button className="px-4 py-1 h-[3.5rem] w-[10.5rem] text-white bg-primary rounded-full hover:bg-teal-700 rounded-2"
            onClick={() => navigate('/doctor/payment-analytics')}

          >
            View Details
          </button>
        </div>
        <ul className="space-y-3">
          {payments.map((payment, index) => (
            <li
              key={index}
              className="flex justify-between items-center text-gray-600 border-2 border-transparent rounded transition-all hover:border-primary hover:rounded-lg p-2"
            >
              <span>{payment.name}</span>
              <span className="font-medium">{payment.amountPaid}</span>
              <span className="font-medium">{payment.amountDue}</span>
              <img
                src={payment.paymentMethod}
                alt="Payment Method"
                className="h-12 w-12"
              />
              <span className="font-medium">{payment.phoneNumber}</span>
              <span className="font-medium">{payment.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PaymentAnalyticsDetails = () => {
  const navigate = useNavigate() // The useNavigate hook gives us access to the navigate function



  return (
    <div className='pt-20 max-w-[92rem] mx-auto '>

      <div className='bg-white rounded-lg p-6'>


        {/* Back button */}
        <div className="flex items-center mb-6 ">
          <button
            onClick={() => navigate(-1)} // Navigate back to the previous page
            className="flex items-center text-xl font-medium text-[#02968A]  transition-transform transform hover:scale-110 "
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
        <PaymentsReceivedAnaytics />
      </div>
    </div>
  )
}

export default PaymentAnalyticsDetails






