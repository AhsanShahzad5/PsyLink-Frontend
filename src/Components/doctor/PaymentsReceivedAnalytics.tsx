import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react"; 
import userAtom from "@/atoms/userAtom";

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

const PaymentsReceivedAnalytics = () => {
    const navigate = useNavigate();
    const user = useRecoilValue(userAtom);
    const [payments, setPayments] = useState<PaymentType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthlyStats, setMonthlyStats] = useState({
        today: 0,
        best: 0,
        average: 0,
    });

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

                const data = await response.json();
                const allPayments = data.data;
                
                // Sort payments by date (newest first)
                const sortedPayments = allPayments?.sort((a: PaymentType, b: PaymentType) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                setPayments(sortedPayments?.slice(0, 3) || []);
                
                // Process data for the current month's chart
                processChartData(sortedPayments, currentMonth);
                
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
    }, [user, currentMonth]);

    // Process payment data for chart visualization
    const processChartData = (payments: PaymentType[], monthDate: Date) => {
        if (!payments?.length) {
            setChartData([]);
            setMonthlyStats({ today: 0, best: 0, average: 0 });
            return;
        }

        // Filter payments for the selected month
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const currentDate = new Date();
        
        // Filter payments for the selected month
        const monthPayments = payments.filter(payment => {
            const paymentDate = new Date(payment.createdAt);
            return paymentDate.getMonth() === month && paymentDate.getFullYear() === year;
        });

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
        
        // Convert to chart data format - show last 15 days or all days if less than 15
        const days = Object.keys(dailyTotals).map(Number);
        const startDay = Math.max(1, daysInMonth - 14);
        const endDay = daysInMonth;
        
        const newChartData: { name: string; value: number }[] = [];
        for (let i = startDay; i <= endDay; i++) {
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

    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-fit w-full max-w-4xl mx-auto">
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

            <div className="h-48 mb-4">
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
                <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                    {/* Left Text */}
                    <h2 className="text-base font-bold text-black mb-2 md:mb-0">Payments Received</h2>

                    {/* Right Button */}
                    <button
                        className="px-4 py-1 h-7 w-full md:w-40 text-white bg-emerald-600 rounded-full hover:bg-teal-700"
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
                                <span>{payment.patientName || payment.patientData.personalInformation.fullName}</span>
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