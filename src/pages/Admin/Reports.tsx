import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, Area } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Loader } from "lucide-react";

// Types
interface Payment {
  _id: string;
  doctorName: string;
  patientName: string;
  status: string;
  date: string;
  amount: number;
}

interface UserJoinedData {
  day: string;
  users: number;
}

interface TransactionData {
  day: string;
  transactions: number;
}

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full w-full">
    <Loader className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Component for Users Joined Chart (from Dashboard.tsx)
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

// Component for Transactions Occurred Chart
const TransactionsOccurredChart = ({ transactionsData, totalTransactions, averageTransactionsPerDay }: { 
  transactionsData: TransactionData[],
  totalTransactions: number,
  averageTransactionsPerDay: number
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transactionsData && transactionsData.length > 0) {
      setLoading(false);
    }
  }, [transactionsData]);

  return (
    <div className="bg-white rounded-md shadow-xl border-2 p-6">
      {loading ? (
        <div className="h-[150px]">
          <LoadingSpinner />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={transactionsData}>
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
              formatter={(value) => [`${value} Transactions`, ""]}
            />
            {/* Gradient Area */}
            <Area
              type="monotone"
              dataKey="transactions"
              fill="url(#chartGradient)"
              stroke="none"
            />
            {/* Line */}
            <Line
              type="monotone"
              dataKey="transactions"
              stroke="#02968A"
              strokeWidth={3}
              dot={{ r: 4, fill: "#059669" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="mt-3 flex justify-between text-xs text-gray-600">
        <div>
          <span>Total Transactions</span>
          <p className="font-bold">{totalTransactions}</p>
        </div>
        <div>
          <span>Average Transactions/Day</span>
          <p className="font-bold">{averageTransactionsPerDay}</p>
        </div>
      </div>
    </div>
  );
};

// Types for users data from Dashboard
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

// Reports page
const Reports = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState({
    payments: true,
    doctors: true,
    patients: true,
    weeklyData: true
  });
  const [weeklyData, setWeeklyData] = useState<UserJoinedData[]>([]);
  const [transactionsData, setTransactionsData] = useState<TransactionData[]>([]);
  const [stats, setStats] = useState({
    patientCount: 0,
    doctorCount: 0,
    totalTransactions: 0,
    averageTransactionsPerDay: 0
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('/api/payments/getAllPayments');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setPayments(result.data);
            processPaymentData(result.data);
          } else {
            console.error('Failed to fetch payments: Invalid response format');
          }
        } else {
          console.error('Failed to fetch payments');
        }
        setLoading(prev => ({ ...prev, payments: false }));
      } catch (error) {
        console.error('Error fetching payments:', error);
        setLoading(prev => ({ ...prev, payments: false }));
      }
    };

    // Fetch doctors data (same as in Dashboard.tsx)
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

    // Fetch patients data (same as in Dashboard.tsx)
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

    fetchPayments();
    fetchDoctors();
    fetchPatients();
  }, []);

  // Generate weekly data from patients and doctors creation dates (from Dashboard.tsx)
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
      
      // Update patient and doctor count stats
      setStats(prev => ({
        ...prev,
        patientCount: patients.length,
        doctorCount: doctors.length
      }));
    }
  }, [loading.doctors, loading.patients, doctors, patients]);

  // Process payment data to generate transactions chart data
  const processPaymentData = (paymentData: Payment[]) => {
    if (!paymentData || paymentData.length === 0) {
      setTransactionsData([]);
      return;
    }

    // Create a map for days of the week to count transactions
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayMap = new Map(daysOfWeek.map(day => [day, 0]));
    
    // Count transactions per day (this is simplified for demo)
    // In a real app, you'd process actual dates from the payments
    paymentData.forEach((payment, index) => {
      const dayIndex = index % 7; // Just for demo distribution
      const day = daysOfWeek[dayIndex];
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    });

    // Convert map to array for the chart
    const transData = daysOfWeek.map(day => ({
      day,
      transactions: dayMap.get(day) || 0
    }));

    setTransactionsData(transData);
    
    // Calculate stats
    const totalTransactions = paymentData.length;
    const averagePerDay = Math.round(totalTransactions / 7); // Simplified calculation
    
    setStats(prev => ({
      ...prev,
      totalTransactions,
      averageTransactionsPerDay: averagePerDay
    }));
  };

  // Function to handle generating reports
  const handleGenerateReport = (reportType: string) => {
    console.log(`Generating ${reportType} report...`);
    // This would typically connect to a backend endpoint to generate a PDF or CSV
    alert(`Your ${reportType} report is being generated and will be available for download shortly.`);
  };

  return (
    <div className="bg-secondary flex justify-center mt-6">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg mb-8 h-screen">
        <h1 className="text-3xl font-semibold">View and Generate Reports</h1>
        
        {loading.payments || loading.doctors || loading.patients ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 mt-24">
            <div className="w-full">
              <UsersJoinedChart 
                patientCount={stats.patientCount} 
                doctorCount={stats.doctorCount} 
                weeklyData={weeklyData} 
              />
              <div className="flex justify-center">
                {/* <button 
                  className="mt-2 px-3 py-1 bg-primary hover:bg-primaryHover text-white rounded-md w-1/2 text-sm"
                  onClick={() => handleGenerateReport('Users')}
                >
                  Generate Report
                </button> */}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-center">Transactions Occurred</h3>
              <TransactionsOccurredChart 
                transactionsData={transactionsData}
                totalTransactions={stats.totalTransactions}
                averageTransactionsPerDay={stats.averageTransactionsPerDay}
              />
              <div className="flex justify-center">
                {/* <button 
                  className="mt-2 px-3 py-1 bg-primary hover:bg-primaryHover text-white rounded-md w-1/2 text-sm"
                  onClick={() => handleGenerateReport('Transactions')}
                >
                  Generate Report
                </button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;