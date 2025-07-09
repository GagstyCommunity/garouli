
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Calendar, Users, Target, Zap, Clock, Star, Medal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Competition {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants?: number;
  prize: string;
  status: 'upcoming' | 'active' | 'completed';
  progress?: number;
  userRank?: number;
  challenges: Challenge[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed?: boolean;
  timeLimit?: number; // in minutes
}

interface LeaderboardEntry {
  rank: number;
  user: {
    name: string;
    avatar?: string;
    level: number;
  };
  score: number;
  completedChallenges: number;
  timeSpent: number; // in minutes
}

const LearningCompetitions: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('current');
  
  const [competitions, setCompetitions] = useState<Competition[]>([
    {
      id: '1',
      title: 'AI Challenge Week',
      description: 'Master machine learning fundamentals through hands-on challenges',
      category: 'Machine Learning',
      difficulty: 'Intermediate',
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-01-22T23:59:59Z',
      participants: 234,
      maxParticipants: 500,
      prize: '🏆 $500 + Certificate + Premium Course Access',
      status: 'active',
      progress: 45,
      userRank: 23,
      challenges: [
        { id: '1', title: 'Linear Regression Model', description: 'Build a linear regression model from scratch', points: 100, completed: true },
        { id: '2', title: 'Data Preprocessing', description: 'Clean and prepare a messy dataset', points: 150, completed: true },
        { id: '3', title: 'Neural Network Basics', description: 'Implement a simple neural network', points: 200, completed: false, timeLimit: 120 },
        { id: '4', title: 'Model Evaluation', description: 'Compare different ML algorithms', points: 250, completed: false, timeLimit: 90 }
      ]
    },
    {
      id: '2',
      title: 'React Speed Build',
      description: 'Build complete React applications under time pressure',
      category: 'Web Development',
      difficulty: 'Advanced',
      startDate: '2024-01-20T00:00:00Z',
      endDate: '2024-01-21T23:59:59Z',
      participants: 156,
      prize: '🥇 $300 + Featured Project Showcase',
      status: 'upcoming',
      challenges: [
        { id: '1', title: 'Component Architecture', description: 'Build reusable component library', points: 150, timeLimit: 60 },
        { id: '2', title: 'State Management', description: 'Implement complex state logic', points: 200, timeLimit: 90 },
        { id: '3', title: 'Performance Optimization', description: 'Optimize app performance', points: 250, timeLimit: 45 }
      ]
    },
    {
      id: '3',
      title: 'Data Science Hackathon',
      description: 'Analyze real-world datasets and present insights',
      category: 'Data Science',
      difficulty: 'Advanced',
      startDate: '2024-01-10T00:00:00Z',
      endDate: '2024-01-12T23:59:59Z',
      participants: 89,
      prize: '🏅 $200 + Industry Mentorship',
      status: 'completed',
      challenges: []
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, user: { name: 'Alex Chen', level: 15 }, score: 950, completedChallenges: 4, timeSpent: 180 },
    { rank: 2, user: { name: 'Sarah Johnson', level: 12 }, score: 880, completedChallenges: 4, timeSpent: 205 },
    { rank: 3, user: { name: 'Mike Rodriguez', level: 14 }, score: 820, completedChallenges: 3, timeSpent: 155 },
    { rank: 4, user: { name: 'Emma Wilson', level: 11 }, score: 780, completedChallenges: 3, timeSpent: 190 },
    { rank: 5, user: { name: 'David Kim', level: 13 }, score: 750, completedChallenges: 3, timeSpent: 210 }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600';
      case 'Intermediate': return 'text-yellow-600';
      case 'Advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const joinCompetition = (competitionId: string) => {
    setCompetitions(prev => prev.map(comp => 
      comp.id === competitionId 
        ? { ...comp, participants: comp.participants + 1 }
        : comp
    ));
    toast({
      title: "Competition joined!",
      description: "Good luck! Check your dashboard for challenge details."
    });
  };

  const timeUntilStart = (startDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const diff = start.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  const timeUntilEnd = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Learning Competitions</h2>
        <p className="text-muted-foreground">
          Challenge yourself, compete with peers, and win amazing prizes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitions.filter(comp => comp.status === 'active').map(competition => (
              <Card key={competition.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {competition.title}
                        <Badge className={`${getStatusColor(competition.status)} text-white`}>
                          {competition.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{competition.description}</CardDescription>
                    </div>
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{competition.category}</Badge>
                    <Badge variant="outline" className={getDifficultyColor(competition.difficulty)}>
                      {competition.difficulty}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Your Progress</span>
                      <span>{competition.progress}%</span>
                    </div>
                    <Progress value={competition.progress} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {competition.participants} participants
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {timeUntilEnd(competition.endDate)} left
                    </div>
                    {competition.userRank && (
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        Rank #{competition.userRank}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-1">Prize</div>
                    <div className="text-sm">{competition.prize}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Challenges ({competition.challenges.filter(c => c.completed).length}/{competition.challenges.length})</div>
                    {competition.challenges.slice(0, 2).map(challenge => (
                      <div key={challenge.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{challenge.title}</div>
                          <div className="text-xs text-muted-foreground">{challenge.points} points</div>
                        </div>
                        {challenge.completed ? (
                          <Badge variant="default" className="bg-green-500">✓</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Continue Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitions.filter(comp => comp.status === 'upcoming').map(competition => (
              <Card key={competition.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {competition.title}
                        <Badge className={`${getStatusColor(competition.status)} text-white`}>
                          {competition.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{competition.description}</CardDescription>
                    </div>
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{competition.category}</Badge>
                    <Badge variant="outline" className={getDifficultyColor(competition.difficulty)}>
                      {competition.difficulty}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {competition.participants} registered
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Starts in {timeUntilStart(competition.startDate)}
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-1">Prize</div>
                    <div className="text-sm">{competition.prize}</div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => joinCompetition(competition.id)}
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitions.filter(comp => comp.status === 'completed').map(competition => (
              <Card key={competition.id} className="border-l-4 border-l-gray-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {competition.title}
                    <Badge variant="secondary">COMPLETED</Badge>
                  </CardTitle>
                  <CardDescription>{competition.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Medal className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                    <div className="text-sm text-muted-foreground">
                      View results and winner announcements
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Results
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>Top performers across all competitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-orange-500 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {entry.rank}
                      </div>
                      <Avatar>
                        <AvatarImage src={entry.user.avatar} />
                        <AvatarFallback>{entry.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{entry.user.name}</div>
                        <div className="text-sm text-muted-foreground">Level {entry.user.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.score} pts</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.completedChallenges} challenges
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningCompetitions;
