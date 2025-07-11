
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Award, Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Certificate {
  id: string;
  user_name: string;
  course_name: string;
  issued_at: string;
  verification_hash: string;
  is_active: boolean;
  blockchain_hash?: string;
}

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      // Mock data - in real implementation, fetch from supabase
      const mockCertificates: Certificate[] = [
        {
          id: '1',
          user_name: 'Alice Johnson',
          course_name: 'React Fundamentals',
          issued_at: '2024-01-15',
          verification_hash: 'abc123def456',
          is_active: true,
          blockchain_hash: 'blockchain_hash_123'
        },
        {
          id: '2',
          user_name: 'Bob Smith',
          course_name: 'Machine Learning Basics',
          issued_at: '2024-01-18',
          verification_hash: 'def456ghi789',
          is_active: true
        },
        {
          id: '3',
          user_name: 'Charlie Brown',
          course_name: 'Web Development',
          issued_at: '2024-01-20',
          verification_hash: 'ghi789jkl012',
          is_active: false
        }
      ];
      setCertificates(mockCertificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = (certificateId: string) => {
    setCertificates(certificates.map(cert => 
      cert.id === certificateId ? { ...cert, is_active: !cert.is_active } : cert
    ));
    toast.success('Certificate status updated');
  };

  const handleIssueNew = () => {
    toast.success('Certificate issuance initiated!');
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading certificates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Certificate Management</h2>
        <Button onClick={handleIssueNew}>
          <Plus className="h-4 w-4 mr-2" />
          Issue New Certificate
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Certificates ({certificates.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCertificates.map((certificate) => (
              <Card key={certificate.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <h3 className="text-lg font-semibold">{certificate.course_name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">Awarded to: {certificate.user_name}</p>
                      <p className="text-sm text-gray-500">Issued: {certificate.issued_at}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={certificate.is_active ? 'default' : 'secondary'}>
                        {certificate.is_active ? 'Active' : 'Revoked'}
                      </Badge>
                      {certificate.blockchain_hash && (
                        <Badge variant="outline" className="text-blue-600">
                          Blockchain
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>Hash: {certificate.verification_hash}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={certificate.is_active ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleActive(certificate.id)}
                      >
                        {certificate.is_active ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Revoke
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Restore
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

export default CertificateManagement;
