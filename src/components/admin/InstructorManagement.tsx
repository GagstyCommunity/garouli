
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  GraduationCap, Plus, Edit, Eye, Star, BookOpen, 
  Users, CheckCircle, XCircle, Linkedin, Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Instructor {
  id: string;
  user_id: string;
  bio: string;
  expertise_areas: string[];
  teaching_experience: number;
  total_students: number;
  average_rating: number;
  verified: boolean;
  created_at: string;
  profile: {
    full_name: string;
    email: string;
    avatar_url: string;
  };
  courses_count?: number;
}

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    user_id: '',
    bio: '',
    expertise_areas: '',
    teaching_experience: 0,
    verified: false
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const { data, error } = await supabase
        .from('instructor_profiles')
        .select(`
          *,
          profile:profiles(full_name, email, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add mock course count for demonstration
      const enrichedData = data?.map(instructor => ({
        ...instructor,
        courses_count: Math.floor(Math.random() * 10) + 1
      })) || [];

      setInstructors(enrichedData);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyInstructor = async (instructorId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('instructor_profiles')
        .update({ verified })
        .eq('id', instructorId);

      if (error) throw error;
      
      toast.success(`Instructor ${verified ? 'verified' : 'unverified'} successfully`);
      fetchInstructors();
    } catch (error) {
      console.error('Error updating instructor:', error);
      toast.error('Failed to update instructor');
    }
  };

  const handleCreateInstructor = async () => {
    try {
      const expertise = newInstructor.expertise_areas.split(',').map(area => area.trim()).filter(Boolean);
      
      const { error } = await supabase
        .from('instructor_profiles')
        .insert([{
          ...newInstructor,
          expertise_areas: expertise
        }]);

      if (error) throw error;

      toast.success('Instructor created successfully!');
      setIsCreateDialogOpen(false);
      setNewInstructor({
        user_id: '',
        bio: '',
        expertise_areas: '',
        teaching_experience: 0,
        verified: false
      });
      fetchInstructors();
    } catch (error) {
      console.error('Error creating instructor:', error);
      toast.error('Failed to create instructor');
    }
  };

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case 'verified':
        return matchesSearch && instructor.verified;
      case 'unverified':
        return matchesSearch && !instructor.verified;
      case 'experienced':
        return matchesSearch && instructor.teaching_experience >= 3;
      default:
        return matchesSearch;
    }
  });

  const getExperienceLevel = (years: number) => {
    if (years >= 5) return { label: 'Expert', color: 'bg-purple-100 text-purple-800' };
    if (years >= 3) return { label: 'Senior', color: 'bg-blue-100 text-blue-800' };
    if (years >= 1) return { label: 'Mid-level', color: 'bg-green-100 text-green-800' };
    return { label: 'Junior', color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading instructors...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          Instructor Management
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Instructor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Instructor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user_id">User ID *</Label>
                <Input
                  id="user_id"
                  value={newInstructor.user_id}
                  onChange={(e) => setNewInstructor({...newInstructor, user_id: e.target.value})}
                  placeholder="User UUID"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={newInstructor.bio}
                  onChange={(e) => setNewInstructor({...newInstructor, bio: e.target.value})}
                  placeholder="Tell us about the instructor..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="expertise_areas">Expertise Areas (comma-separated)</Label>
                <Input
                  id="expertise_areas"
                  value={newInstructor.expertise_areas}
                  onChange={(e) => setNewInstructor({...newInstructor, expertise_areas: e.target.value})}
                  placeholder="JavaScript, React, Node.js"
                />
              </div>
              <div>
                <Label htmlFor="teaching_experience">Teaching Experience (years)</Label>
                <Input
                  id="teaching_experience"
                  type="number"
                  value={newInstructor.teaching_experience}
                  onChange={(e) => setNewInstructor({...newInstructor, teaching_experience: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={newInstructor.verified}
                  onChange={(e) => setNewInstructor({...newInstructor, verified: e.target.checked})}
                />
                <Label htmlFor="verified">Pre-verified Instructor</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateInstructor} className="flex-1">
                  Add Instructor
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
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
            <CardTitle>All Instructors ({instructors.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  placeholder="Search instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Instructors</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="unverified">Unverified</TabsTrigger>
              <TabsTrigger value="experienced">Experienced</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInstructors.map((instructor) => {
                  const experienceLevel = getExperienceLevel(instructor.teaching_experience);
                  
                  return (
                    <Card key={instructor.id} className={instructor.verified ? 'border-green-200' : ''}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={instructor.profile?.avatar_url} />
                              <AvatarFallback>
                                {instructor.profile?.full_name?.substring(0, 2).toUpperCase() || 'IN'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate flex items-center gap-2">
                                {instructor.profile?.full_name || 'Unnamed Instructor'}
                                {instructor.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </p>
                              <p className="text-sm text-gray-500 truncate">{instructor.profile?.email}</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {instructor.bio || 'No bio available'}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge className={experienceLevel.color}>
                            {experienceLevel.label} ({instructor.teaching_experience}y)
                          </Badge>
                          {instructor.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        {instructor.expertise_areas && instructor.expertise_areas.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {instructor.expertise_areas.slice(0, 3).map((area) => (
                              <Badge key={area} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                            {instructor.expertise_areas.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{instructor.expertise_areas.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <BookOpen className="h-3 w-3 text-blue-500" />
                              <span className="font-medium">{instructor.courses_count || 0}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Courses</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="h-3 w-3 text-green-500" />
                              <span className="font-medium">{instructor.total_students}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Students</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="font-medium">{instructor.average_rating?.toFixed(1) || '0.0'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Linkedin className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            {instructor.verified ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyInstructor(instructor.id, false)}
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyInstructor(instructor.id, true)}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Award className="h-4 w-4 text-purple-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorManagement;
