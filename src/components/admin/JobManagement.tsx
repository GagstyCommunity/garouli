
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  description: string;
  agency_id: string;
  location: string;
  employment_type: string;
  salary_min: number;
  salary_max: number;
  is_active: boolean;
  applications_count: number;
  created_at: string;
  agency_name?: string;
}

const JobManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // First get job postings
      const { data: jobsData, error: jobsError } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      if (jobsData) {
        // Get agency profiles separately to avoid join issues
        const agencyIds = [...new Set(jobsData.map(job => job.agency_id).filter(Boolean))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', agencyIds);

        // Merge the data
        const enrichedJobs = jobsData.map(job => ({
          ...job,
          agency_name: profilesData?.find(p => p.id === job.agency_id)?.full_name || 'Unknown Agency',
          location: job.location || 'Remote',
          employment_type: job.employment_type || 'Full-time',
          salary_min: job.salary_min || 0,
          salary_max: job.salary_max || 0,
          applications_count: job.applications_count || 0
        })) as Job[];

        setJobs(enrichedJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (jobId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('job_postings')
        .update({ is_active: !currentStatus })
        .eq('id', jobId);

      if (error) throw error;

      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, is_active: !currentStatus } : job
      ));
      
      toast.success(`Job ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job status');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.agency_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading jobs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Jobs ({jobs.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="h-5 w-5 text-green-500" />
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                      <p className="text-sm text-gray-500 mt-1">by {job.agency_name}</p>
                    </div>
                    <Badge variant={job.is_active ? 'default' : 'secondary'}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>{job.location}</span>
                      <span>{job.employment_type}</span>
                      <span>${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}</span>
                      <span>{job.applications_count || 0} applications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={job.is_active ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleActive(job.id, job.is_active)}
                      >
                        {job.is_active ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobManagement;
