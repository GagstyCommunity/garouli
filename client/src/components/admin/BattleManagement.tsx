
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Sword, 
  Users, 
  Trophy, 
  Calendar,
  Bot,
  Play,
  Square
} from 'lucide-react';
import { toast } from 'sonner';

interface Battle {
  id: string;
  title: string;
  prompt: string;
  theme: string;
  status: 'active' | 'completed' | 'draft';
  start_date: string;
  end_date: string;
  participants: number;
  winner?: string;
  created_at: string;
}

const BattleManagement = () => {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBattle, setNewBattle] = useState({
    title: '',
    prompt: '',
    theme: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchBattles();
  }, []);

  const fetchBattles = async () => {
    try {
      // Mock data - in real implementation, fetch from supabase
      const mockBattles: Battle[] = [
        {
          id: '1',
          title: 'React Component Challenge',
          prompt: 'Build a responsive todo app with React hooks and TypeScript',
          theme: 'Frontend Development',
          status: 'active',
          start_date: '2024-01-15',
          end_date: '2024-01-22',
          participants: 45,
          created_at: '2024-01-10'
        },
        {
          id: '2',
          title: 'AI Algorithm Battle',
          prompt: 'Create a machine learning model to predict stock prices',
          theme: 'Machine Learning',
          status: 'completed',
          start_date: '2024-01-01',
          end_date: '2024-01-08',
          participants: 23,
          winner: 'Alice Johnson',
          created_at: '2023-12-25'
        },
        {
          id: '3',
          title: 'Backend API Challenge',
          prompt: 'Design and implement a RESTful API for a social media platform',
          theme: 'Backend Development',
          status: 'draft',
          start_date: '2024-01-25',
          end_date: '2024-02-01',
          participants: 0,
          created_at: '2024-01-20'
        },
        {
          id: '4',
          title: 'Mobile App Showdown',
          prompt: 'Create a cross-platform mobile app for fitness tracking',
          theme: 'Mobile Development',
          status: 'active',
          start_date: '2024-01-18',
          end_date: '2024-01-25',
          participants: 32,
          created_at: '2024-01-15'
        },
        {
          id: '5',
          title: 'Blockchain Innovation',
          prompt: 'Build a decentralized voting system using smart contracts',
          theme: 'Blockchain',
          status: 'completed',
          start_date: '2023-12-15',
          end_date: '2023-12-22',
          participants: 18,
          winner: 'Bob Smith',
          created_at: '2023-12-10'
        }
      ];

      setBattles(mockBattles);
    } catch (error) {
      console.error('Error fetching battles:', error);
      toast.error('Failed to load battles');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBattle = () => {
    if (!newBattle.title || !newBattle.prompt) {
      toast.error('Please fill in all required fields');
      return;
    }

    const battle: Battle = {
      id: Date.now().toString(),
      ...newBattle,
      status: 'draft',
      participants: 0,
      created_at: new Date().toISOString()
    };

    setBattles([battle, ...battles]);
    setNewBattle({
      title: '',
      prompt: '',
      theme: '',
      start_date: '',
      end_date: ''
    });
    setIsAddDialogOpen(false);
    toast.success('Battle created successfully!');
  };

  const handleJudgeWithAI = (battleId: string) => {
    toast.success('AI judging initiated!', {
      description: 'AI will analyze all submissions and provide rankings'
    });
    
    // Mock AI judging
    setTimeout(() => {
      setBattles(battles.map(battle => 
        battle.id === battleId 
          ? { ...battle, winner: 'AI Selected Winner', status: 'completed' as const }
          : battle
      ));
      toast.success('AI judging completed!');
    }, 2000);
  };

  const handleDeclareWinner = (battleId: string, winner: string) => {
    setBattles(battles.map(battle => 
      battle.id === battleId 
        ? { ...battle, winner, status: 'completed' as const }
        : battle
    ));
    toast.success(`Winner declared: ${winner}`);
  };

  const filteredBattles = battles.filter(battle =>
    battle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    battle.theme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading battles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Battle Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Battle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Battle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newBattle.title}
                  onChange={(e) => setNewBattle({...newBattle, title: e.target.value})}
                  placeholder="Enter battle title"
                />
              </div>
              <div>
                <Label htmlFor="prompt">Prompt *</Label>
                <Textarea
                  id="prompt"
                  value={newBattle.prompt}
                  onChange={(e) => setNewBattle({...newBattle, prompt: e.target.value})}
                  placeholder="Describe the challenge"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  value={newBattle.theme}
                  onChange={(e) => setNewBattle({...newBattle, theme: e.target.value})}
                  placeholder="e.g., Frontend Development"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newBattle.start_date}
                    onChange={(e) => setNewBattle({...newBattle, start_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newBattle.end_date}
                    onChange={(e) => setNewBattle({...newBattle, end_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddBattle} className="flex-1">
                  Create Battle
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Battles ({battles.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search battles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBattles.map((battle) => (
              <Card key={battle.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Sword className="h-5 w-5 text-red-500" />
                        <h3 className="text-lg font-semibold">{battle.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{battle.prompt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{battle.theme}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {battle.start_date} - {battle.end_date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(battle.status)}>
                        {battle.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {battle.participants} participants
                      </div>
                      {battle.winner && (
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          Winner: {battle.winner}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {battle.status === 'active' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleJudgeWithAI(battle.id)}
                          >
                            <Bot className="h-4 w-4 text-purple-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeclareWinner(battle.id, 'Manual Winner')}
                          >
                            <Trophy className="h-4 w-4 text-yellow-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BattleManagement;
