
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import InstructorDashboard from '@/components/dashboards/InstructorDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import AIAssistant from '@/components/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Crown, Star, BookOpen, Users, Award, TrendingUp, MessageCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, userRole, userProfile, loading: authLoading } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalXp: 0,
    currentLevel: 1,
    streakDays: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) return;

      try {
        // Fetch user enrollments
        const { data: enrollments } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('user_id', user.id);

        // Fetch gamification data
        const { data: gamificationData } = await supabase
          .from('user_gamification')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setDashboardStats({
          totalCourses: enrollments?.length || 0,
          completedCourses: enrollments?.filter(e => e.completed_at).length || 0,
          totalXp: gamificationData?.total_xp || 0,
          currentLevel: gamificationData?.level || 1,
          streakDays: gamificationData?.streak_days || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  if (authLoading || loadingStats) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>Please sign in to view your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'instructor':
        return <InstructorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'enterprise':
        return <StudentDashboard isEnterprise={true} />;
      default:
        return <StudentDashboard />;
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const name = userProfile?.full_name || user.email?.split('@')[0] || 'Learner';
    
    return `${greeting}, ${name}!`;
  };

  const getLevelProgress = () => {
    const currentLevelXp = (dashboardStats.currentLevel - 1) * 1000;
    const nextLevelXp = dashboardStats.currentLevel * 1000;
    const progress = ((dashboardStats.totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{getWelcomeMessage()}</h1>
              <p className="opacity-90">
                Ready to continue your learning journey?
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  Level {dashboardStats.currentLevel}
                </Badge>
                {userRole && (
                  <Badge className="bg-white text-yellow-600">
                    {userRole === 'enterprise' ? 'Agency' : userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-2xl font-bold">{dashboardStats.totalCourses}</div>
                <div className="text-sm opacity-80">Enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{dashboardStats.completedCourses}</div>
                <div className="text-sm opacity-80">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{dashboardStats.totalXp}</div>
                <div className="text-sm opacity-80">XP Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{dashboardStats.streakDays}</div>
                <div className="text-sm opacity-80">Day Streak</div>
              </div>
            </div>
          </div>
          
          {/* Level Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Level {dashboardStats.currentLevel}</span>
              <span>Level {dashboardStats.currentLevel + 1}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${getLevelProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {renderDashboard()}
      </div>

      {/* AI Assistant Floating Button */}
      <Button
        onClick={() => setShowAIAssistant(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />
    </div>
  );
};

export default Dashboard;
