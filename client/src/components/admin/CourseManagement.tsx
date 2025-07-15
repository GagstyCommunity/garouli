import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Upload
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  short_description: string;
  long_description: string;
  category: string;
  difficulty: string;
  duration_hours: number;
  student_count: number;
  rating: number;
  thumbnail_url: string;
  instructor_id: string;
  price: number;
  is_free: boolean;
  has_certification: boolean;
  status: string;
  created_at: string;
  tags: string[];
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  video_url: string;
  duration_minutes: number;
  is_preview: boolean;
}

const CourseManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [courseForm, setCourseForm] = useState({
    title: '',
    short_description: '',
    long_description: '',
    category: '',
    difficulty: 'beginner',
    duration_hours: 0,
    thumbnail_url: '',
    price: 0,
    is_free: true,
    has_certification: true,
    status: 'active',
    tags: ''
  });

  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    video_url: '',
    duration_minutes: 0,
    is_preview: false
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          ...courseForm,
          tags: courseForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          student_count: 0,
          rating: 5.0,
          instructor_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      setCourses([data, ...courses]);
      setShowCreateCourse(false);
      setCourseForm({
        title: '',
        short_description: '',
        long_description: '',
        category: '',
        difficulty: 'beginner',
        duration_hours: 0,
        thumbnail_url: '',
        price: 0,
        is_free: true,
        has_certification: true,
        status: 'active',
        tags: ''
      });

      toast({
        title: "Success",
        description: "Course created successfully",
      });
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    }
  };

  const handleCreateModule = async () => {
    if (!selectedCourse) return;

    try {
      const { data, error } = await supabase
        .from('course_modules')
        .insert([{
          ...moduleForm,
          course_id: selectedCourse.id,
          order_index: modules.length + 1
        }])
        .select()
        .single();

      if (error) throw error;

      setModules([...modules, data]);
      setShowCreateModule(false);
      setModuleForm({
        title: '',
        description: '',
        video_url: '',
        duration_minutes: 0,
        is_preview: false
      });

      toast({
        title: "Success",
        description: "Module created successfully",
      });
    } catch (error) {
      console.error('Error creating module:', error);
      toast({
        title: "Error",
        description: "Failed to create module",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      setCourses(courses.filter(course => course.id !== courseId));
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (courseId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', courseId);

      if (error) throw error;

      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, status: newStatus } : course
      ));

      toast({
        title: "Success",
        description: "Course status updated",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading courses...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Dialog open={showCreateCourse} onOpenChange={setShowCreateCourse}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                    placeholder="Enter course title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={courseForm.category} onValueChange={(value) => setCourseForm({...courseForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">AI & Machine Learning</SelectItem>
                      <SelectItem value="web">Web Development</SelectItem>
                      <SelectItem value="data">Data Science</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="short_desc">Short Description</Label>
                <Input
                  id="short_desc"
                  value={courseForm.short_description}
                  onChange={(e) => setCourseForm({...courseForm, short_description: e.target.value})}
                  placeholder="Brief course description"
                />
              </div>

              <div>
                <Label htmlFor="long_desc">Long Description</Label>
                <Textarea
                  id="long_desc"
                  value={courseForm.long_description}
                  onChange={(e) => setCourseForm({...courseForm, long_description: e.target.value})}
                  placeholder="Detailed course description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={courseForm.difficulty} onValueChange={(value) => setCourseForm({...courseForm, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={courseForm.duration_hours}
                    onChange={(e) => setCourseForm({...courseForm, duration_hours: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({...courseForm, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={courseForm.thumbnail_url}
                  onChange={(e) => setCourseForm({...courseForm, thumbnail_url: e.target.value})}
                  placeholder="Course thumbnail image URL"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={courseForm.tags}
                  onChange={(e) => setCourseForm({...courseForm, tags: e.target.value})}
                  placeholder="e.g., react, javascript, frontend"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateCourse(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCourse}>
                  Create Course
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Courses Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={course.thumbnail_url || '/placeholder-course.jpg'} 
                        alt={course.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-500">{course.short_description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={course.status === 'active' ? 'default' : 
                               course.status === 'draft' ? 'secondary' : 'destructive'}
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.student_count}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {course.rating}
                    </div>
                  </TableCell>
                  <TableCell>
                    {course.is_free ? 'Free' : `$${course.price}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCourse(course);
                          fetchModules(course.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(
                          course.id, 
                          course.status === 'active' ? 'draft' : 'active'
                        )}
                      >
                        {course.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Course Details Modal */}
      {selectedCourse && (
        <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedCourse.title} - Modules</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Course Modules</h3>
                <Dialog open={showCreateModule} onOpenChange={setShowCreateModule}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Module
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Module</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="module_title">Module Title</Label>
                        <Input
                          id="module_title"
                          value={moduleForm.title}
                          onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                          placeholder="Enter module title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="module_desc">Description</Label>
                        <Textarea
                          id="module_desc"
                          value={moduleForm.description}
                          onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                          placeholder="Module description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="video_url">Video URL</Label>
                          <Input
                            id="video_url"
                            value={moduleForm.video_url}
                            onChange={(e) => setModuleForm({...moduleForm, video_url: e.target.value})}
                            placeholder="Video URL"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration_min">Duration (minutes)</Label>
                          <Input
                            id="duration_min"
                            type="number"
                            value={moduleForm.duration_minutes}
                            onChange={(e) => setModuleForm({...moduleForm, duration_minutes: parseInt(e.target.value) || 0})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowCreateModule(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateModule}>
                          Create Module
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                {modules.map((module, index) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {module.duration_minutes} min
                          </Badge>
                          {module.is_preview && <Badge>Preview</Badge>}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-400">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                ))}
                {modules.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No modules created yet. Add your first module above.
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CourseManagement;