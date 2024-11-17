import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/Doctor/LoginPage';
import DetailForm from './pages/Patient/DetailForm';
import ChooseSpecialist from './pages/Patient/ChooseSpecialist';
import HomePage from './pages/Patient/HomePage';
import NotesPage from './pages/Patient/NotesPage';
import Prescription from './pages/Patient/Prescriptions';
import ProgramDetails from './pages/Patient/ProgramDetails';
import PrescriptionPopUp from './Components/PrescriptionPopUp';

const AppRoutes = () => {

    return (
        <Routes>
            {/* general routes  */}
            <Route path='/' element={<App/> } />
            <Route path='*' element={<Navigate to='/' />} />
            <Route path='/login' element={<LoginPage/> } />
            {/* patient routes  */}     
            <Route path='/patient/detailForm' element={<DetailForm/>} />
            <Route path='/patient/chooseSpecialist' element={<ChooseSpecialist/>} />
            <Route path='/patient/Home' element={<HomePage/>} />
            <Route path='/patient/Notes' element={<NotesPage/>} />
            <Route path='/patient/history' element={<Prescription/>} />
            <Route path='/patient/program-details' element={<ProgramDetails/>} />
            <Route path='/patient/prescription' element={<PrescriptionPopUp/>} />
            
            {/* doctor routes  */}
            <Route path='/doctor/home' element={<LoginPage/> } />
        </Routes>
    )
}

export default AppRoutes;