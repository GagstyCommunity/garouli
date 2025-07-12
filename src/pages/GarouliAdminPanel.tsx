
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
import BattleManagement from '@/components/admin/BattleManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import JobManagement from '@/components/admin/JobManagement';
import CertificateManagement from '@/components/admin/CertificateManagement';
import SEOManager from '@/components/admin/SEOManager';
import CMSEditor from '@/components/admin/CMSEditor';
import SystemLogs from '@/components/admin/SystemLogs';
import AILogs from '@/components/admin/AILogs';
import HackathonManagement from '@/components/admin/HackathonManagement';
import CommunityManagement from '@/components/admin/CommunityManagement';
import EventManagement from '@/components/admin/EventManagement';
import InstructorManagement from '@/components/admin/InstructorManagement';
import AgencyManagement from '@/components/admin/AgencyManagement';
import ModeratorDashboard from '@/components/admin/ModeratorDashboard';
import AIContentGenerator from '@/components/admin/AIContentGenerator';
import { 
  BarChart3, Users, BookOpen, Sword, FileText, Briefcase, Award, 
  Search, Edit, Database, Bot, Shield, Trophy, MessageSquare,
  Calendar, GraduationCap, Building2, Flag, Sparkles
} from 'lucide-react';

const GarouliAdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check if user has admin role
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'superadmin';

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const adminTabs = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3, component: EnhancedAdminDashboard, category: 'core' },
    { id: 'users', label: 'Users', icon: Users, component: UserManagement, category: 'management' },
    { id: 'instructors', label: 'Instructors', icon: GraduationCap, component: InstructorManagement, category: 'management' },
    { id: 'agencies', label: 'Agencies', icon: Building2, component: AgencyManagement, category: 'management' },
    { id: 'admin-roles', label: 'Admin Roles', icon: Shield, component: AdminRoles, category: 'system' },
    { id: 'courses', label: 'Courses', icon: BookOpen, component: CourseManagement, category: 'content' },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy, component: HackathonManagement, category: 'engagement' },
    { id: 'battles', label: 'Battles', icon: Sword, component: BattleManagement, category: 'engagement' },
    { id: 'communities', label: 'Communities', icon: MessageSquare, component: CommunityManagement, category: 'engagement' },
    { id: 'events', label: 'Events', icon: Calendar, component: EventManagement, category: 'engagement' },
    { id: 'blogs', label: 'Blogs', icon: FileText, component: BlogManagement, category: 'content' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, component: JobManagement, category: 'content' },
    { id: 'certificates', label: 'Certificates', icon: Award, component: CertificateManagement, category: 'content' },
    { id: 'moderation', label: 'Moderation', icon: Flag, component: ModeratorDashboard, category: 'moderation' },
    { id: 'ai-generator', label: 'AI Generator', icon: Sparkles, component: AIContentGenerator, category: 'ai' },
    { id: 'seo', label: 'SEO', icon: Search, component: SEOManager, category: 'system' },
    { id: 'cms', label: 'CMS', icon: Edit, component: CMSEditor, category: 'system' },
    { id: 'system-logs', label: 'System Logs', icon: Database, component: SystemLogs, category: 'system' },
    { id: 'ai-logs', label: 'AI Logs', icon: Bot, component: AILogs, category: 'ai' },
  ];

  const categories = {
    core: { label: 'Core', color: 'text-blue-600' },
    management: { label: 'Management', color: 'text-green-600' },
    content: { label: 'Content', color: 'text-purple-600' },
    engagement: { label: 'Engagement', color: 'text-orange-600' },
    moderation: { label: 'Moderation', color: 'text-red-600' },
    ai: { label: 'AI Tools', color: 'text-cyan-600' },
    system: { label: 'System', color: 'text-gray-600' }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Garouli Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Comprehensive platform management & analytics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 overflow-x-auto">
            <TabsList className="grid grid-cols-6 lg:grid-cols-19 w-full min-w-fit">
              {adminTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-1 text-xs whitespace-nowrap"
                >
                  <tab.icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Category indicators */}
          <div className="mb-6 flex flex-wrap gap-2">
            {Object.entries(categories).map(([key, category]) => (
              <div key={key} className="flex items-center gap-1 text-xs">
                <div className={`w-2 h-2 rounded-full bg-current ${category.color}`} />
                <span className={category.color}>{category.label}</span>
              </div>
            ))}
          </div>

          {adminTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                    <div className={`ml-auto text-xs px-2 py-1 rounded-full ${categories[tab.category]?.color} bg-current bg-opacity-10`}>
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
