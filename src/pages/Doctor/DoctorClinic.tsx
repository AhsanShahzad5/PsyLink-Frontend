import DoctorAboutSection from "@/Components/doctor/DoctorAboutSection"
import DoctorCalender from "@/Components/doctor/DoctorCalender"
import DoctorIntro from "@/Components/doctor/DoctorIntro"
import DoctorStatsBar from "@/Components/doctor/DoctorStatsBar"

const DoctorClinic = () => {
  return (
    <>
      <div className="pt-20 max-w-[89rem] mx-auto">
        <div className="flex flex-col ">
          <DoctorIntro />
          <DoctorCalender />
          <DoctorAboutSection />
          <DoctorStatsBar/>
        </div>
      </div>

    </>
  )
}

export default DoctorClinic