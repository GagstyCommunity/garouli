import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Trophy, Star, Award, Target, Crown, Zap, Fire, Shield, 
  Medal, Gift, Users, TrendingUp, Calendar, Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: string;
  earned?: boolean;
  earnedAt?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  badges: number;
  coursesCompleted: number;
  rank: number;
}

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  earnedCredits: number;
  pendingInvites: number;
}

const Gamification: React.FC = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<any>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [referralEmail, setReferralEmail] = useState('');

  useEffect(() => {
    const fetchGamificationData = async () => {
      if (!user) return;

      try {
        // Fetch user gamification stats
        const statsResponse = await apiRequest('GET', `/api/gamification/${user.id}`);
        setUserStats(statsResponse);

        // Mock badges data
        setBadges([
          {
            id: '1',
            name: 'First Steps',
            description: 'Complete your first course',
            icon: '🎯',
            category: 'Learning',
            rarity: 'common',
            requirements: 'Complete 1 course',
            earned: true,
            earnedAt: '2024-01-15'
          },
          {
            id: '2',
            name: 'Dedicated Learner',
            description: 'Complete 5 courses',
            icon: '📚',
            category: 'Learning',
            rarity: 'rare',
            requirements: 'Complete 5 courses',
            earned: true,
            earnedAt: '2024-01-20'
          },
          {
            id: '3',
            name: 'AI Pioneer',
            description: 'Complete all AI courses',
            icon: '🤖',
            category: 'Specialization',
            rarity: 'epic',
            requirements: 'Complete all AI courses',
            earned: false
          },
          {
            id: '4',
            name: 'Code Master',
            description: 'Complete 50 coding challenges',
            icon: '💻',
            category: 'Skills',
            rarity: 'legendary',
            requirements: 'Complete 50 coding challenges',
            earned: false
          },
          {
            id: '5',
            name: 'Community Helper',
            description: 'Help 10 fellow students',
            icon: '🤝',
            category: 'Community',
            rarity: 'rare',
            requirements: 'Help 10 students in discussions',
            earned: false
          },
          {
            id: '6',
            name: 'Speed Learner',
            description: 'Complete a course in under 24 hours',
            icon: '⚡',
            category: 'Achievement',
            rarity: 'epic',
            requirements: 'Finish any course within 24 hours',
            earned: false
          }
        ]);

        // Mock achievements data
        setAchievements([
          {
            id: '1',
            title: 'Course Collector',
            description: 'Complete 10 courses',
            xpReward: 500,
            progress: 3,
            maxProgress: 10,
            completed: false
          },
          {
            id: '2',
            title: 'Streak Master',
            description: 'Maintain a 30-day learning streak',
            xpReward: 1000,
            progress: 12,
            maxProgress: 30,
            completed: false
          },
          {
            id: '3',
            title: 'Perfect Score',
            description: 'Get 100% on 5 quizzes',
            xpReward: 300,
            progress: 2,
            maxProgress: 5,
            completed: false
          }
        ]);

        // Mock leaderboard data
        setLeaderboard([
          {
            id: '1',
            name: 'Sarah Chen',
            avatar: '',
            level: 15,
            xp: 12450,
            badges: 28,
            coursesCompleted: 12,
            rank: 1
          },
          {
            id: '2',
            name: 'Marcus Johnson',
            avatar: '',
            level: 14,
            xp: 11280,
            badges: 25,
            coursesCompleted: 11,
            rank: 2
          },
          {
            id: '3',
            name: 'Emma Rodriguez',
            avatar: '',
            level: 13,
            xp: 10890,
            badges: 22,
            coursesCompleted: 10,
            rank: 3
          },
          {
            id: '4',
            name: 'You',
            avatar: user.avatar || '',
            level: userStats?.level || 8,
            xp: userStats?.totalXp || 6240,
            badges: badges.filter(b => b.earned).length,
            coursesCompleted: userStats?.coursesCompleted || 3,
            rank: 8
          }
        ]);

        // Mock referral stats
        setReferralStats({
          totalReferrals: 5,
          successfulReferrals: 3,
          earnedCredits: 150,
          pendingInvites: 2
        });

      } catch (error) {
        console.error('Error fetching gamification data:', error);
      }
    };

    fetchGamificationData();
  }, [user]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/50';
      case 'rare': return 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20';
      case 'epic': return 'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20';
      case 'legendary': return 'border-orange-300 bg-orange-50 dark:border-orange-600 dark:bg-orange-900/20';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const generateCertificate = async (courseId: string) => {
    try {
      const response = await apiRequest('POST', '/api/certificates/generate', {
        courseId,
        userId: user.id
      });
      
      // Create a download link for the PDF
      const link = document.createElement('a');
      link.href = response.certificateUrl;
      link.download = `certificate-${courseId}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  const sendReferral = async () => {
    try {
      await apiRequest('POST', '/api/referrals/send', {
        email: referralEmail,
        referrerId: user.id
      });
      setReferralEmail('');
      // Refresh referral stats
    } catch (error) {
      console.error('Error sending referral:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Learning Journey</h1>
        <p className="text-muted-foreground">Track your progress, earn badges, and climb the leaderboard</p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{userStats?.level || 8}</div>
            <Progress value={((userStats?.totalXp || 6240) % 1000) / 10} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {(userStats?.totalXp || 6240) % 1000}/1000 XP to next level
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{(userStats?.totalXp || 6240).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Experience points earned</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{badges.filter(b => b.earned).length}</div>
            <p className="text-xs text-muted-foreground">Out of {badges.length} available</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Fire className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{userStats?.learningStreak || 12}</div>
            <p className="text-xs text-muted-foreground">Days learning streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <div className="space-y-8">
        {/* Badges Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Achievement Badges</h2>
            <Button variant="outline">View All</Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((badge) => (
              <Card 
                key={badge.id} 
                className={`${getRarityColor(badge.rarity)} ${badge.earned ? '' : 'opacity-60'} transition-all hover:scale-105`}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{badge.description}</p>
                  {badge.earned && (
                    <Badge variant="default" className="mt-2 text-xs">
                      Earned
                    </Badge>
                  )}
                  {!badge.earned && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {badge.rarity}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Active Achievements</h2>
          </div>
          
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Target className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Zap className="h-3 w-3" />
                            <span>{achievement.xpReward} XP</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Leaderboard Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Leaderboard</h2>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Full Leaderboard
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {leaderboard.map((entry) => (
                  <div key={entry.id} className={`flex items-center space-x-4 p-4 rounded-lg ${entry.name === 'You' ? 'bg-primary/10 border-2 border-primary/20' : 'bg-muted/30'}`}>
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="text-2xl font-bold text-muted-foreground w-8">
                        {entry.rank <= 3 ? (
                          entry.rank === 1 ? '🥇' : 
                          entry.rank === 2 ? '🥈' : '🥉'
                        ) : entry.rank}
                      </div>
                      <Avatar>
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>{entry.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">Level {entry.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{entry.xp.toLocaleString()} XP</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.badges} badges • {entry.coursesCompleted} courses
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Certificates Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Certificates</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Medal className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AI Fundamentals</h3>
                <p className="text-sm text-muted-foreground mb-4">Completed on Jan 15, 2024</p>
                <Button size="sm" onClick={() => generateCertificate('ai-fundamentals')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Medal className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">React Development</h3>
                <p className="text-sm text-muted-foreground mb-4">Completed on Jan 20, 2024</p>
                <Button size="sm" onClick={() => generateCertificate('react-dev')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Complete More Courses</h3>
                <p className="text-sm text-muted-foreground mb-4">Earn certificates by completing courses</p>
                <Button size="sm" variant="outline">Browse Courses</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Referral System */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Refer Friends</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  Referral Program
                </CardTitle>
                <CardDescription>
                  Invite friends and earn credits for both of you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{referralStats?.successfulReferrals || 0}</div>
                    <div className="text-sm text-muted-foreground">Successful referrals</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">${referralStats?.earnedCredits || 0}</div>
                    <div className="text-sm text-muted-foreground">Credits earned</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referral-email">Invite a friend</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="referral-email"
                      type="email"
                      placeholder="friend@example.com"
                      value={referralEmail}
                      onChange={(e) => setReferralEmail(e.target.value)}
                    />
                    <Button onClick={sendReferral}>Send Invite</Button>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Your referral code:</p>
                  <code className="text-sm bg-background px-2 py-1 rounded">LEARN{user?.id?.slice(-4) || '1234'}</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <p className="font-medium">Send an invite</p>
                    <p className="text-sm text-muted-foreground">Share your referral code with friends</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <p className="font-medium">They sign up</p>
                    <p className="text-sm text-muted-foreground">Your friend creates an account and enrolls in a course</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <p className="font-medium">You both earn credits</p>
                    <p className="text-sm text-muted-foreground">Get $50 credit when they complete their first course</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Gamification;