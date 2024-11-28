import { HomeUpcomingAppointments } from '@/Components/doctor/HomePageUpcomingAppointments'
import OngoingAppointments from '@/Components/doctor/OngoingAppointments'

const DoctorAppointments = () => {
  return (
    <>
      <div className="pt-20 max-w-[90rem] mx-auto">
        <div className="grid grid-cols-2 gap-4 p-1">
          <OngoingAppointments />
          <HomeUpcomingAppointments />

        </div>
      </div>
    </>
  )
}

export default DoctorAppointments