import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";
  import { ChevronLeft, ChevronRight } from "lucide-react";
  import { Doughnut } from "react-chartjs-2";
  import "chart.js/auto";
  
  const chartData = [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 70 },
    { name: "Wed", value: 55 },
    { name: "Thu", value: 90 },
    { name: "Fri", value: 30 },
  ];
  
  const chartDataDoctors = [
    { label: "Doctors Joined", value: 65, color: "#059669" },
    { label: "Doctors Banned", value: 20, color: "#000000" },
    { label: "Requests Pending", value: 15, color: "#FACC15" },
  ];
  
  const chartDataPatients = [
    { label: "Patients Joined", value: 75, color: "#059669" },
    { label: "Patients Banned", value: 25, color: "#000000" },
  ];
  
  const UserFeedback = () => (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h3 className="text-lg font-medium mb-2">User Feedback</h3>
      <div className="flex items-center justify-center mb-2">
        <div className="rounded-full h-16 w-16 border-4 border-teal-500 flex items-center justify-center">
          <span className="text-xl font-bold">😊</span>
        </div>
      </div>
      <p className="text-center text-sm mb-2">Users Satisfied</p>
      <p className="text-xs text-gray-600 text-center">
        We are getting positive feedback. Stay consistent and keep helping people.
      </p>
      <button className="mt-2 px-3 py-1 bg-primary text-white rounded-md w-full text-sm">
        Details
      </button>
    </div>
  );
  
  const UsersJoinedChart = () => (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h3 className="text-lg font-medium mb-2 text-center">Users Joined</h3>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis hide />
          <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex justify-between text-xs text-gray-600">
        <div>
          <span>Patients</span>
          <p className="font-bold">121</p>
        </div>
        <div>
          <span>Doctors</span>
          <p className="font-bold">28</p>
        </div>
      </div>
    </div>
  );
  
  const AnalyticsCard = ({
    title,
    chartData,
    totalVisitors,
  }: {
    title: string;
    chartData: { label: string; value: number; color: string }[];
    totalVisitors: number;
  }) => {
    const data = {
      labels: chartData.map((item) => item.label),
      datasets: [
        {
          data: chartData.map((item) => item.value),
          backgroundColor: chartData.map((item) => item.color),
          borderWidth: 0,
        },
      ],
    };
  
    const options = {
      cutout: "70%",
    };
  
    return (
      <div className="bg-white rounded-md shadow-sm p-4 flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-4">
          <h3 className="text-sm font-semibold">{title}</h3>
          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="relative w-32 h-32 mb-2">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <h1 className="text-2xl font-bold">{totalVisitors}</h1>
              <p className="text-xs text-gray-500 text-center">
                visitors this month
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-1 w-full">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const ComplaintsList = () => (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h3 className="text-lg font-medium mb-2">Complaints</h3>
      <ul className="space-y-2">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <li key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img
                  src="/src/assets/shared/user.png"
                  alt="User"
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <p className="text-xs font-medium">User</p>
                  <p className="text-xs text-gray-500">Patient</p>
                </div>
              </div>
              <button className="text-primary font-semibold text-xs hover:underline">
                Report User
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
  
  const Dashboard = () => (
    <div className="bg-secondary min-h-screen p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <UsersJoinedChart />
        </div>
        <UserFeedback />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AnalyticsCard
          title="Doctors"
          chartData={chartDataDoctors}
          totalVisitors={45623}
        />
        <AnalyticsCard
          title="Patients"
          chartData={chartDataPatients}
          totalVisitors={45623}
        />
        <ComplaintsList />
      </div>
    </div>
  );
  
  export default Dashboard;
  