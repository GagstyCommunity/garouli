import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase,
  Building,
  Users,
  Zap,
  ExternalLink
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const jobTypes = [
    { id: 'all', name: 'All Types', count: 234 },
    { id: 'fulltime', name: 'Full-time', count: 156 },
    { id: 'parttime', name: 'Part-time', count: 43 },
    { id: 'contract', name: 'Contract', count: 67 },
    { id: 'internship', name: 'Internship', count: 28 },
  ];

  const locations = [
    { id: 'all', name: 'All Locations', count: 234 },
    { id: 'remote', name: 'Remote', count: 89 },
    { id: 'sf', name: 'San Francisco', count: 45 },
    { id: 'nyc', name: 'New York', count: 38 },
    { id: 'london', name: 'London', count: 32 },
    { id: 'berlin', name: 'Berlin', count: 30 },
  ];

  const jobs = [
    {
      id: 1,
      title: "AI Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $180k",
      posted: "2 days ago",
      description: "We're looking for an AI Engineer to join our innovative team working on cutting-edge machine learning projects.",
      skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning"],
      remote: true,
      featured: true,
      logo: "/api/placeholder/60/60"
    },
    {
      id: 2,
      title: "Prompt Engineer",
      company: "AI Startup",
      location: "Remote",
      type: "Contract",
      salary: "$80k - $120k",
      posted: "1 day ago",
      description: "Join our team to develop and optimize prompts for large language models.",
      skills: ["GPT", "LLM", "Prompt Engineering", "Python"],
      remote: true,
      featured: false,
      logo: "/api/placeholder/60/60"
    },
    {
      id: 3,
      title: "Machine Learning Intern",
      company: "DataTech",
      location: "New York, NY",
      type: "Internship",
      salary: "$25/hour",
      posted: "3 days ago",
      description: "Summer internship opportunity to work on real-world ML projects with mentorship.",
      skills: ["Python", "Scikit-learn", "Data Analysis", "Statistics"],
      remote: false,
      featured: false,
      logo: "/api/placeholder/60/60"
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "Analytics Pro",
      location: "London, UK",
      type: "Full-time",
      salary: "£70k - £95k",
      posted: "5 days ago",
      description: "Lead data science initiatives and build predictive models for business insights.",
      skills: ["Python", "R", "SQL", "Machine Learning", "Statistics"],
      remote: true,
      featured: true,
      logo: "/api/placeholder/60/60"
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudScale",
      location: "Berlin, Germany",
      type: "Full-time",
      salary: "€65k - €85k",
      posted: "1 week ago",
      description: "Build and maintain scalable infrastructure for AI/ML applications.",
      skills: ["Docker", "Kubernetes", "AWS", "Python", "CI/CD"],
      remote: true,
      featured: false,
      logo: "/api/placeholder/60/60"
    },
    {
      id: 6,
      title: "Frontend Developer",
      company: "WebFlow",
      location: "Remote",
      type: "Part-time",
      salary: "$40k - $60k",
      posted: "4 days ago",
      description: "Create beautiful and responsive web applications using modern frameworks.",
      skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
      remote: true,
      featured: false,
      logo: "/api/placeholder/60/60"
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || job.type.toLowerCase().includes(selectedType);
    const matchesLocation = selectedLocation === 'all' || 
                           (selectedLocation === 'remote' && job.remote) ||
                           job.location.toLowerCase().includes(selectedLocation);
    return matchesSearch && matchesType && matchesLocation;
  });

  const featuredJobs = jobs.filter(job => job.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Find Your Dream Job</h1>
            <p className="text-xl mb-8 opacity-90">
              Discover opportunities in AI, tech, and automation from top companies
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Job Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          selectedType === type.id
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{type.name}</span>
                        <Badge variant="secondary">{type.count}</Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => setSelectedLocation(location.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          selectedLocation === location.id
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{location.name}</span>
                        <Badge variant="secondary">{location.count}</Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {/* Featured Jobs */}
            {featuredJobs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Zap className="h-6 w-6 mr-2 text-yellow-500" />
                  Featured Jobs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-lg transition-shadow border-2 border-yellow-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Building className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              <CardDescription className="flex items-center space-x-2">
                                <span>{job.company}</span>
                                <span>•</span>
                                <span className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {job.location}
                                </span>
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-yellow-500 text-black">Featured</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{job.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{job.posted}</span>
                            </div>
                          </div>
                          <Button size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Jobs */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-6">All Jobs ({filteredJobs.length})</h2>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Building className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <Badge variant="outline">{job.type}</Badge>
                            {job.remote && <Badge variant="outline">Remote</Badge>}
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600 mb-3">
                            <span className="font-medium">{job.company}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-4">{job.description}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{job.posted}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Apply Now
                        </Button>
                        <Button variant="outline" size="sm">
                          Save Job
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;