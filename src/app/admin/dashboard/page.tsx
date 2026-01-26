'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  localCount: number;
  ka1Count: number;
  ka2Count: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    localCount: 0,
    ka1Count: 0,
    ka2Count: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeProjects, setActiveProjects] = useState<Array<{
    id: string;
    title: string;
    category: string;
    status: string;
  }>>([]);
  const [recentChanges, setRecentChanges] = useState<Array<{
    id: string;
    action: 'created' | 'updated' | 'deleted';
    title: string;
    createdAt: string;
  }>>([]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    // In a real app, you would decode the JWT token and get user info
    setUser({ username: 'admin', email: 'admin@kaizen.org' });
    
    // Load dashboard stats
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        return;
      }

      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          localCount: data.localCount || 0,
          ka1Count: data.ka1Count || 0,
          ka2Count: data.ka2Count || 0
        });
      } else {
        console.error('Failed to load stats:', response.status);
      }

      const projectsResponse = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (projectsResponse.ok) {
        const data = await projectsResponse.json();
        const allProjects = [
          ...data.local.map((project: any) => ({ ...project, category: 'Local' })),
          ...data.erasmus.k1.ka152.map((project: any) => ({ ...project, category: 'Erasmus+ KA152' })),
          ...data.erasmus.k1.ka153.map((project: any) => ({ ...project, category: 'Erasmus+ KA153' })),
          ...data.erasmus.k2.ka210.map((project: any) => ({ ...project, category: 'Erasmus+ KA210' })),
          ...data.erasmus.k2.k220.map((project: any) => ({ ...project, category: 'Erasmus+ KA220' }))
        ];
        const active = allProjects
          .filter((project: any) => project.status === 'active')
          .map((project: any) => ({
            id: project.id,
            title: project.title,
            category: project.category,
            status: project.status
          }));
        setActiveProjects(active);
      }

      const changesResponse = await fetch('/api/admin/changes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (changesResponse.ok) {
        const changes = await changesResponse.json();
        setRecentChanges(
          changes.map((change: any) => ({
            id: change._id || change.id,
            action: change.action,
            title: change.title,
            createdAt: change.createdAt
          }))
        );
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-xl font-bold text-gray-800">Kaizen Admin</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Local Event Count</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.localCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">KA1 Project Count</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.ka1Count}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">KA2 Project Count</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.ka2Count}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">View Projects</h2>
                <p className="text-gray-600 mt-2">Active projects</p>
              </div>
              <Link
                href="/admin/projects"
                className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {activeProjects.length === 0 ? (
                <p className="text-sm text-gray-500">No active projects found.</p>
              ) : (
                activeProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{project.title}</p>
                      <p className="text-xs text-gray-500">{project.category}</p>
                    </div>
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            href="/admin/projects/new"
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">New Project</h2>
                <p className="text-gray-600 mt-2">Create a new project</p>
              </div>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Recent Changes</h2>
            <span className="text-sm text-gray-500">Last 5 updates</span>
          </div>
          <div className="space-y-3">
            {recentChanges.length === 0 ? (
              <p className="text-sm text-gray-500">No recent changes yet.</p>
            ) : (
              recentChanges.map((change) => (
                <div key={change.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
                  <p className="text-sm text-gray-700">
                    {change.action === 'created' && 'Project created: '}
                    {change.action === 'updated' && 'Project updated: '}
                    {change.action === 'deleted' && 'Project deleted: '}
                    <span className="font-medium text-gray-900">{change.title}</span>
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(change.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
