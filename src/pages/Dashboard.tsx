
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import StudentDashboard from "@/components/dashboards/StudentDashboard";
import InstructorDashboard from "@/components/dashboards/InstructorDashboard";
import EnhancedAdminDashboard from "@/components/dashboards/EnhancedAdminDashboard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import RecommendationEngine from "@/components/RecommendationEngine";
import GamifiedProgress from "@/components/GamifiedProgress";
import AIStudyCompanion from "@/components/AIStudyCompanion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      return data?.role || 'student';
    },
    enabled: !!user,
  });

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <EnhancedAdminDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      default:
        return (
          <div className="space-y-8">
            <StudentDashboard />
            
            <Tabs defaultValue="recommendations" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="ai-companion">AI Companion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommendations" className="space-y-6">
                <RecommendationEngine />
              </TabsContent>
              
              <TabsContent value="progress" className="space-y-6">
                <GamifiedProgress />
              </TabsContent>
              
              <TabsContent value="ai-companion" className="space-y-6">
                <AIStudyCompanion />
              </TabsContent>
            </Tabs>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
