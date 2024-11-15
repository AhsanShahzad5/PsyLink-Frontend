import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';

const AppRoutes = () => {

    return (
        <Routes>
            <Route path='/' element={<App/> } />
            <Route path='/login' element={<LoginPage/> } />
            <Route path='/doctor/home' element={<LoginPage/> } />
            <Route path='*' element={<Navigate to='/' />} />
        </Routes>
    )
}

export default AppRoutes;