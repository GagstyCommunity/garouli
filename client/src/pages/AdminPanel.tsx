
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UserManagement from '@/components/admin/UserManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import BattleManagement from '@/components/admin/BattleManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import JobManagement from '@/components/admin/JobManagement';
import CertificateManagement from '@/components/admin/CertificateManagement';
import SEOManager from '@/components/admin/SEOManager';
import CMSEditor from '@/components/admin/CMSEditor';
import SystemLogs from '@/components/admin/SystemLogs';
import AILogs from '@/components/admin/AILogs';
import AdminRoles from '@/components/admin/AdminRoles';
import { 
  Users, 
  BookOpen, 
  Sword, 
  FileText, 
  Briefcase,
  Award,
  Search,
  Edit,
  Database,
  Bot,
  Shield,
  BarChart3
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check if user has admin role (simplified check)
  const isAdmin = user?.user_metadata?.role === 'admin';

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, component: AdminDashboard },
    { id: 'users', label: 'Users', icon: Users, component: UserManagement },
    { id: 'courses', label: 'Courses', icon: BookOpen, component: CourseManagement },
    { id: 'battles', label: 'Battles', icon: Sword, component: BattleManagement },
    { id: 'blogs', label: 'Blogs', icon: FileText, component: BlogManagement },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, component: JobManagement },
    { id: 'certificates', label: 'Certificates', icon: Award, component: CertificateManagement },
    { id: 'seo', label: 'SEO', icon: Search, component: SEOManager },
    { id: 'cms', label: 'CMS', icon: Edit, component: CMSEditor },
    { id: 'system-logs', label: 'System Logs', icon: Database, component: SystemLogs },
    { id: 'ai-logs', label: 'AI Logs', icon: Bot, component: AILogs },
    { id: 'admin-roles', label: 'Admin Roles', icon: Shield, component: AdminRoles },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Comprehensive platform management</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 lg:grid-cols-12 w-full mb-6">
            {adminTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-1 text-xs"
              >
                <tab.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {adminTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
