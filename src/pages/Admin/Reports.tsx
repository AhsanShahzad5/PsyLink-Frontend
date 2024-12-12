import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, Area } from "recharts";

// Dummy data for Users Joined chart
const userJoinedData = [
  { day: "Mon", users: 18 },
  { day: "Tue", users: 20 },
  { day: "Wed", users: 15 },
  { day: "Thu", users: 25 },
  { day: "Fri", users: 30 },
  { day: "Sat", users: 40 },
  { day: "Sun", users: 20 },
];

// Dummy data for Transactions Occurred chart
const transactionsData = [
  { day: "Mon", transactions: 100 },
  { day: "Tue", transactions: 120 },
  { day: "Wed", transactions: 80 },
  { day: "Thu", transactions: 150 },
  { day: "Fri", transactions: 200 },
  { day: "Sat", transactions: 250 },
  { day: "Sun", transactions: 180 },
];

// Component for Users Joined Chart (reference from Dashboard.tsx)
const UsersJoinedChart = () => (
  <div className="bg-white rounded-md shadow-xl border-2 p-6">
    
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={userJoinedData}>
        {/* Define Gradient (same as UsersJoinedChart in Dashboard.tsx) */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#02968A" stopOpacity={1} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        {/* X-Axis (same as UsersJoinedChart in Dashboard.tsx) */}
        <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} interval="preserveStartEnd" />
        {/* Tooltip (same as UsersJoinedChart in Dashboard.tsx) */}
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#f8f9fa",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value) => [`${value} Users`, ""]}
        />
        {/* Gradient Area (same as UsersJoinedChart in Dashboard.tsx) */}
        <Area type="monotone" dataKey="users" fill="url(#chartGradient)" stroke="none" />
        {/* Line (same as UsersJoinedChart in Dashboard.tsx) */}
        <Line type="monotone" dataKey="users" stroke="#02968A" strokeWidth={3} dot={{ r: 4, fill: "#059669" }} />
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

// Component for Transactions Occurred Chart (similar to UsersJoinedChart)
const TransactionsOccurredChart = () => (
  <div className="bg-white rounded-md shadow-xl border-2  p-6">
    
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={transactionsData}>
        {/* Define Gradient (same as UsersJoinedChart) */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#02968A" stopOpacity={1} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        {/* X-Axis (same as UsersJoinedChart) */}
        <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} interval="preserveStartEnd" />
        {/* Tooltip (same as UsersJoinedChart) */}
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#f8f9fa",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value) => [`${value} Transactions`, ""]}
        />
        {/* Gradient Area (same as UsersJoinedChart) */}
        <Area type="monotone" dataKey="transactions" fill="url(#chartGradient)" stroke="none" />
        {/* Line (same as UsersJoinedChart) */}
        <Line type="monotone" dataKey="transactions" stroke="#02968A" strokeWidth={3} dot={{ r: 4, fill: "#059669" }} />
      </LineChart>
    </ResponsiveContainer>
    <div className="mt-3 flex justify-between text-xs text-gray-600">
      <div>
        <span>Total Transactions</span>
        <p className="font-bold">1000</p>
      </div>
      <div>
        <span>Average Transactions/Day</span>
        <p className="font-bold">142</p>
      </div>
    </div>
  </div>
);

// Reports page
const Reports = () => {
  return (
    <div className="bg-secondary flex justify-center mt-6 ">
  <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg mb-8 h-screen  ">
  <h1 className="text-3xl font-semibold">View and Generate Reports</h1>
    <div className="grid grid-cols-2 gap-6 mt-24">
      <div className="w-full">
        <h3 className="text-lg font-medium mb-2 text-center">Users Joined</h3>
        <UsersJoinedChart />
        <div className="flex justify-center">
          <button className="mt-2 px-3 py-1 bg-primary hover:bg-primaryHover text-white rounded-md w-1/2 text-sm">
            Generate Report
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2 text-center">Transactions Occurred</h3>
        <TransactionsOccurredChart />
        <div className="flex justify-center">
          <button className="mt-2 px-3 py-1 bg-primary hover:bg-primaryHover text-white rounded-md w-1/2 text-sm">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default Reports;