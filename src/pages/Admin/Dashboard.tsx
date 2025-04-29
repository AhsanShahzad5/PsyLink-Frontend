import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, Area } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { Gauge } from "@mui/x-charts/Gauge";
import { FaSmile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Loader } from "lucide-react";

// Types
interface Doctor {
  _id: string;
  status: string;
  personalDetails?: {
    fullName: string;
  };
}

interface Patient {
  _id: string;
  userId: string;
  personalInformation?: {
    fullName: string;
  };
}

interface Appointment {
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  date: string;
  time: string;
  paymentStatus: string;
}

interface Complaint {
  _id: string;
  userId: string;
  userName: string;
  userRole: string;
  issueType: "Payment Issue" | "Psync Harrasment Issue" | "Session Issue";
  issueDescription: string;
  issueImg: string;
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
  date: Date;
}

interface UserJoinedData {
  day: string;
  users: number;
}

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full w-full">
    <Loader className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const UserFeedback = () => {
  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h3 className="text-lg text-center font-medium mb-2">User Feedback</h3>

      {/* Gauge Chart */}
      <div className="relative flex flex-col items-center justify-center mb-4">
        <Gauge
          width={150}
          height={100}
          value={80} // Percentage value for satisfaction
          startAngle={-90}
          endAngle={90}
          cornerRadius={5}
          sx={(theme) => ({
            [`& .MuiGauge-valueArc`]: { fill: "#02968A" },
            [`& .MuiGauge-valueText`]: { display: "none" },
          })}
        />
        {/* Smiley Icon */}
        <div className="absolute top-[70%] transform translate-y-[-50%]">
          <FaSmile size={24} color="#02968A" />
        </div>
      </div>

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

const UsersJoinedChart = ({ patientCount, doctorCount, weeklyData }: { patientCount: number, doctorCount: number, weeklyData: UserJoinedData[] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (weeklyData && weeklyData.length > 0) {
      setLoading(false);
    }
  }, [weeklyData]);

  return (
    <div className="bg-white rounded-md shadow-sm p-6">
      <h3 className="text-lg font-medium mb-2 text-center">Users Joined</h3>

      {loading ? (
        <div className="h-[150px]">
          <LoadingSpinner />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={weeklyData}>
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
      )}

      <div className="mt-3 flex justify-between text-xs text-gray-600">
        <div>
          <span>Patients</span>
          <p className="font-bold">{patientCount}</p>
        </div>
        <div>
          <span>Doctors</span>
          <p className="font-bold">{doctorCount}</p>
        </div>
      </div>
    </div>
  );
};

