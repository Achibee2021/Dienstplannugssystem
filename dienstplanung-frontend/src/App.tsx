
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import EmployeePage from './pages/EmployeePage';
import WeeklyPlanPage from './pages/WeeklyPlanPage';
import StationPage from './pages/StationsPage';
import TimeslotPage from './pages/TimeslotPage';
import AssignmentPage from './pages/AssignmentPage';
import DashboardPage from './pages/DashboardPage';
import { AppShell } from './components/layout/AppShell';

function App() {
  return (
    <AppShell>
      <Routes>
          <Route path='/' element={<Navigate to="/dashboard" replace/>}/>
          <Route path='/dashboard' element={<DashboardPage/>}/>
          <Route path='/employees' element={<EmployeePage/>}/>
          <Route path='/plan' element={<WeeklyPlanPage/>}/>
          <Route path='/stations' element={<StationPage />}/>
          <Route path='/timeslots' element={<TimeslotPage />}/>
          <Route path='/assignments' element={<AssignmentPage />}/>
      </Routes>
    </AppShell>
  );
}

export default App
