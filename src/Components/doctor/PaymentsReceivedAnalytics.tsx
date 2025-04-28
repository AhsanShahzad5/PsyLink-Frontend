import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react"; import userAtom from "@/atoms/userAtom";


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
            phoneNumber?: string;
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
    const navigate = useNavigate();
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

                const data = await response.json();
                const data2 = data.data;
                console.log(data2);
                
                // Sort payments by date (newest first) and take only the latest 5
                const sortedPayments = data2?.sort((a: PaymentType, b: PaymentType) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ).slice(0, 5);

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

    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-fit w-full max-w-4xl mx-auto">
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
                <div className="flex flex-col md:flex-row items-center justify-between p-4">
                    {/* Left Text */}
                    <h2 className="text-lg font-bold text-black mb-4 md:mb-0">Payments Received</h2>

                    {/* Right Button */}
                    <button
                        className="px-4 py-1 h-14 w-full md:w-40 text-white bg-emerald-600 rounded-full hover:bg-teal-700"
                        onClick={() => navigate('/doctor/payment-analytics')}
                    >
                        View Details
                    </button>
                </div>

                <ul className="space-y-3">
                    {isLoading ? (
                        <li className="text-gray-600">Loading payments...</li>
                    ) : error ? (
                        <li className="text-red-500">{error}</li>
                    ) : payments.length === 0 ? (
                        <li className="text-gray-600">No recent payments found</li>
                    ) : (
                        payments.map((payment) => (
                            <li
                                key={payment._id}
                                className="flex justify-between items-center text-gray-600"
                            >
                                <span>{payment.patientData.personalInformation.fullName}</span>
                                <span className="font-medium">Rs {payment.amount}</span>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default PaymentsReceivedAnalytics;