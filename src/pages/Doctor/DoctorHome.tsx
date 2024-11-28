import { PaymentsandReviewsChart } from "@/Components/doctor/PaymentsReviewsCharts";
import { PaymentsReceivedAnaytics } from "@/Components/doctor/PaymentsReceivedAnalytics";
import { HomeUpcomingAppointments } from "@/Components/doctor/HomePageUpcomingAppointments";


const Home = () => {
  return (
      <>
          <div className="pt-20 max-w-[90rem] mx-auto">
              <div className="grid grid-cols-3 gap-4 p-1">
                  {/* Render Components */}
                 <HomeUpcomingAppointments/>
                  <PaymentsReceivedAnaytics/>
                  <PaymentsandReviewsChart />
              </div>
          </div>
      </>
  );
};

export default Home;

