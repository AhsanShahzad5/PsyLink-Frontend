import userAtom from "@/atoms/userAtom"
import PrescriptionPopUp from "@/Components/patient/PrescriptionPopUp"
import PatientLayout from "@/layouts/PatientLayout"
import AIChatbotPage from "@/pages/Patient/AIChatbot"
import ChooseSpecialist from "@/pages/Patient/ChooseSpecialist"
import DetailForm from "@/pages/Patient/DetailForm"
import DoctorDetails from "@/pages/Patient/DoctorDetails"
import DoctorReviewPage from "@/pages/Patient/DoctorReview"
import ExerciseDetails from "@/pages/Patient/ExerciseDetails"
import HomePage from "@/pages/Patient/HomePage"
import NotesPage from "@/pages/Patient/NotesPage"
import Prescription from "@/pages/Patient/Prescriptions"
import ProgramDetails from "@/pages/Patient/ProgramDetails"
import VideoConsulation from "@/pages/Patient/VideoConsulation"
import ProgramsPage from "@/pages/Patient/Programs"
import ExploreDoctor from "@/pages/Patient/Bookings"

import PsyncHomePage from "@/pages/Psync/PsyncHomePage"
import { Files } from "lucide-react"
import { Navigate, Route } from "react-router-dom"
import { useRecoilValue } from "recoil"


const PatientRoutes = () => {

    const user = useRecoilValue(userAtom);
    <>

        {/* -----------------------------------------------------PATIENT ROUTES-------------------------------------------------------------------  */}

        <Route path='/patient/detailForm' element={<PatientLayout> <DetailForm /> </PatientLayout>} />
        <Route path='/patient/chooseSpecialist' element={<ChooseSpecialist />} />
        <Route path='/patient/home'
            element={user && user.role === 'patient' ? <>
                <PatientLayout><HomePage /> </PatientLayout>
            </> : <Navigate to='/login' />
            }
        />
        <Route path='/patient/notes' element={<PatientLayout> <NotesPage /> </PatientLayout>} />
        <Route path='/patient/history' element={<PatientLayout> <Prescription /> </PatientLayout>} />
        <Route path='/patient/program-details' element={<PatientLayout> <ProgramDetails /> </PatientLayout>} />
        <Route path='/patient/prescription' element={<PrescriptionPopUp />} />
        <Route path='/patient/bookings' element={<PatientLayout> <ExploreDoctor /> </PatientLayout>} />
        <Route path='/patient/video-consultation' element={<VideoConsulation />} />
        <Route path='/patient/doctor-review' element={<PatientLayout> <DoctorReviewPage /> </PatientLayout>} />
        <Route path='/patient/doctor-details' element={<PatientLayout> <DoctorDetails /> </PatientLayout>} />
        <Route path='/patient/Allen' element={<PatientLayout> <AIChatbotPage /> </PatientLayout>} />
        <Route path='/patient/Programs' element={<PatientLayout> <ProgramsPage /> </PatientLayout>} />
        <Route path='/patient/exercise-details' element={<PatientLayout> <ExerciseDetails /> </PatientLayout>} />
        <Route path='/patient/files' element={<PatientLayout> <Files /> </PatientLayout>} />
        <Route path='/patient/psync' element={<PatientLayout> <PsyncHomePage /> </PatientLayout>} />

    </>
}

export default PatientRoutes;