import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, Area } from "recharts";
  import { ChevronLeft, ChevronRight } from "lucide-react";
  import { Doughnut } from "react-chartjs-2";
  import "chart.js/auto";
  import { Gauge ,} from "@mui/x-charts/Gauge";
  import { FaSmile } from "react-icons/fa";

  const data = [
    { day: "Mon", users: 18 },
    { day: "Tue", users: 20 },
    { day: "Wed", users: 15 },
    { day: "Thu", users: 25 },
    { day: "Fri", users: 30 },
    { day: "Sat", users: 40 },
    { day: "Sun", users: 20 },
  ]; // Values for the sparkline chart
  // const gradientId = "chartGradient"; // Unique ID for the gradient

  const chartDataDoctors = [
    { label: "Doctors Joined", value: 65, color: "#02968A" },
    { label: "Doctors Banned", value: 20, color: "#000000" },
    { label: "Requests Pending", value: 15, color: "#FACC15" },
  ];
  
  const chartDataPatients = [
    { label: "Patients Joined", value: 75, color: "#02968A" },
    { label: "Patients Banned", value: 25, color: "#000000" },
    
  ];
  
  const UserFeedback = () => {
    return (
      <div className="bg-white rounded-md shadow-sm p-4">
        <h3 className="text-lg text-center font-medium mb-2">User Feedback</h3>
  
        {/* Gauge Chart */}
        <div className="relative flex flex-col items-center justify-center mb-4">
        {/* Gauge Chart */}
        <Gauge
          width={150}
          height={100}
          value={80} // Percentage value for satisfaction
          startAngle={-90}
          endAngle={90}
          cornerRadius={5}
          sx={(theme) => ({
            [`& .MuiGauge-valueArc`]: { fill: "#02968A" }, // Gauge fill color
            [`& .MuiGauge-valueText`]: { display: "none" }, // Hide the percentage text
          })}
        />
        {/* Smiley Icon */}
        <div className="absolute top-[70%] transform translate-y-[-50%]">
          <FaSmile size={24} color="#02968A" />
        </div>
      </div>
        
        {/* Satisfaction Emoji */}
         
            
        {/* Text Content */}
        <p className="text-center text-sm mb-2 font-bold">Users Satisfied</p>
        <p className="text-xs text-gray-600 text-center">
          We are getting positive feedback. Stay consistent and keep helping
          people. We Got it!
        </p>
  
        {/* Details Button */}
        <button className="mt-2 px-3 py-1 bg-primary hover:bg-primaryHover text-white rounded-md w-full text-sm">
          Details
        </button>
      </div>
    );
  };
  
  const UsersJoinedChart = () => (
    <div className="bg-white rounded-md shadow-sm p-6">
      <h3 className="text-lg font-medium mb-2 text-center">Users Joined</h3>
      <ResponsiveContainer width="100%" height={150} >
        <LineChart data={data} >
          {/* Define Gradient */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#02968A" stopOpacity={1} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          {/* X-Axis */}
          <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} interval="preserveStartEnd" />
          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#f8f9fa",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value) => [`${value} Users`, ""]}
          />
          {/* Gradient Area */}
          <Area
            type="monotone"
            dataKey="users"
            fill="url(#chartGradient)"
            stroke="none"
          />
          {/* Line */}
          <Line
            type="monotone"
            dataKey="users"
            stroke="#02968A"
            strokeWidth={3}
            dot={{ r: 4, fill: "#059669" }}
          />
        </LineChart>
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
      labels:[],
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
      borderRadius:"10",
    };
  
    return (
      <div className="bg-white rounded-md shadow-sm p-4 flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-4">
          <h3 className="text-sm font-semibold">{title}</h3>
          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-primaryHover hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded hover:bg-primaryHover hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="relative w-48 h-48 mb-8">
          <Doughnut data={data} options={options}  />
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <h1 className="text-lg font-bold text-center mt7 ">{totalVisitors}</h1>
              <p className="text-xs text-gray-500 text-center">
                visitors this month
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-1 ">
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
            <li key={index} className="flex justify-between p-3 items-center">
              <div className="flex items-center gap-2">
               <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="#ccc" />
               </svg>
                <div>
                  <p className="text-xs font-medium">User</p>
                  <p className="text-xs text-gray-500">Patient</p>
                </div>
              </div>
              <button className="text-primary font-semibold text-xs hover:underline">
                Check Request
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
  