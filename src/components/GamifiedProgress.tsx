
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Star, Target, Users, Book } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_reward: number;
  badge_color: string;
  is_completed: boolean;
  progress: number;
  requirement_value: number;
}

interface UserStats {
  total_xp: number;
  level: number;
  streak_days: number;
  badges: string[];
  courses_completed: number;
  modules_completed: number;
  study_groups_joined: number;
}

const GamifiedProgress: React.FC = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    total_xp: 0,
    level: 1,
    streak_days: 0,
    badges: [],
    courses_completed: 0,
    modules_completed: 0,
    study_groups_joined: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
      fetchAchievements();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    try {
      // Get user gamification data
      const { data: gamification } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Get completed courses count
      const { data: completedCourses } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', user?.id)
        .not('completed_at', 'is', null);

      // Get completed modules count
      const { data: completedModules } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user?.id)
        .not('completed_at', 'is', null);

      // Get study groups count
      const { data: studyGroups } = await supabase
        .from('study_group_members')
        .select('id')
        .eq('user_id', user?.id);

      if (gamification) {
        setUserStats({
          total_xp: gamification.total_xp || 0,
          level: gamification.level || 1,
          streak_days: gamification.streak_days || 0,
          badges: gamification.badges || [],
          courses_completed: completedCourses?.length || 0,
          modules_completed: completedModules?.length || 0,
          study_groups_joined: studyGroups?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      // Get all achievements with user progress
      const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*')
        .order('points_reward', { ascending: true });

      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user?.id);

      if (allAchievements) {
        const achievementsWithProgress = allAchievements.map(achievement => {
          const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
          
          // Calculate current progress based on achievement type
          let currentProgress = 0;
          switch (achievement.requirement_type) {
            case 'courses_completed':
              currentProgress = userStats.courses_completed;
              break;
            case 'modules_completed':
              currentProgress = userStats.modules_completed;
              break;
            case 'streak_days':
              currentProgress = userStats.streak_days;
              break;
            case 'study_groups_joined':
              currentProgress = userStats.study_groups_joined;
              break;
            default:
              currentProgress = userAchievement?.progress || 0;
          }

          return {
            ...achievement,
            is_completed: userAchievement?.is_completed || false,
            progress: Math.min(currentProgress, achievement.requirement_value)
          };
        });

        setAchievements(achievementsWithProgress);

        // Get recent achievements (completed in last 30 days)
        const recentCompleted = achievementsWithProgress.filter(a => a.is_completed).slice(0, 3);
        setRecentAchievements(recentCompleted);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getXPForNextLevel = (level: number) => level * 100;
  const getCurrentLevelProgress = () => {
    const currentLevelXP = (userStats.level - 1) * 100;
    const nextLevelXP = userStats.level * 100;
    const progressXP = userStats.total_xp - currentLevelXP;
    return (progressXP / (nextLevelXP - currentLevelXP)) * 100;
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'play-circle': <Star className="h-4 w-4" />,
      'book-open': <Book className="h-4 w-4" />,
      'flame': <Flame className="h-4 w-4" />,
      'trophy': <Trophy className="h-4 w-4" />,
      'brain': <Target className="h-4 w-4" />,
      'users': <Users className="h-4 w-4" />,
      'heart': <Star className="h-4 w-4" />,
      'clock': <Target className="h-4 w-4" />,
      'graduation-cap': <Trophy className="h-4 w-4" />
    };
    return iconMap[iconName] || <Star className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading progress...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Level and XP Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Level {userStats.level}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to Level {userStats.level + 1}</span>
                <span>{userStats.total_xp} XP</span>
              </div>
              <Progress value={getCurrentLevelProgress()} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userStats.courses_completed}</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{userStats.streak_days}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{userStats.modules_completed}</div>
                <div className="text-sm text-muted-foreground">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{userStats.badges.length}</div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className={`p-2 rounded-full bg-${achievement.badge_color}-100`}>
                    {getIconComponent(achievement.icon)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">+{achievement.points_reward} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-4 border rounded-lg">
                <div className={`p-2 rounded-full ${achievement.is_completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {getIconComponent(achievement.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{achievement.name}</span>
                    {achievement.is_completed && (
                      <Badge variant="secondary" className="text-xs">Completed</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{achievement.progress} / {achievement.requirement_value}</span>
                      <span>+{achievement.points_reward} XP</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.requirement_value) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamifiedProgress;
