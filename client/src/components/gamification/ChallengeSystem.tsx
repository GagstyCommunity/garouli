
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Trophy, Target, Clock, Star, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  xp_reward: number;
  progress: number;
  max_progress: number;
  expires_at: string;
  is_completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

const ChallengeSystem = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, [user]);

  const fetchChallenges = async () => {
    if (!user) return;

    try {
      // Mock challenges data until backend is implemented
      const mockChallenges: Challenge[] = [
        {
          id: '1',
          title: 'Code Streak',
          description: 'Complete 3 coding exercises today',
          type: 'daily',
          xp_reward: 50,
          progress: 2,
          max_progress: 3,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          is_completed: false,
          difficulty: 'easy'
        },
        {
          id: '2',
          title: 'Video Learner',
          description: 'Watch 2 video lessons',
          type: 'daily',
          xp_reward: 30,
          progress: 1,
          max_progress: 2,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          is_completed: false,
          difficulty: 'easy'
        },
        {
          id: '3',
          title: 'Project Master',
          description: 'Complete a full project this week',
          type: 'weekly',
          xp_reward: 200,
          progress: 0,
          max_progress: 1,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_completed: false,
          difficulty: 'hard'
        },
        {
          id: '4',
          title: 'Social Learner',
          description: 'Join 2 study groups this week',
          type: 'weekly',
          xp_reward: 100,
          progress: 1,
          max_progress: 2,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_completed: false,
          difficulty: 'medium'
        }
      ];

      setChallenges(mockChallenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || !challenge.is_completed) return;

    try {
      // Update user XP
      const { data: currentGamification } = await supabase
        .from('user_gamification')
        .select('total_xp, level')
        .eq('user_id', user?.id)
        .single();

      const newXP = (currentGamification?.total_xp || 0) + challenge.xp_reward;
      const newLevel = Math.floor(newXP / 100) + 1;

      await supabase
        .from('user_gamification')
        .update({
          total_xp: newXP,
          level: newLevel
        })
        .eq('user_id', user?.id);

      // Mark challenge as claimed
      setChallenges(prev => prev.filter(c => c.id !== challengeId));
      
      toast.success(`Earned ${challenge.xp_reward} XP!`);
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return <div className="text-center">Loading challenges...</div>;
  }

  const dailyChallenges = challenges.filter(c => c.type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Daily & Weekly Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Daily ({dailyChallenges.length})
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Weekly ({weeklyChallenges.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4 mt-6">
              {dailyChallenges.map((challenge) => (
                <Card key={challenge.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {getTimeRemaining(challenge.expires_at)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {challenge.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.max_progress}</span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.max_progress) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{challenge.xp_reward} XP</span>
                      </div>
                      
                      {challenge.progress >= challenge.max_progress ? (
                        <Button 
                          size="sm" 
                          onClick={() => claimReward(challenge.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Claim Reward
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          In Progress
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4 mt-6">
              {weeklyChallenges.map((challenge) => (
                <Card key={challenge.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {getTimeRemaining(challenge.expires_at)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {challenge.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.max_progress}</span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.max_progress) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{challenge.xp_reward} XP</span>
                      </div>
                      
                      {challenge.progress >= challenge.max_progress ? (
                        <Button 
                          size="sm" 
                          onClick={() => claimReward(challenge.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Claim Reward
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          In Progress
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeSystem;
