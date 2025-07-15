
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import AdminAuth from '@/pages/AdminAuth';
import AdminPanel from '@/pages/AdminPanel';
import GarouliAdminPanel from '@/pages/GarouliAdminPanel';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import CoursePlayer from '@/pages/CoursePlayer';
import CreateCourse from '@/pages/CreateCourse';
import Jobs from '@/pages/Jobs';
import JobDetail from '@/pages/JobDetail';
import Battle from '@/pages/Battle';
import Codex from '@/pages/Codex';
import CategoryPage from '@/pages/CategoryPage';
import InstructorProfile from '@/pages/InstructorProfile';
import AgencyDetail from '@/pages/AgencyDetail';
import AgencySignup from '@/pages/AgencySignup';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/admin/panel" element={<AdminPanel />} />
            <Route path="/manage/admin" element={<GarouliAdminPanel />} />
            
            {/* Course Routes */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/courses/:id/learn" element={<CoursePlayer />} />
            <Route path="/create-course" element={<CreateCourse />} />
            
            {/* Category Routes */}
            <Route path="/categories/:slug" element={<CategoryPage />} />
            
            {/* Job Routes */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            
            {/* Other Routes */}
            <Route path="/battle" element={<Battle />} />
            <Route path="/codex" element={<Codex />} />
            <Route path="/instructors/:id" element={<InstructorProfile />} />
            <Route path="/agencies/:id" element={<AgencyDetail />} />
            <Route path="/agency/signup" element={<AgencySignup />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
        <Sonner />
      </Router>
    </AuthProvider>
  );
}

export default App;
