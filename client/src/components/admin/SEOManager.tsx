
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';

const SEOManager = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSave = () => {
    toast.success('SEO metadata saved successfully!');
  };

  const handlePreview = () => {
    toast.success('SEO preview opened!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">SEO Manager</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO Metadata Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="agencies">Agencies</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">React Fundamentals Course</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Meta Title</label>
                      <Input placeholder="Enter meta title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Meta Description</label>
                      <Textarea placeholder="Enter meta description" rows={3} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Canonical URL</label>
                      <Input placeholder="https://example.com/courses/react-fundamentals" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">OG Image URL</label>
                      <Input placeholder="https://example.com/images/og-react.jpg" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Machine Learning Basics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Meta Title</label>
                      <Input placeholder="Enter meta title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Meta Description</label>
                      <Textarea placeholder="Enter meta description" rows={3} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Canonical URL</label>
                      <Input placeholder="https://example.com/courses/ml-basics" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">OG Image URL</label>
                      <Input placeholder="https://example.com/images/og-ml.jpg" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOManager;
