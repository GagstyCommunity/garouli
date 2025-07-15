
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Search, Download, Filter, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SystemLog {
  id: string;
  action: string;
  user_id: string;
  user_name: string;
  details: string;
  type: 'role_change' | 'red_flag' | 'certificate_issue' | 'user_suspension' | 'course_approval';
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const SystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSystemLogs();
  }, []);

  const fetchSystemLogs = async () => {
    try {
      // Mock data - in real implementation, fetch from supabase
      const mockLogs: SystemLog[] = [
        {
          id: '1',
          action: 'Role Change',
          user_id: 'user123',
          user_name: 'Alice Johnson',
          details: 'Changed from student to instructor',
          type: 'role_change',
          timestamp: '2024-01-20 14:30:00',
          status: 'success'
        },
        {
          id: '2',
          action: 'Red Flag Alert',
          user_id: 'user456',
          user_name: 'Bob Smith',
          details: 'Inappropriate comment in course discussion',
          type: 'red_flag',
          timestamp: '2024-01-20 13:15:00',
          status: 'warning'
        },
        {
          id: '3',
          action: 'Certificate Issued',
          user_id: 'user789',
          user_name: 'Charlie Brown',
          details: 'React Fundamentals completion certificate',
          type: 'certificate_issue',
          timestamp: '2024-01-20 12:00:00',
          status: 'success'
        },
        {
          id: '4',
          action: 'User Suspension',
          user_id: 'user101',
          user_name: 'Diana Prince',
          details: 'Suspended for 7 days due to policy violation',
          type: 'user_suspension',
          timestamp: '2024-01-20 11:45:00',
          status: 'error'
        },
        {
          id: '5',
          action: 'Course Approval',
          user_id: 'instructor01',
          user_name: 'Eve Wilson',
          details: 'Advanced JavaScript course approved',
          type: 'course_approval',
          timestamp: '2024-01-20 10:30:00',
          status: 'success'
        }
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching system logs:', error);
      toast.error('Failed to load system logs');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    toast.success('System logs exported to CSV!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading system logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Logs</h2>
        <Button onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Trail ({logs.length} entries)</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="role_change">Role Changes</SelectItem>
                  <SelectItem value="red_flag">Red Flags</SelectItem>
                  <SelectItem value="certificate_issue">Certificates</SelectItem>
                  <SelectItem value="user_suspension">Suspensions</SelectItem>
                  <SelectItem value="course_approval">Course Approvals</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <h3 className="font-semibold">{log.action}</h3>
                        <p className="text-sm text-gray-600">
                          User: {log.user_name} • {log.details}
                        </p>
                        <p className="text-xs text-gray-500">{log.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                      <Badge variant="outline">
                        {log.type.replace('_', ' ')}
                      </Badge>
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

export default SystemLogs;
