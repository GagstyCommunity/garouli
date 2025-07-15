
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Users,
  Calendar,
  ExternalLink,
  Bookmark,
  Share2,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobData();
    }
  }, [id]);

  const fetchJobData = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('job_postings')
        .select(`
          *,
          profiles!job_postings_agency_id_fkey(full_name, bio, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (jobError) throw jobError;

      setJob(jobData);
      setAgency(jobData.profiles);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    // Mock application for demo
    setApplied(true);
    toast.success('Application submitted successfully!');
  };

  const handleSaveJob = () => {
    toast.success('Job saved to your favorites!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Job link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">Loading job details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Job not found</h2>
            <Button onClick={() => navigate('/jobs')}>
              Back to Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => navigate('/jobs')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Building className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{job.title}</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        {agency?.full_name || 'Company Name'}
                      </CardDescription>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.employment_type}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={job.remote ? 'default' : 'secondary'}>
                      {job.remote ? 'Remote' : 'On-site'}
                    </Badge>
                    <Badge variant="outline">
                      {job.employment_type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {job.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-3 text-green-600" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for this role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!applied ? (
                  <>
                    <Button onClick={handleApply} className="w-full" size="lg">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleSaveJob}
                        className="flex-1"
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleShare}
                        className="flex-1"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <p className="font-semibold text-green-600 mb-2">Application Submitted!</p>
                    <p className="text-sm text-gray-600">
                      We'll notify you when the employer responds.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Info */}
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Employment Type</span>
                  <Badge variant="outline">{job.employment_type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Remote Work</span>
                  <Badge variant={job.remote ? 'default' : 'secondary'}>
                    {job.remote ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-medium">{job.applications_count || 0}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            {agency && (
              <Card>
                <CardHeader>
                  <CardTitle>About the Company</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{agency.full_name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {agency.bio || 'Innovative technology company focused on cutting-edge solutions.'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate(`/agency/${job.agency_id}`)}
                  >
                    View Company Profile
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Senior AI Engineer</h4>
                    <p className="text-xs text-gray-600">TechCorp • Remote</p>
                    <p className="text-xs text-green-600 font-semibold">$140k - $200k</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">ML Research Scientist</h4>
                    <p className="text-xs text-gray-600">AI Labs • San Francisco</p>
                    <p className="text-xs text-green-600 font-semibold">$160k - $220k</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View More Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
