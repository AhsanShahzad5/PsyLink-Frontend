import { PaymentsandReviewsChart } from "@/Components/doctor/PaymentsReviewsCharts";
import PaymentsReceivedAnaytics  from "@/Components/doctor/PaymentsReceivedAnalytics";
import { HomeUpcomingAppointments } from "@/Components/doctor/HomePageUpcomingAppointments";

const Home = () => {
    return (
        <>
            <div className="pt-[4.5rem] p-[1rem] max-w-[90rem] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-[2px]">
                    {/* Render Components */}
                    <HomeUpcomingAppointments />
                    <PaymentsReceivedAnaytics />
                    <PaymentsandReviewsChart />
                </div>
            </div>
        </>
    );
};

export default Home;
