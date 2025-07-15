
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, 
  Star, 
  Flame, 
  BookOpen, 
  Users, 
  Target,
  Award,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Temporary type definitions until schema is updated
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  points_reward: number;
  badge_color: string;
  progress?: number;
  is_completed?: boolean;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  member_count: number;
  course_title?: string;
}

interface UserStats {
  total_xp: number;
  level: number;
  streak_days: number;
  courses_completed: number;
  modules_completed: number;
  study_groups_joined: number;
}

const GamifiedProgress = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    total_xp: 0,
    level: 1,
    streak_days: 0,
    courses_completed: 0,
    modules_completed: 0,
    study_groups_joined: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      // Fetch user gamification data
      const { data: gamificationData } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (gamificationData) {
        setUserStats(prev => ({
          ...prev,
          total_xp: gamificationData.total_xp || 0,
          level: gamificationData.level || 1,
          streak_days: gamificationData.streak_days || 0
        }));
      }

      // Fetch completed courses count
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);

      // Fetch study groups (temporarily using a mock approach until schema is updated)
      const mockStudyGroups: StudyGroup[] = [
        {
          id: '1',
          name: 'ML Fundamentals Study Group',
          description: 'Weekly discussions on machine learning concepts',
          member_count: 8,
          course_title: 'Machine Learning Fundamentals'
        },
        {
          id: '2',
          name: 'Deep Learning Practitioners',
          description: 'Advanced deep learning project collaboration',
          member_count: 6,
          course_title: 'Deep Learning Essentials'
        }
      ];

      setStudyGroups(mockStudyGroups);

      // Fetch achievements (temporarily using a mock approach)
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          name: 'First Steps',
          description: 'Complete your first course module',
          icon: 'play-circle',
          requirement_type: 'modules_completed',
          requirement_value: 1,
          points_reward: 10,
          badge_color: 'green',
          progress: 100,
          is_completed: true
        },
        {
          id: '2',
          name: 'Knowledge Seeker',
          description: 'Complete 5 course modules',
          icon: 'book-open',
          requirement_type: 'modules_completed',
          requirement_value: 5,
          points_reward: 50,
          badge_color: 'blue',
          progress: 60,
          is_completed: false
        },
        {
          id: '3',
          name: 'Dedicated Learner',
          description: 'Maintain a 7-day learning streak',
          icon: 'flame',
          requirement_type: 'streak_days',
          requirement_value: 7,
          points_reward: 75,
          badge_color: 'orange',
          progress: 85,
          is_completed: false
        }
      ];

      setAchievements(mockAchievements);

      setUserStats(prev => ({
        ...prev,
        courses_completed: enrollments?.length || 0,
        study_groups_joined: mockStudyGroups.length
      }));

    } catch (error) {
      console.error('Error fetching user progress:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const getXPForNextLevel = (currentLevel: number) => {
    return currentLevel * 100; // Simple formula: each level requires 100 more XP
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'play-circle': BookOpen,
      'book-open': BookOpen,
      'flame': Flame,
      'trophy': Trophy,
      'users': Users,
      'target': Target,
      'award': Award,
      'star': Star
    };
    return iconMap[iconName] || BookOpen;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading your progress...</div>
      </div>
    );
  }

  const xpForNextLevel = getXPForNextLevel(userStats.level);
  const xpProgress = (userStats.total_xp % xpForNextLevel) / xpForNextLevel * 100;

  return (
    <div className="space-y-6">
      {/* User Level and XP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">Level {userStats.level}</div>
              <div className="text-sm text-muted-foreground">
                {userStats.total_xp} XP • {xpForNextLevel - (userStats.total_xp % xpForNextLevel)} XP to next level
              </div>
            </div>
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg">
                {user?.user_metadata?.full_name?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          <Progress value={xpProgress} className="h-2" />
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userStats.courses_completed}</div>
              <div className="text-sm text-muted-foreground">Courses Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{userStats.streak_days}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{userStats.study_groups_joined}</div>
              <div className="text-sm text-muted-foreground">Study Groups</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon);
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.is_completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className={`h-6 w-6 ${achievement.is_completed ? 'text-green-600' : 'text-gray-400'}`} />
                    <Badge 
                      variant={achievement.is_completed ? 'default' : 'secondary'}
                      style={{ backgroundColor: achievement.is_completed ? achievement.badge_color : undefined }}
                    >
                      {achievement.points_reward} XP
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{achievement.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
                  <div className="space-y-2">
                    <Progress value={achievement.progress || 0} className="h-1" />
                    <div className="text-xs text-muted-foreground">
                      {achievement.progress || 0}% Complete
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Study Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Your Study Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studyGroups.map((group) => (
              <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                  {group.course_title && (
                    <p className="text-xs text-blue-600 mt-1">Course: {group.course_title}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <Users className="h-4 w-4 inline mr-1" />
                    {group.member_count} members
                  </div>
                  <Button variant="outline" size="sm">
                    View Group
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm">Continue Learning</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Users className="h-6 w-6" />
              <span className="text-sm">Find Study Group</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Target className="h-6 w-6" />
              <span className="text-sm">Set Goals</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamifiedProgress;
