
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import EmployeePage from './pages/EmployeePage';
import WeeklyPlanPage from './pages/WeeklyPlanPage';
import StationPage from './pages/StationsPage';
import TimeslotPage from './pages/TimeslotPage';
import AssignmentPage from './pages/AssignmentPage';
import DashboardPage from './pages/DashboardPage';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider } from './features/auth/AuthContext';
import LoginPage from './pages/LoginPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import {Toaster} from "react-hot-toast"
import MonthPlanPage from './pages/MonthPlanPage';

function App() {
  return (
    <AuthProvider>
      <AppShell>
        <Toaster position='top-right' toastOptions={{duration: 6000}}/>
        <Routes>
          <Route path='/login' element={<LoginPage />}/>
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Navigate to="/dashboard" replace/>}/>
            <Route path='/dashboard' element={<DashboardPage/>}/>
            <Route path='/employees' element={<EmployeePage/>}/>
            <Route path='/plan' element={<WeeklyPlanPage/>}/>
            <Route path='/stations' element={<StationPage />}/>
            <Route path='/timeslots' element={<TimeslotPage />}/>
            <Route path='/assignments' element={<AssignmentPage />}/>
            <Route path='plan/month' element={<MonthPlanPage />}/>
          </Route>
        </Routes>
      </AppShell>
    </AuthProvider>
  );
}

export default App
