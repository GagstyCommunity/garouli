
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Shield, Plus, Edit, Trash2, Eye, Users, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface Admin {
  id: string;
  email: string;
  role: 'admin' | 'moderator' | 'editor' | 'reviewer';
  permissions: string[];
  created_at: string;
  last_login?: string;
}

const AdminRoles = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    role: 'moderator' as const,
    permissions: [] as string[]
  });

  const rolePermissions = {
    admin: ['full_access', 'user_management', 'content_management', 'system_settings', 'analytics'],
    moderator: ['user_suspension', 'content_approval', 'comment_moderation'],
    editor: ['cms_edit', 'seo_management', 'content_creation'],
    reviewer: ['badge_management', 'quiz_review', 'certificate_issue']
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      // Mock data - in real implementation, fetch from supabase
      const mockAdmins: Admin[] = [
        {
          id: '1',
          email: 'admin@example.com',
          role: 'admin',
          permissions: rolePermissions.admin,
          created_at: '2024-01-01',
          last_login: '2024-01-20 14:30:00'
        },
        {
          id: '2',
          email: 'moderator@example.com',
          role: 'moderator',
          permissions: rolePermissions.moderator,
          created_at: '2024-01-05',
          last_login: '2024-01-19 10:15:00'
        },
        {
          id: '3',
          email: 'editor@example.com',
          role: 'editor',
          permissions: rolePermissions.editor,
          created_at: '2024-01-10',
          last_login: '2024-01-20 09:00:00'
        }
      ];
      setAdmins(mockAdmins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = () => {
    if (!newAdmin.email || !newAdmin.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    const admin: Admin = {
      id: Date.now().toString(),
      ...newAdmin,
      permissions: rolePermissions[newAdmin.role],
      created_at: new Date().toISOString()
    };

    setAdmins([admin, ...admins]);
    setNewAdmin({
      email: '',
      role: 'moderator',
      permissions: []
    });
    setIsAddDialogOpen(false);
    toast.success('Admin user created successfully!');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'editor': return 'bg-green-100 text-green-800';
      case 'reviewer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading admin roles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Roles & Access</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select value={newAdmin.role} onValueChange={(value) => setNewAdmin({...newAdmin, role: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Full Access)</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAdmin} className="flex-1">
                  Create Admin
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admin Users ({admins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admins.map((admin) => (
                <Card key={admin.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{admin.email}</h3>
                        <p className="text-sm text-gray-500">
                          Created: {admin.created_at}
                        </p>
                        {admin.last_login && (
                          <p className="text-sm text-gray-500">
                            Last login: {admin.last_login}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(admin.role)}>
                          {admin.role}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Role Permissions Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(rolePermissions).map(([role, permissions]) => (
                <Card key={role}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold capitalize">{role}</h3>
                      <Badge className={getRoleColor(role)}>
                        {permissions.length} permissions
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRoles;
