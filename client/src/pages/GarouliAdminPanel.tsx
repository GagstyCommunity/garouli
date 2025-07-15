
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EnhancedAdminDashboard from '@/components/dashboards/EnhancedAdminDashboard';
import UserManagement from '@/components/admin/UserManagement';
import AdminRoles from '@/components/admin/AdminRoles';
import CourseManagement from '@/components/admin/CourseManagement';
import ModuleManagement from '@/components/admin/ModuleManagement';
import ExamManagement from '@/components/admin/ExamManagement';
import BattleManagement from '@/components/admin/BattleManagement';
import HackathonManagement from '@/components/admin/HackathonManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import JobManagement from '@/components/admin/JobManagement';
import CertificateManagement from '@/components/admin/CertificateManagement';
import SEOManager from '@/components/admin/SEOManager';
import CMSEditor from '@/components/admin/CMSEditor';
import SystemLogs from '@/components/admin/SystemLogs';
import AILogs from '@/components/admin/AILogs';
import CommunityManagement from '@/components/admin/CommunityManagement';
import EventManagement from '@/components/admin/EventManagement';
import InstructorManagement from '@/components/admin/InstructorManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import AgencyManagement from '@/components/admin/AgencyManagement';
import ModeratorDashboard from '@/components/admin/ModeratorDashboard';
import AIContentGenerator from '@/components/admin/AIContentGenerator';
import { 
  BarChart3, Users, BookOpen, Sword, FileText, Briefcase, Award, 
  Search, Edit, Database, Bot, Shield, Trophy, MessageSquare,
  Calendar, GraduationCap, Building2, Flag, Sparkles, BookOpenCheck,
  ClipboardCheck, Layers, Crown, TrendingUp, Wrench, FileCheck
} from 'lucide-react';

const GarouliAdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const { isAdmin } = useAuth();
  
  // Check if user has admin role
  const hasAdminAccess = isAdmin();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!hasAdminAccess) {
    return <Navigate to="/dashboard" />;
  }

  const adminTabs = [
    // Core Management
    { id: 'dashboard', label: 'Overview', icon: BarChart3, component: EnhancedAdminDashboard, category: 'core' },
    
    // User & Role Management
    { id: 'users', label: 'Users', icon: Users, component: UserManagement, category: 'users' },
    { id: 'instructors', label: 'Instructors', icon: GraduationCap, component: InstructorManagement, category: 'users' },
    { id: 'agencies', label: 'Agencies', icon: Building2, component: AgencyManagement, category: 'users' },
    { id: 'admin-roles', label: 'Admin Roles', icon: Shield, component: AdminRoles, category: 'users' },
    
    // Course & Content Management
    { id: 'categories', label: 'Categories', icon: Layers, component: CategoryManagement, category: 'content' },
    { id: 'courses', label: 'Courses', icon: BookOpen, component: CourseManagement, category: 'content' },
    { id: 'modules', label: 'Modules', icon: Layers, component: ModuleManagement, category: 'content' },
    { id: 'exams', label: 'Exams', icon: ClipboardCheck, component: ExamManagement, category: 'content' },
    { id: 'blogs', label: 'Blogs', icon: FileText, component: BlogManagement, category: 'content' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, component: JobManagement, category: 'content' },
    
    // Engagement & Activities
    { id: 'hackathons', label: 'Hackathons', icon: Trophy, component: HackathonManagement, category: 'engagement' },
    { id: 'battles', label: 'Battles', icon: Sword, component: BattleManagement, category: 'engagement' },
    { id: 'communities', label: 'Communities', icon: MessageSquare, component: CommunityManagement, category: 'engagement' },
    { id: 'events', label: 'Events', icon: Calendar, component: EventManagement, category: 'engagement' },
    
    // Certificates & Recognition
    { id: 'certificates', label: 'Certificates', icon: Award, component: CertificateManagement, category: 'recognition' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown, component: () => <div>Leaderboard Management</div>, category: 'recognition' },
    
    // Moderation & Safety
    { id: 'moderation', label: 'Moderation', icon: Flag, component: ModeratorDashboard, category: 'moderation' },
    { id: 'reports', label: 'Reports', icon: FileCheck, component: () => <div>Reports & Flags</div>, category: 'moderation' },
    
    // AI & Automation
    { id: 'ai-generator', label: 'AI Generator', icon: Sparkles, component: AIContentGenerator, category: 'ai' },
    { id: 'ai-logs', label: 'AI Logs', icon: Bot, component: AILogs, category: 'ai' },
    
    // System & Configuration
    { id: 'seo', label: 'SEO', icon: Search, component: SEOManager, category: 'system' },
    { id: 'cms', label: 'CMS', icon: Edit, component: CMSEditor, category: 'system' },
    { id: 'system-logs', label: 'System Logs', icon: Database, component: SystemLogs, category: 'system' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, component: () => <div>Advanced Analytics</div>, category: 'system' },
    { id: 'settings', label: 'Settings', icon: Wrench, component: () => <div>System Settings</div>, category: 'system' },
  ];

  const categories = {
    core: { label: 'Core', color: 'text-blue-600 bg-blue-50' },
    users: { label: 'User Management', color: 'text-green-600 bg-green-50' },
    content: { label: 'Content', color: 'text-purple-600 bg-purple-50' },
    engagement: { label: 'Engagement', color: 'text-orange-600 bg-orange-50' },
    recognition: { label: 'Recognition', color: 'text-yellow-600 bg-yellow-50' },
    moderation: { label: 'Moderation', color: 'text-red-600 bg-red-50' },
    ai: { label: 'AI Tools', color: 'text-cyan-600 bg-cyan-50' },
    system: { label: 'System', color: 'text-gray-600 bg-gray-50' }
  };

  // Group tabs by category for better organization
  const groupedTabs = Object.keys(categories).map(categoryKey => ({
    category: categoryKey,
    ...categories[categoryKey],
    tabs: adminTabs.filter(tab => tab.category === categoryKey)
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Garouli Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive platform management, content creation, and analytics
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Welcome back, {user.email}</span>
            <span>•</span>
            <span>Role: {user.user_metadata?.role || 'Admin'}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Tab Navigation */}
          <div className="mb-6 overflow-x-auto">
            <TabsList className="grid grid-cols-6 lg:grid-cols-25 w-full min-w-fit gap-1">
              {adminTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-1 text-xs whitespace-nowrap px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <tab.icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Category Overview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Management Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {groupedTabs.map(({ category, label, color, tabs }) => (
                <div key={category} className={`p-3 rounded-lg border ${color}`}>
                  <div className="text-xs font-medium mb-1">{label}</div>
                  <div className="text-xs opacity-75">{tabs.length} tools</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {adminTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                    <div className={`ml-auto text-xs px-2 py-1 rounded-full ${categories[tab.category]?.color}`}>
                      {categories[tab.category]?.label}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <tab.component />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default GarouliAdminPanel;
