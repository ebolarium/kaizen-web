'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Projects() {
  const [projects, setProjects] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error('API response not ok:', response.status);
          // Fallback to static data
          const projectsData = await import('@/data/projects.json');
          setProjects(projectsData.default);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to static data
        const projectsData = await import('@/data/projects.json');
        setProjects(projectsData.default);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (isLoading || !projects) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const erasmusK2Projects = [...projects.erasmus.k2.ka210, ...projects.erasmus.k2.k220]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/images/background.png)', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
      {/* Hero Section */}
      <section className="text-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Projects</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-green-400 mb-8 mx-auto"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              KAIZEN focuses both domestic and international subjects on education, research, development, youth work, environment, nature, tourism, digitalization, culture, art, social entrepreneurship, innovation, active citizenship, inclusion, lifelong learning, disadvantaged groups of society, green practises, sustainability.
            </p>
          </div>
        </div>
      </section>

      {/* Project Categories */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto">
            {/* Erasmus Projects */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 relative">
              <div className="absolute top-4 left-8">
                <Image
                  src="/images/Erasmus_Logo.png"
                  alt="Erasmus+ Logo"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              
              <div className="mb-8 mt-16">
                {/* Projects Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {erasmusK2Projects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/projects/${project.id}`} className="block">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                                  {project.image ? (
                                    <img 
                                      src={project.image} 
                                      alt={project.title}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                      <Image
                                        src="/images/logo.png"
                                        alt="Project Placeholder"
                                        width={40}
                                        height={40}
                                        className="object-contain opacity-50"
                                      />
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <Link
                                href={`/projects/${project.id}`}
                                className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors duration-200"
                              >
                                {project.title}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {project.id.includes('ka210') ? 'KA210' : 'KA220'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                project.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : project.status === 'completed'
                                  ? 'bg-gray-100 text-gray-800'
                                  : project.status === 'ongoing'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Unknown'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </section>


    </div>
  );
}
