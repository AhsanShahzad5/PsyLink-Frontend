import {
  PieChart,
  Pie,
  Cell,
} from "recharts";


const COLORS = ["#059669", "#E5E7EB"];
const pieData = [
  { name: "Spent", value: 75 },
  { name: "Remaining", value: 25 },
];

export const PaymentsandReviewsChart = () => {
  return (
      <div className="col-span-2 bg-white rounded-lg shadow-md p-2 h-fit mt-[-230px] ">
         
          <div className="flex flex-row justify-center align-middle ">
              <div className="relative h-50 ">
                  <h1>5 star reviews</h1>
                  <PieChart width={160} height={160}>
                      <Pie
                          data={pieData}
                          cx={80}
                          cy={80}
                          innerRadius={50}
                          outerRadius={70}
                          fill="#059669"
                          startAngle={90}
                          endAngle={-270}
                          paddingAngle={2}
                          dataKey="value"
                      >
                          {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                      </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-sm ">

                      <img
                          src="/src/assets/patient/homepage/Vector.png"
                          alt="User profile"
                          className="h-9 w-7"
                      />
                  </div>
                  <div className="font-semibold ">Spent $5.6K</div>
                  <div className="text-gray-500">Left $9.8K</div>
              </div>
              <div className="relative h-50 ">
                  <h1>Appointments Scheduled</h1>
                  <PieChart width={160} height={160}>
                      <Pie
                          data={pieData}
                          cx={80}
                          cy={80}
                          innerRadius={50}
                          outerRadius={70}
                          fill="#059669"
                          startAngle={90}
                          endAngle={-270}
                          paddingAngle={2}
                          dataKey="value"
                      >
                          {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                      </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-sm ">

                      <img
                          src="/src/assets/patient/homepage/Vector.png"
                          alt="User profile"
                          className="h-9 w-7"
                      />
                  </div>
                  <div className="font-semibold ">Spent $5.6K</div>
                  <div className="text-gray-500">Left $9.8K</div>
              </div>

             
          </div>
      </div>
      // </div>
  );
};



