
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import AdminAuth from './pages/AdminAuth';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer';
import CategoryPage from './pages/CategoryPage';
import CreateCourse from './pages/CreateCourse';
import InstructorProfile from './pages/InstructorProfile';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import AgencySignup from './pages/AgencySignup';
import AgencyDetail from './pages/AgencyDetail';
import Battle from './pages/Battle';
import Codex from './pages/Codex';
import AdminPanel from './pages/AdminPanel';
import GarouliAdminPanel from './pages/GarouliAdminPanel';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/courses/:id/play" element={<CoursePlayer />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/instructor/:id" element={<InstructorProfile />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/agency-signup" element={<AgencySignup />} />
          <Route path="/agency/:id" element={<AgencyDetail />} />
          <Route path="/battle" element={<Battle />} />
          <Route path="/codex" element={<Codex />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/manage/admin" element={<GarouliAdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
