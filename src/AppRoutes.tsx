import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import DetailForm from './pages/Patient/DetailForm';
import ChooseSpecialist from './pages/Patient/ChooseSpecialist';
import HomePage from './pages/Patient/HomePage';
import NotesPage from './pages/Patient/NotesPage';
import Prescription from './pages/Patient/Prescriptions';

const AppRoutes = () => {

    return (
        <Routes>
            <Route path='/' element={<App/> } />
            <Route path='/login' element={<LoginPage/> } />
            <Route path='*' element={<Navigate to='/' />} />
            <Route path='/patient/detailForm' element={<DetailForm/>} />
            <Route path='/patient/chooseSpecialist' element={<ChooseSpecialist/>} />
            <Route path='/patient/Home' element={<HomePage/>} />
            <Route path='/patient/Notes' element={<NotesPage/>} />
            <Route path='/patient/history' element={<Prescription/>} />
        </Routes>
    )
}

export default AppRoutes;