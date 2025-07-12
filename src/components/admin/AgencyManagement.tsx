
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, Plus, Edit, Eye, Briefcase, Users, 
  CheckCircle, XCircle, ExternalLink, Globe, MapPin
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Agency {
  id: string;
  user_id: string;
  company_name: string;
  company_size: string;
  industry: string;
  website_url: string;
  verified: boolean;
  created_at: string;
  profile: {
    full_name: string;
    email: string;
    avatar_url: string;
  };
  subscription?: {
    status: string;
    annual_fee: number;
  };
  jobs_count?: number;
  active_jobs?: number;
}

const AgencyManagement = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAgency, setNewAgency] = useState({
    user_id: '',
    company_name: '',
    company_size: '1-10',
    industry: '',
    website_url: '',
    verified: false
  });

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const { data, error } = await supabase
        .from('agency_profiles')
        .select(`
          *,
          profile:profiles(full_name, email, avatar_url),
          subscription:agency_subscriptions(status, annual_fee)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add mock job counts for demonstration
      const enrichedData = data?.map(agency => ({
        ...agency,
        jobs_count: Math.floor(Math.random() * 25) + 1,
        active_jobs: Math.floor(Math.random() * 10) + 1
      })) || [];

      setAgencies(enrichedData);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      toast.error('Failed to load agencies');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAgency = async (agencyId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('agency_profiles')
        .update({ verified })
        .eq('id', agencyId);

      if (error) throw error;
      
      toast.success(`Agency ${verified ? 'verified' : 'unverified'} successfully`);
      fetchAgencies();
    } catch (error) {
      console.error('Error updating agency:', error);
      toast.error('Failed to update agency');
    }
  };

  const handleCreateAgency = async () => {
    try {
      const { error } = await supabase
        .from('agency_profiles')
        .insert([newAgency]);

      if (error) throw error;

      toast.success('Agency created successfully!');
      setIsCreateDialogOpen(false);
      setNewAgency({
        user_id: '',
        company_name: '',
        company_size: '1-10',
        industry: '',
        website_url: '',
        verified: false
      });
      fetchAgencies();
    } catch (error) {
      console.error('Error creating agency:', error);
      toast.error('Failed to create agency');
    }
  };

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case 'verified':
        return matchesSearch && agency.verified;
      case 'unverified':
        return matchesSearch && !agency.verified;
      case 'subscribed':
        return matchesSearch && agency.subscription?.status === 'active';
      default:
        return matchesSearch;
    }
  });

  const getCompanySizeColor = (size: string) => {
    switch (size) {
      case '1-10': return 'bg-green-100 text-green-800';
      case '11-50': return 'bg-blue-100 text-blue-800';
      case '51-200': return 'bg-purple-100 text-purple-800';
      case '201-1000': return 'bg-orange-100 text-orange-800';
      case '1000+': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionStatus = (subscription: any) => {
    if (!subscription) return { label: 'No Subscription', color: 'bg-gray-100 text-gray-800' };
    
    switch (subscription.status) {
      case 'active': return { label: 'Active', color: 'bg-green-100 text-green-800' };
      case 'trial': return { label: 'Trial', color: 'bg-blue-100 text-blue-800' };
      case 'cancelled': return { label: 'Cancelled', color: 'bg-red-100 text-red-800' };
      case 'expired': return { label: 'Expired', color: 'bg-orange-100 text-orange-800' };
      default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading agencies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Agency Management
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Agency
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Agency</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user_id">User ID *</Label>
                <Input
                  id="user_id"
                  value={newAgency.user_id}
                  onChange={(e) => setNewAgency({...newAgency, user_id: e.target.value})}
                  placeholder="User UUID"
                />
              </div>
              <div>
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={newAgency.company_name}
                  onChange={(e) => setNewAgency({...newAgency, company_name: e.target.value})}
                  placeholder="TechCorp Inc."
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={newAgency.industry}
                  onChange={(e) => setNewAgency({...newAgency, industry: e.target.value})}
                  placeholder="Technology, Healthcare, Finance..."
                />
              </div>
              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  value={newAgency.website_url}
                  onChange={(e) => setNewAgency({...newAgency, website_url: e.target.value})}
                  placeholder="https://company.com"
                />
              </div>
              <div>
                <Label htmlFor="company_size">Company Size</Label>
                <Select value={newAgency.company_size} onValueChange={(value) => setNewAgency({...newAgency, company_size: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-1000">201-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={newAgency.verified}
                  onChange={(e) => setNewAgency({...newAgency, verified: e.target.checked})}
                />
                <Label htmlFor="verified">Pre-verified Agency</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateAgency} className="flex-1">
                  Add Agency
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
            <CardTitle>All Agencies ({agencies.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  placeholder="Search agencies..."
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
              <TabsTrigger value="all">All Agencies</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="unverified">Unverified</TabsTrigger>
              <TabsTrigger value="subscribed">Subscribed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgencies.map((agency) => {
                  const subscriptionStatus = getSubscriptionStatus(agency.subscription);
                  
                  return (
                    <Card key={agency.id} className={agency.verified ? 'border-green-200' : ''}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={agency.profile?.avatar_url} />
                              <AvatarFallback>
                                {agency.company_name?.substring(0, 2).toUpperCase() || 'AG'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate flex items-center gap-2">
                                {agency.company_name || 'Unnamed Agency'}
                                {agency.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </p>
                              <p className="text-sm text-gray-500 truncate">{agency.profile?.email}</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{agency.industry || 'Industry not specified'}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge className={getCompanySizeColor(agency.company_size)}>
                            {agency.company_size} employees
                          </Badge>
                          <Badge className={subscriptionStatus.color}>
                            {subscriptionStatus.label}
                          </Badge>
                          {agency.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Briefcase className="h-3 w-3 text-blue-500" />
                              <span className="font-medium">{agency.jobs_count || 0}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Total Jobs</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="h-3 w-3 text-green-500" />
                              <span className="font-medium">{agency.active_jobs || 0}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Active Jobs</p>
                          </div>
                        </div>

                        {agency.subscription?.annual_fee && (
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <p className="text-sm font-medium text-blue-900">
                              ${agency.subscription.annual_fee.toLocaleString()}/year
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {agency.website_url && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={agency.website_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {agency.verified ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyAgency(agency.id, false)}
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyAgency(agency.id, true)}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Globe className="h-4 w-4 text-blue-500" />
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

export default AgencyManagement;