const AnalyticsCard = ({
  title,
  chartData,
  totalVisitors,
  loading,
}: {
  title: string;
  chartData: { label: string; value: number; color: string }[];
  totalVisitors: number;
  loading: boolean;
}) => {
  const data = {
    labels: [],
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
    borderRadius: "10",
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

      {loading ? (
        <div className="w-48 h-48 mb-8 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="relative w-48 h-48 mb-8">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <h1 className="text-lg font-bold text-center mt7">{totalVisitors}</h1>
              <p className="text-xs text-gray-500 text-center">
                visitors this month
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1">
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

const ComplaintsList = ({ complaints }: { complaints: Complaint[] }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (complaints !== undefined) {
      setLoading(false);
    }
  }, [complaints]);

  // Display only the most recent 4 complaints
  const recentComplaints = complaints?.slice(0, 4) || [];

  // Map issue types to shorter display text
  const getIssueTypeShort = (issueType: string) => {
    switch (issueType) {
      case "Payment Issue": return "Payment";
      case "Psync Harrasment Issue": return "Harassment";
      case "Session Issue": return "Session";
      default: return issueType;
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h3 className="text-lg font-medium mb-2">Complaints</h3>

      {loading ? (
        <div className="h-[200px]">
          <LoadingSpinner />
        </div>
      ) : (
        <ul className="space-y-2">
          {recentComplaints.map((complaint, index) => (
            <li key={complaint._id || index} className="flex justify-between p-3 items-center">
              <div className="flex items-center gap-2">
              
                <div>
                  <p className="text-xs font-medium">{complaint.userName}</p>
                  <p className="text-xs text-gray-500">
                    {complaint.userRole} • {getIssueTypeShort(complaint.issueType)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/complaints')}
                className="text-primary font-semibold text-xs hover:underline"
              >
                Check Request
              </button>
            </li>
          ))}

          {recentComplaints.length === 0 && (
            <li className="p-3 text-center text-gray-500 text-sm">
              No pending complaints found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const Dashboard = () => {
  // State for all data
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState({
    doctors: true,
    patients: true,
    appointments: true,
    complaints: true,
    weeklyData: true
  });
  const [weeklyData, setWeeklyData] = useState<UserJoinedData[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/admin/doctors');
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        } else {
          console.error('Failed to fetch doctors');
        }
        setLoading(prev => ({ ...prev, doctors: false }));
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(prev => ({ ...prev, doctors: false }));
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/admin/patients');
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          console.error('Failed to fetch patients');
        }
        setLoading(prev => ({ ...prev, patients: false }));
      } catch (error) {
        console.error('Error fetching patients:', error);
        setLoading(prev => ({ ...prev, patients: false }));
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/admin/appointments');
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          console.error('Failed to fetch appointments');
        }
        setLoading(prev => ({ ...prev, appointments: false }));
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(prev => ({ ...prev, appointments: false }));
      }
    };

    const fetchComplaints = async () => {
      try {
        const response = await fetch('/api/complaints/pending');
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success && responseData.data) {
            setComplaints(responseData.data);
          } else {
            console.error('Failed to fetch complaints: Invalid response format');
          }
        } else {
          console.error('Failed to fetch complaints');
        }
        setLoading(prev => ({ ...prev, complaints: false }));
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setLoading(prev => ({ ...prev, complaints: false }));
      }
    };

    fetchDoctors();
    fetchPatients();
    fetchAppointments();
    fetchComplaints();
  }, []);

  // Generate weekly data from patients and doctors creation dates
  useEffect(() => {
    if (!loading.doctors && !loading.patients) {
      // Create a map of days to count users
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dayMap = new Map(days.map(day => [day, 0]));

      // Process patient data - this is a simplified approach for demo purposes
      // In a real app, you'd need to process actual dates from the backend
      patients.forEach((patient, index) => {
        const dayIndex = index % 7; // Just for demo distribution
        const day = days[dayIndex];
        dayMap.set(day, (dayMap.get(day) || 0) + 1);
      });

      // Add doctors to the count
      doctors.forEach((doctor, index) => {
        const dayIndex = index % 7; // Just for demo distribution
        const day = days[dayIndex];
        dayMap.set(day, (dayMap.get(day) || 0) + 1);
      });

      // Convert map to array structure needed for the chart
      const weekData = days.map(day => ({
        day,
        users: dayMap.get(day) || 0
      }));

      setWeeklyData(weekData);
      setLoading(prev => ({ ...prev, weeklyData: false }));
    }
  }, [loading.doctors, loading.patients, doctors, patients]);

  // Calculate stats for doctor analytics
  const doctorStats = {
    total: doctors.length,
    verified: doctors.filter(d => d.status === 'verified').length,
    pending: doctors.filter(d => d.status === 'pending').length,
  };

  // Chart data for doctors
  const doctorChartData = [
    { label: "Doctors Verified", value: doctorStats.verified, color: "#02968A" },
    { label: "Pending Requests", value: doctorStats.pending, color: "#FACC15" },
    { label: "Inactive Doctors", value: doctors.length > 0 ? Math.max(1, doctors.length - doctorStats.verified - doctorStats.pending) : 1, color: "#000000" },
  ];

  // Chart data for patients
  const patientChartData = [
    { label: "Active Patients", value: patients.length > 0 ? Math.floor(patients.length * 0.75) : 75, color: "#02968A" },
    { label: "Inactive Patients", value: patients.length > 0 ? Math.ceil(patients.length * 0.25) : 25, color: "#000000" },
  ];

  // Monthly visitors calculation (simplified for demo)
  const monthlyVisitors = patients.length + doctors.length;

  return (
    <div className="bg-secondary min-h-screen p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <UsersJoinedChart
            patientCount={patients.length}
            doctorCount={doctors.length}
            weeklyData={weeklyData}
          />
        </div>
        <UserFeedback />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AnalyticsCard
          title="Doctors"
          chartData={doctorChartData}
          totalVisitors={doctorStats.total}
          loading={loading.doctors}
        />
        <AnalyticsCard
          title="Patients"
          chartData={patientChartData}
          totalVisitors={patients.length}
          loading={loading.patients}
        />
        <ComplaintsList complaints={complaints} />
      </div>
    </div>
  );
};

export default Dashboard;