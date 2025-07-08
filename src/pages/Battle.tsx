
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Clock, 
  Users, 
  Zap, 
  Target, 
  Award,
  ThumbsUp,
  MessageCircle,
  Share2,
  Calendar,
  Crown
} from 'lucide-react';
import Navigation from '@/components/Navigation';

const Battle = () => {
  const [promptText, setPromptText] = useState('');
  const [selectedBattle, setSelectedBattle] = useState(null);

  const activeBattles = [
    {
      id: 1,
      title: "Best AI Email Assistant Prompt",
      description: "Create the most effective prompt for an AI email assistant",
      deadline: "2024-01-15",
      prize: "$500",
      participants: 143,
      category: "Productivity",
      difficulty: "Intermediate",
      status: "active"
    },
    {
      id: 2,
      title: "Creative Writing Prompt Master",
      description: "Design a prompt that generates engaging story beginnings",
      deadline: "2024-01-12",
      prize: "$300",
      participants: 89,
      category: "Creative",
      difficulty: "Advanced",
      status: "active"
    },
    {
      id: 3,
      title: "Data Analysis Automation",
      description: "Create a prompt for automated data analysis and insights",
      deadline: "2024-01-18",
      prize: "$750",
      participants: 67,
      category: "Analytics",
      difficulty: "Expert",
      status: "active"
    }
  ];

  const pastWinners = [
    {
      id: 1,
      title: "Social Media Content Creator",
      winner: "Alex Chen",
      prize: "$1000",
      prompt: "Create engaging social media posts that...",
      votes: 234,
      category: "Marketing"
    },
    {
      id: 2,
      title: "Code Review Assistant",
      winner: "Sarah Johnson",
      prize: "$500",
      prompt: "Review this code and provide suggestions...",
      votes: 189,
      category: "Development"
    },
    {
      id: 3,
      title: "Learning Path Generator",
      winner: "Mike Rodriguez",
      prize: "$750",
      prompt: "Create a personalized learning path for...",
      votes: 156,
      category: "Education"
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Alex Chen", points: 2340, badges: ["🏆", "⭐", "🔥"] },
    { rank: 2, name: "Sarah Johnson", points: 1890, badges: ["🥈", "⭐", "💎"] },
    { rank: 3, name: "Mike Rodriguez", points: 1560, badges: ["🥉", "⭐"] },
    { rank: 4, name: "Emily Davis", points: 1320, badges: ["⭐"] },
    { rank: 5, name: "David Kim", points: 1200, badges: ["🔥"] }
  ];

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Trophy className="h-16 w-16 text-yellow-300 mr-4" />
              <h1 className="text-5xl font-bold">Prompt Battle Arena</h1>
            </div>
            <p className="text-xl mb-8 opacity-90">
              Compete with the best prompt engineers and win amazing prizes
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <Zap className="h-5 w-5 mr-2" />
                Join Battle
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                View Rules
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active Battles</TabsTrigger>
            <TabsTrigger value="submit">Submit Prompt</TabsTrigger>
            <TabsTrigger value="winners">Past Winners</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBattles.map((battle) => (
                <Card key={battle.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{battle.category}</Badge>
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        {getTimeRemaining(battle.deadline)} days left
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{battle.title}</CardTitle>
                    <CardDescription>{battle.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          <span className="font-semibold text-lg">{battle.prize}</span>
                        </div>
                        <Badge variant="outline">{battle.difficulty}</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{battle.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{battle.deadline}</span>
                        </div>
                      </div>

                      <Button className="w-full">
                        <Target className="h-4 w-4 mr-2" />
                        Enter Battle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Prompt</CardTitle>
                <CardDescription>
                  Choose an active battle and submit your best prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="battle-select">Select Battle</Label>
                  <select 
                    id="battle-select"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Choose a battle...</option>
                    {activeBattles.map((battle) => (
                      <option key={battle.id} value={battle.id}>
                        {battle.title} - {battle.prize}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt-title">Prompt Title</Label>
                  <Input
                    id="prompt-title"
                    placeholder="Give your prompt a catchy title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt-text">Your Prompt</Label>
                  <Textarea
                    id="prompt-text"
                    placeholder="Enter your prompt here..."
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    rows={8}
                  />
                  <div className="text-sm text-gray-500">
                    {promptText.length}/1000 characters
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">How it Works (Optional)</Label>
                  <Textarea
                    id="explanation"
                    placeholder="Explain your approach and why this prompt is effective..."
                    rows={4}
                  />
                </div>

                <Button className="w-full" size="lg">
                  <Zap className="h-5 w-5 mr-2" />
                  Submit Prompt
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="winners" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastWinners.map((winner) => (
                <Card key={winner.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{winner.category}</Badge>
                      <div className="flex items-center space-x-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        <span className="font-semibold">{winner.prize}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{winner.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-blue-500" />
                        <span className="font-semibold">Winner: {winner.winner}</span>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm italic">"{winner.prompt}"</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <ThumbsUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{winner.votes} votes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Prompt Engineers</CardTitle>
                <CardDescription>
                  Rankings based on battle wins and community votes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div key={user.rank} className={`flex items-center justify-between p-4 rounded-lg ${
                      user.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' :
                      user.rank === 2 ? 'bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200' :
                      user.rank === 3 ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200' :
                      'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-500 text-white' :
                          user.rank === 2 ? 'bg-gray-400 text-white' :
                          user.rank === 3 ? 'bg-orange-500 text-white' :
                          'bg-gray-300 text-gray-700'
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.points} points</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {user.badges.map((badge, index) => (
                          <span key={index} className="text-xl">{badge}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Battle;
