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

export const PaymentsReceivedAnaytics = () => {
    const navigate = useNavigate();
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
                        className="px-4 py-1 h-[3.5rem] w-full md:w-[10.5rem] text-white bg-primary rounded-full hover:bg-teal-700"
                        onClick={() => navigate('/doctor/payment-analytics')}
                    >
                        View Details
                    </button>
                </div>
                <ul className="space-y-3">
                    {Array(4)
                        .fill(null)
                        .map((_, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center text-gray-600"
                            >
                                <span>Muhammad Shafaat Farooq</span>
                                <span className="font-medium">Rs 1400</span>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};
