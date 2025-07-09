
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Bot, Calendar, MessageCircle, Video, Plus, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topic: string;
  members: number;
  maxMembers: number;
  isActive: boolean;
  nextSession?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  hasAIModerator: boolean;
  course?: string;
}

const StudyGroups: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'AI Fundamentals Study Circle',
      description: 'Learn machine learning basics together with AI assistance',
      topic: 'Machine Learning',
      members: 12,
      maxMembers: 15,
      isActive: true,
      nextSession: '2024-01-15T19:00:00Z',
      level: 'Beginner',
      hasAIModerator: true,
      course: 'Complete Guide to Machine Learning'
    },
    {
      id: '2',
      name: 'React Development Workshop',
      description: 'Build projects and solve coding challenges together',
      topic: 'Web Development',
      members: 8,
      maxMembers: 12,
      isActive: true,
      nextSession: '2024-01-16T18:30:00Z',
      level: 'Intermediate',
      hasAIModerator: true,
      course: 'Modern React Development'
    },
    {
      id: '3',
      name: 'Data Science Collaborative',
      description: 'Advanced data analysis and visualization techniques',
      topic: 'Data Science',
      members: 6,
      maxMembers: 10,
      isActive: true,
      nextSession: '2024-01-17T20:00:00Z',
      level: 'Advanced',
      hasAIModerator: true,
      course: 'Data Science Mastery'
    }
  ]);

  const topics = ['all', 'Machine Learning', 'Web Development', 'Data Science', 'DevOps', 'Mobile Development'];

  const filteredGroups = studyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || group.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const joinGroup = (groupId: string) => {
    setStudyGroups(prev => prev.map(group => 
      group.id === groupId && group.members < group.maxMembers
        ? { ...group, members: group.members + 1 }
        : group
    ));
    toast({
      title: "Joined study group!",
      description: "You'll receive notifications about upcoming sessions."
    });
  };

  const createGroup = () => {
    toast({
      title: "Feature coming soon!",
      description: "Study group creation will be available in the next update."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI-Powered Study Groups</h2>
          <p className="text-muted-foreground">Join collaborative learning sessions with AI moderation</p>
        </div>
        <Button onClick={createGroup}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search study groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {topics.map(topic => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTopic(topic)}
                >
                  {topic === 'all' ? 'All Topics' : topic}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map(group => (
          <Card key={group.id} className="relative overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription className="mt-1">{group.description}</CardDescription>
                </div>
                {group.hasAIModerator && (
                  <Badge variant="secondary" className="ml-2">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Moderated
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{group.topic}</Badge>
                <Badge variant="outline">{group.level}</Badge>
              </div>

              {group.course && (
                <div className="text-sm text-muted-foreground">
                  Course: {group.course}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members}/{group.maxMembers} members
                </div>
                {group.nextSession && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(group.nextSession).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => joinGroup(group.id)}
                  disabled={group.members >= group.maxMembers}
                >
                  {group.members >= group.maxMembers ? 'Full' : 'Join Group'}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{group.name}</DialogTitle>
                      <DialogDescription>Study group details and chat</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">AI Moderator Features:</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Facilitates discussions and keeps conversations on track</li>
                          <li>• Provides instant answers to technical questions</li>
                          <li>• Suggests practice problems and learning resources</li>
                          <li>• Tracks group learning progress and goals</li>
                        </ul>
                      </div>
                      <div className="text-center">
                        <Button>
                          <Video className="h-4 w-4 mr-2" />
                          Join Video Session
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No study groups found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or topic filter, or create a new study group.
            </p>
            <Button onClick={createGroup}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Group
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudyGroups;
