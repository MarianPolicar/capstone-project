import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { User as UserIcon, Search, Mail, Shield, UserX, Key } from 'lucide-react';
import { User } from '../../App';
import { toast } from 'sonner@2.0.3';

interface UserManagementProps {
  user: User;
  users: User[];
  onLogout: () => void;
}

function UserManagement({ user, users, onLogout }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResetPassword = (userId: string, userName: string) => {
    toast.success(`Password reset email sent to ${userName}`);
  };

  const handleDeactivate = (userId: string, userName: string) => {
    toast.success(`User ${userName} has been deactivated`);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-slate-900 mb-2">User Management</h1>
            <p className="text-slate-600">Manage registered users and accounts</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              <UserIcon className="w-4 h-4 mr-2" />
              {users.length} Total Users
            </Badge>
          </div>
        </div>

        <Card className="shadow-lg">
          {/* Search Bar */}
          <div className="p-6 border-b border-slate-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(u => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-slate-900">{u.name}</p>
                            <p className="text-slate-500">ID: {u.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {u.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={u.role === 'admin' ? 'default' : 'outline'}
                          className={u.role === 'admin' ? 'bg-blue-600' : ''}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {u.createdAt ? formatDate(u.createdAt) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg"
                                onClick={() => setSelectedUser(u)}
                              >
                                <UserIcon className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>User Profile</DialogTitle>
                                <DialogDescription>
                                  View and manage user details
                                </DialogDescription>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                      <UserIcon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                      <h3 className="text-slate-900">{selectedUser.name}</h3>
                                      <p className="text-slate-600">{selectedUser.email}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2 pt-4 border-t">
                                    <div className="flex justify-between">
                                      <span className="text-slate-600">User ID:</span>
                                      <span className="text-slate-900 font-mono">{selectedUser.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-600">Role:</span>
                                      <Badge variant={selectedUser.role === 'admin' ? 'default' : 'outline'}>
                                        {selectedUser.role}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-600">Status:</span>
                                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      variant="outline"
                                      className="flex-1 rounded-lg"
                                      onClick={() => handleResetPassword(selectedUser.id, selectedUser.name)}
                                    >
                                      <Key className="w-4 h-4 mr-2" />
                                      Reset Password
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="flex-1 rounded-lg text-red-600 hover:bg-red-50"
                                      onClick={() => handleDeactivate(selectedUser.id, selectedUser.name)}
                                    >
                                      <UserX className="w-4 h-4 mr-2" />
                                      Deactivate
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default UserManagement;