
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plug, Github, MessageSquare, Calendar, Code, ExternalLink, Settings, Check, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  isConnected: boolean;
  isPopular: boolean;
  rating: number;
  installs: number;
  features: string[];
  setupInstructions: string[];
  requiredPermissions: string[];
  developer: string;
  lastUpdated: string;
}

const IntegrationMarketplace: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'GitHub',
      description: 'Connect your repositories for automatic project submissions and code reviews',
      category: 'Development',
      icon: '🐙',
      isConnected: true,
      isPopular: true,
      rating: 4.8,
      installs: 15420,
      features: [
        'Automatic project submission',
        'Code review integration',
        'Portfolio generation',
        'Commit tracking'
      ],
      setupInstructions: [
        'Click "Connect" and authorize GitHub access',
        'Select repositories you want to sync',
        'Configure submission settings',
        'Start pushing your projects'
      ],
      requiredPermissions: ['Repository access', 'User profile'],
      developer: 'Minutely AI Team',
      lastUpdated: '2024-01-10'
    },
    {
      id: '2',
      name: 'VS Code',
      description: 'Integrate with Visual Studio Code for seamless coding experience',
      category: 'Development',
      icon: '💻',
      isConnected: false,
      isPopular: true,
      rating: 4.9,
      installs: 12850,
      features: [
        'Live code sharing',
        'Real-time collaboration',
        'Extension recommendations',
        'Progress tracking'
      ],
      setupInstructions: [
        'Install the Minutely AI extension',
        'Sign in with your account',
        'Configure workspace settings',
        'Start coding with AI assistance'
      ],
      requiredPermissions: ['Workspace access', 'File operations'],
      developer: 'Minutely AI Team',
      lastUpdated: '2024-01-08'
    },
    {
      id: '3',
      name: 'Slack',
      description: 'Get learning reminders and updates in your Slack workspace',
      category: 'Communication',
      icon: '💬',
      isConnected: false,
      isPopular: true,
      rating: 4.6,
      installs: 8960,
      features: [
        'Learning streak reminders',
        'Course completion notifications',
        'AI assistant in Slack',
        'Team progress sharing'
      ],
      setupInstructions: [
        'Add Minutely AI bot to your Slack',
        'Authorize workspace access',
        'Configure notification preferences',
        'Invite teammates to join'
      ],
      requiredPermissions: ['Send messages', 'Read channels'],
      developer: 'Minutely AI Team',
      lastUpdated: '2024-01-12'
    },
    {
      id: '4',
      name: 'Discord',
      description: 'Study together with voice channels and AI moderation',
      category: 'Communication',
      icon: '🎮',
      isConnected: false,
      isPopular: false,
      rating: 4.5,
      installs: 5240,
      features: [
        'Study room creation',
        'Voice study sessions',
        'AI moderated discussions',
        'Achievement sharing'
      ],
      setupInstructions: [
        'Invite Minutely AI bot to your server',
        'Set up study channels',
        'Configure bot permissions',
        'Start your first study session'
      ],
      requiredPermissions: ['Manage channels', 'Send messages', 'Voice permissions'],
      developer: 'Community Developer',
      lastUpdated: '2024-01-05'
    },
    {
      id: '5',
      name: 'Google Calendar',
      description: 'Schedule learning sessions and track study time automatically',
      category: 'Productivity',
      icon: '📅',
      isConnected: true,
      isPopular: true,
      rating: 4.7,
      installs: 11200,
      features: [
        'Automatic session scheduling',
        'Study time tracking',
        'Deadline reminders',
        'Progress calendar view'
      ],
      setupInstructions: [
        'Connect your Google Calendar',
        'Set preferred study times',
        'Configure reminder settings',
        'Sync with course deadlines'
      ],
      requiredPermissions: ['Calendar access', 'Event creation'],
      developer: 'Minutely AI Team',
      lastUpdated: '2024-01-09'
    },
    {
      id: '6',
      name: 'Notion',
      description: 'Export notes and create personal knowledge base in Notion',
      category: 'Productivity',
      icon: '📝',
      isConnected: false,
      isPopular: false,
      rating: 4.4,
      installs: 3890,
      features: [
        'Automatic note export',
        'Progress tracking pages',
        'Template generation',
        'Knowledge base creation'
      ],
      setupInstructions: [
        'Connect your Notion workspace',
        'Select or create target database',
        'Configure export settings',
        'Start syncing your notes'
      ],
      requiredPermissions: ['Workspace access', 'Page creation'],
      developer: 'Community Developer',
      lastUpdated: '2024-01-03'
    }
  ]);

  const categories = ['all', 'Development', 'Communication', 'Productivity', 'Analytics'];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleConnection = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, isConnected: !integration.isConnected }
        : integration
    ));
    
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      toast({
        title: integration.isConnected ? "Integration disconnected" : "Integration connected",
        description: integration.isConnected 
          ? `${integration.name} has been disconnected from your account.`
          : `${integration.name} is now connected and ready to use.`
      });
    }
  };

  const connectedIntegrations = integrations.filter(i => i.isConnected);
  const popularIntegrations = integrations.filter(i => i.isPopular);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Integration Marketplace</h2>
        <p className="text-muted-foreground">
          Connect your favorite tools and enhance your learning experience
        </p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="connected">Connected ({connectedIntegrations.length})</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search integrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map(integration => (
              <Card key={integration.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{integration.category}</Badge>
                          {integration.isPopular && (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {integration.isConnected && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{integration.rating}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {integration.installs.toLocaleString()} installs
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Key Features:</Label>
                    <ul className="text-sm space-y-1">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      variant={integration.isConnected ? "destructive" : "default"}
                      onClick={() => toggleConnection(integration.id)}
                    >
                      {integration.isConnected ? (
                        <>
                          <Plug className="h-4 w-4 mr-1" />
                          Disconnect
                        </>
                      ) : (
                        <>
                          <Plug className="h-4 w-4 mr-1" />
                          Connect
                        </>
                      )}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <span className="text-2xl">{integration.icon}</span>
                            <span>{integration.name}</span>
                          </DialogTitle>
                          <DialogDescription>{integration.description}</DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium mb-2">Setup Instructions:</h4>
                            <ol className="space-y-2 text-sm">
                              {integration.setupInstructions.map((step, index) => (
                                <li key={index} className="flex">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                                    {index + 1}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Required Permissions:</h4>
                            <div className="flex flex-wrap gap-2">
                              {integration.requiredPermissions.map((permission, index) => (
                                <Badge key={index} variant="outline">{permission}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label>Developer</Label>
                              <p className="text-muted-foreground">{integration.developer}</p>
                            </div>
                            <div>
                              <Label>Last Updated</Label>
                              <p className="text-muted-foreground">
                                {new Date(integration.lastUpdated).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Learn More
                            </Button>
                            <Button onClick={() => toggleConnection(integration.id)}>
                              {integration.isConnected ? 'Disconnect' : 'Connect Now'}
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
        </TabsContent>

        <TabsContent value="connected" className="space-y-6">
          {connectedIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedIntegrations.map(integration => (
                <Card key={integration.id} className="border-green-200 dark:border-green-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{integration.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <Badge className="bg-green-500 hover:bg-green-600 mt-1">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleConnection(integration.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                    <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950/30 p-2 rounded">
                      Last sync: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Plug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No connected integrations</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your favorite tools to enhance your learning experience.
                </p>
                <Button onClick={() => setSelectedCategory('all')}>
                  Browse Integrations
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularIntegrations.map(integration => (
              <Card key={integration.id} className="border-yellow-200 dark:border-yellow-800">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            {integration.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                  <div className="text-sm text-muted-foreground">
                    {integration.installs.toLocaleString()} users connected
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    variant={integration.isConnected ? "destructive" : "default"}
                    onClick={() => toggleConnection(integration.id)}
                  >
                    {integration.isConnected ? 'Disconnect' : 'Connect Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationMarketplace;
