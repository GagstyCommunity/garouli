import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowLeft, Save, Eye } from 'lucide-react';

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category: '',
    difficulty: '',
    duration_hours: '',
    price: '',
    is_free: true,
    has_certification: false,
    tags: '',
    company_sponsor: ''
  });

  const categories = [
    'Artificial Intelligence',
    'DevOps & Cloud',
    'Web Development',
    'Data Science',
    'Cybersecurity',
    'Mobile Development',
    'Blockchain',
    'UI/UX Design'
  ];

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (isDraft: boolean = true) => {
    if (!user) return;

    setLoading(true);
    try {
      const courseData = {
        instructor_id: user.id,
        title: formData.title,
        description: formData.description,
        short_description: formData.short_description,
        category: formData.category,
        difficulty: formData.difficulty,
        duration_hours: formData.duration_hours ? parseInt(formData.duration_hours) : null,
        price: formData.is_free ? 0 : parseFloat(formData.price || '0'),
        is_free: formData.is_free,
        has_certification: formData.has_certification,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        company_sponsor: formData.company_sponsor || null,
        is_published: !isDraft
      };

      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: isDraft ? "Course saved as draft" : "Course published",
        description: isDraft ? 
          "Your course has been saved. You can continue editing anytime." :
          "Your course is now live and available to students."
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast({
        title: "Error creating course",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
            <p className="text-muted-foreground">
              Share your knowledge with thousands of eager learners
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>
                Provide basic information about your course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete Guide to Machine Learning"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description *</Label>
                <Input
                  id="short_description"
                  placeholder="Brief description for course cards"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed course description, what students will learn..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration_hours">Duration (hours)</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    placeholder="e.g., 10"
                    value={formData.duration_hours}
                    onChange={(e) => handleInputChange('duration_hours', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_sponsor">Company Sponsor (Optional)</Label>
                  <Input
                    id="company_sponsor"
                    placeholder="e.g., Google, Microsoft"
                    value={formData.company_sponsor}
                    onChange={(e) => handleInputChange('company_sponsor', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., python, machine learning, ai"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_free"
                    checked={formData.is_free}
                    onCheckedChange={(checked) => handleInputChange('is_free', checked)}
                  />
                  <Label htmlFor="is_free">This is a free course</Label>
                </div>

                {!formData.is_free && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 49.99"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_certification"
                    checked={formData.has_certification}
                    onCheckedChange={(checked) => handleInputChange('has_certification', checked)}
                  />
                  <Label htmlFor="has_certification">Includes certification</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  variant="outline"
                  onClick={() => handleSubmit(true)}
                  disabled={loading || !formData.title || !formData.short_description}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={loading || !formData.title || !formData.short_description}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Publish Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateCourse;