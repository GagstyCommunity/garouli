
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  MapPin, 
  Users, 
  Briefcase, 
  DollarSign,
  ExternalLink,
  Calendar,
  CheckCircle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';

const AgencyDetail = () => {
  const { id } = useParams();
  const [agency, setAgency] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencyData();
  }, [id]);

  const fetchAgencyData = async () => {
    try {
      // Fetch agency profile
      const { data: agencyData, error: agencyError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (agencyError) throw agencyError;

      // Fetch agency's job postings
      const { data: jobsData, error: jobsError } = await supabase
        .from('job_postings')
        .select('*')
        .eq('agency_id', id)
        .eq('is_active', true);

      if (jobsError) throw jobsError;

      // Fetch subscription info
      const { data: subData, error: subError } = await supabase
        .from('agency_subscriptions')
        .select('*')
        .eq('user_id', id)
        .single();

      setAgency(agencyData);
      setJobs(jobsData || []);
      setSubscription(subData);
    } catch (error) {
      console.error('Error fetching agency data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">Loading agency details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Agency Not Found</h1>
            <Link to="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={agency.avatar_url} />
              <AvatarFallback className="text-2xl">
                {agency.full_name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{agency.full_name}</h1>
              <p className="text-xl opacity-90 mb-4">{agency.bio}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span>{jobs.length} Open Positions</span>
                </div>
                {subscription && (
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                    {subscription.status === 'active' ? 'Premium Partner' : 'Trial Member'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs">Open Positions</TabsTrigger>
            <TabsTrigger value="about">About Agency</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <div className="grid gap-6">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{job.location}</span>
                            </div>
                            {job.remote && (
                              <Badge variant="secondary">Remote</Badge>
                            )}
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span>${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{job.employment_type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </div>
                        <Link to={`/jobs/${job.id}`}>
                          <Button size="sm">
                            View Details
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Open Positions</h3>
                  <p className="text-gray-600">This agency doesn't have any active job postings at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {agency.full_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">{agency.bio}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Company Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Active Jobs:</span>
                        <span className="font-medium">{jobs.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Member Since:</span>
                        <span className="font-medium">
                          {new Date(agency.created_at).getFullYear()}
                        </span>
                      </div>
                      {subscription && (
                        <div className="flex justify-between">
                          <span>Membership:</span>
                          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                            {subscription.status === 'active' ? 'Premium' : 'Trial'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">AI Recruitment</Badge>
                      <Badge variant="outline">Machine Learning</Badge>
                      <Badge variant="outline">Data Science</Badge>
                      <Badge variant="outline">Enterprise Solutions</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Get in touch with {agency.full_name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold">Email:</label>
                    <p className="text-gray-700">{agency.email}</p>
                  </div>
                  
                  <div>
                    <label className="font-semibold">About:</label>
                    <p className="text-gray-700">{agency.bio}</p>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full">
                      Contact Agency
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgencyDetail;
