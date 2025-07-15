
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Save, Eye, History, Upload } from 'lucide-react';
import { toast } from 'sonner';

const CMSEditor = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [content, setContent] = useState('');

  const pages = [
    { id: 'about', name: 'About Us', path: '/about' },
    { id: 'privacy', name: 'Privacy Policy', path: '/privacy' },
    { id: 'terms', name: 'Terms of Service', path: '/terms' },
    { id: 'guidelines', name: 'Community Guidelines', path: '/guidelines' },
  ];

  const handleSave = () => {
    toast.success('Page content saved successfully!');
  };

  const handlePreview = () => {
    toast.success('Page preview opened!');
  };

  const handleVersionHistory = () => {
    toast.success('Version history opened!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">CMS Editor</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleVersionHistory}>
            <History className="h-4 w-4 mr-2" />
            Version History
          </Button>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save & Publish
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Static Page Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              {pages.map(page => (
                <TabsTrigger key={page.id} value={page.id}>
                  {page.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {pages.map(page => (
              <TabsContent key={page.id} value={page.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{page.name}</h3>
                    <p className="text-sm text-gray-500">Path: {page.path}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Image
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit SEO
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Page Title</label>
                    <Input placeholder="Enter page title" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Content (Markdown)</label>
                    <Textarea
                      placeholder="Enter page content in Markdown format..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={15}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Auto-saved 2 minutes ago
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Save Draft</Button>
                    <Button>Publish Changes</Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMSEditor;
