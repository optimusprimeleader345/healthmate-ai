import React, { useState, useEffect } from 'react';
import {
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Calendar,
  Filter,
  ChevronDown,
  Edit,
  Trash2,
  UserPlus,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

// Mock user data for admin view
const mockUsers = [
  {
    id: 'patient-001',
    email: 'demo.patient@healthmate.com',
    name: 'Demo Patient',
    role: 'patient',
    status: 'active',
    avatar: '🏥',
    joinDate: '2024-02-01',
    lastLogin: '2024-11-23',
    subscription: 'Basic',
    activityScore: 85
  },
  {
    id: 'patient-002',
    email: 'patient@example.com',
    name: 'John Doe',
    role: 'patient',
    status: 'active',
    avatar: '👤',
    joinDate: '2024-01-15',
    lastLogin: '2024-11-20',
    subscription: 'Free',
    activityScore: 62
  },
  {
    id: 'patient-003',
    email: 'sarah.wilson@healthmate.com',
    name: 'Sarah Wilson',
    role: 'patient',
    status: 'active',
    avatar: '👩‍⚕️',
    joinDate: '2024-03-10',
    lastLogin: '2024-11-22',
    subscription: 'Pro',
    activityScore: 94
  },
  {
    id: 'patient-004',
    email: 'inactive.user@example.com',
    name: 'Inactive User',
    role: 'patient',
    status: 'inactive',
    avatar: '😴',
    joinDate: '2024-05-01',
    lastLogin: '2024-10-15',
    subscription: 'Basic',
    activityScore: 12
  },
  // Add more users
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `patient-${i + 100}`,
    email: `user${i + 100}@example.com`,
    name: `User ${i + 100}`,
    role: 'patient',
    status: 'active',
    avatar: ['👤', '👩', '👨', '🧑'][i % 4],
    joinDate: '2024-06-15',
    lastLogin: '2024-11-22',
    subscription: ['Free', 'Basic', 'Pro'][i % 3],
    activityScore: Math.floor(Math.random() * 100) + 1
  }))
];

const UserActionsMenu = ({ user, onAction }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-1">
            <button
              onClick={() => { onAction('view', user); setShowMenu(false); }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={() => { onAction('edit', user); setShowMenu(false); }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit User
            </button>
            {user.status === 'active' ? (
              <button
                onClick={() => { onAction('deactivate', user); setShowMenu(false); }}
                className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                Deactivate
              </button>
            ) : (
              <button
                onClick={() => { onAction('activate', user); setShowMenu(false); }}
                className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Activate
              </button>
            )}
            <hr className="my-1" />
            <button
              onClick={() => { onAction('delete', user); setShowMenu(false); }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    premium: users.filter(u => u.subscription !== 'Free').length
  };

  // Filter users
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (subscriptionFilter !== 'all') {
      filtered = filtered.filter(user => user.subscription === subscriptionFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchTerm, statusFilter, subscriptionFilter]);

  // Handle user actions
  const handleUserAction = (action, user) => {
    console.log(`${action} user:`, user);

    if (action === 'deactivate') {
      setUsers(prev =>
        prev.map(u => u.id === user.id ? { ...u, status: 'inactive' } : u)
      );
    } else if (action === 'activate') {
      setUsers(prev =>
        prev.map(u => u.id === user.id ? { ...u, status: 'active' } : u)
      );
    } else if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
        setUsers(prev => prev.filter(u => u.id !== user.id));
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivityColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSubscriptionBadge = (subscription) => {
    const colors = {
      'Free': 'bg-gray-100 text-gray-800',
      'Basic': 'bg-blue-100 text-blue-800',
      'Pro': 'bg-purple-100 text-purple-800'
    };
    return colors[subscription] || colors['Free'];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage user accounts</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-green-600">{stats.active}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-blue-600">{stats.premium}</p>
              <p className="text-sm text-gray-600">Premium Users</p>
            </div>
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-orange-600">{stats.inactive}</p>
              <p className="text-sm text-gray-600">Inactive Users</p>
            </div>
            <UserX className="w-8 h-8 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Plan:</span>
              <select
                value={subscriptionFilter}
                onChange={(e) => setSubscriptionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="all">All Plans</option>
                <option value="Free">Free</option>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers
                .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
                .map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-lg">{user.avatar}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSubscriptionBadge(user.subscription)}`}>
                      {user.subscription}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getActivityColor(user.activityScore)}`}>
                        {user.activityScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <UserActionsMenu user={user} onAction={handleUserAction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{Math.min((currentPage - 1) * usersPerPage + 1, filteredUsers.length)}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * usersPerPage, filteredUsers.length)}</span> of{' '}
                  <span className="font-medium">{filteredUsers.length}</span> users
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
