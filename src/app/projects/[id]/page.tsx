'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ImageSlider from '@/components/ImageSlider';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  gallery: string[];
  date: string;
  status: string;
  partners?: string[];
  category: string;
  padletUrl?: string;
}

async function getProject(id: string): Promise<Project | null> {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const loadProject = async () => {
      const { id } = await params;
      const projectData = await getProject(id);
      if (!projectData) {
        notFound();
      }
      setProject(projectData);
      setIsLoading(false);
    };
    loadProject();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'local':
        return { name: 'Local Events', color: 'blue', path: '/projects/local' };
      case 'k152':
        return { name: 'Erasmus+ KA152', color: 'green', path: '/projects/erasmus/k1/k152' };
      case 'k153':
        return { name: 'Erasmus+ KA153', color: 'green', path: '/projects/erasmus/k1/k153' };
      case 'ka210':
        return { name: 'Erasmus+ KA210', color: 'purple', path: '/projects/erasmus/k2/ka210' };
      case 'k220':
        return { name: 'Erasmus+ KA220', color: 'purple', path: '/projects/erasmus/k2/k220' };
      default:
        return { name: 'Project', color: 'gray', path: '/projects' };
    }
  };

  const categoryInfo = getCategoryInfo(project.category);
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    gray: 'from-gray-600 to-gray-700'
  };

  return (
    <div className="bg-white">

      {/* Featured Image and Description */}
      {project.image && (
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-center">
              {/* Featured Image - Left 30% */}
              <div className="lg:col-span-3 aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Short Description - Right 70% */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{project.title}</h2>
                <div className="text-lg text-gray-600 leading-relaxed">
                  {project.description}
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {categoryInfo.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'completed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Project Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                >
                  {project.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <ImageSlider
              images={project.gallery}
              title={`${project.title} Gallery`}
            />
          </div>
        </section>
      )}

      {/* Activities Section */}
      {project.activities && project.activities.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {project.activities.map((activity: any, index: number) => (
                <div key={activity.id || index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="prose prose-lg max-w-none text-gray-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activity.content}
                    </ReactMarkdown>
                  </div>

                  {activity.images && activity.images.length > 0 && (
                    <div className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activity.images.map((image: string, imgIndex: number) => (
                          <div key={imgIndex} className="relative group cursor-pointer" onClick={() => openModal(image)}>
                            <img
                              src={image}
                              alt={`Activity ${index + 1} image ${imgIndex + 1}`}
                              className="w-full h-48 object-cover rounded-lg shadow-sm group-hover:shadow-lg transition-all duration-200 group-hover:scale-105"
                            />
                            <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Padlet Embed */}
      {project.padletUrl && (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Project Board</h3>
            <div className="w-full h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
              <iframe
                src={project.padletUrl}
                className="w-full h-full border-0"
                allow="camera;microphone;geolocation;display-capture;clipboard-write"
                title="Padlet Board"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full size image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

    </div>
  );
}
