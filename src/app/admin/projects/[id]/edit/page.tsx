'use client';

import { useState, useEffect, use, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  gallery: string[];
  category: string;
  status: string;
  date: string;
  activities?: Array<{
    id: string;
    content: string;
    images: string[];
  }>;
}

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    category: 'local',
    status: 'active'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [activities, setActivities] = useState<Array<{
    id: string;
    content: string;
    images: string[];
  }>>([]);
  const [newActivity, setNewActivity] = useState({
    content: '',
    images: [] as File[]
  });
  const [isUploadingActivity, setIsUploadingActivity] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingImages, setEditingImages] = useState<string[]>([]);
  const [editingNewImages, setEditingNewImages] = useState<File[]>([]);
  const [editingNewImagePreviews, setEditingNewImagePreviews] = useState<string[]>([]);
  const [isUpdatingActivity, setIsUpdatingActivity] = useState(false);
  const [draggingActivityId, setDraggingActivityId] = useState<string | null>(null);
  const [dragOverActivityId, setDragOverActivityId] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const project: Project = await response.json();
        setFormData({
          title: project.title,
          description: project.description,
          content: project.content,
          image: project.image,
          category: project.category,
          status: project.status
        });
        
        // Set image preview if image exists
        if (project.image) {
          setImagePreview(project.image);
        }

        // Set existing gallery images
        if (project.gallery && project.gallery.length > 0) {
          setExistingGallery(project.gallery);
        }

        // Set existing activities
        if (project.activities && project.activities.length > 0) {
          setActivities(project.activities);
        }
      } else {
        setError('Failed to load project');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Error loading project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        return data.url;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Validate all files
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          setError('Please select only image files');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError('Image size must be less than 5MB');
          return;
        }
      }

      setGalleryFiles(prev => [...prev, ...files]);
      
      // Create previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setGalleryPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index: number) => {
    setExistingGallery(prev => prev.filter((_, i) => i !== index));
  };

  const uploadGalleryImages = async (files: File[]) => {
    const uploadPromises = files.map(file => handleImageUpload(file));
    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== null) as string[];
  };

  const handleActivityImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewActivity({ ...newActivity, images: files });
  };

  const addActivity = async () => {
    if (!newActivity.content.trim()) return;

    setIsUploadingActivity(true);
    try {
      let imageUrls: string[] = [];
      if (newActivity.images.length > 0) {
        imageUrls = await uploadGalleryImages(newActivity.images);
      }

      const activity = {
        id: Date.now().toString(),
        content: newActivity.content,
        images: imageUrls
      };

      setActivities([...activities, activity]);
      setNewActivity({ content: '', images: [] });
      
      // CRITICAL: Preserve the original featured image - never change it when adding activities
      const originalImage = imagePreview || formData.image;
      if (originalImage) {
        setFormData(prev => ({ ...prev, image: originalImage }));
      }
    } catch (error) {
      console.error('Error adding activity:', error);
    } finally {
      setIsUploadingActivity(false);
    }
  };

  const removeActivity = (activityId: string) => {
    setActivities(activities.filter(activity => activity.id !== activityId));
  };

  const startEditActivity = (activity: { id: string; content: string; images: string[] }) => {
    setEditingActivityId(activity.id);
    setEditingContent(activity.content);
    setEditingImages(activity.images || []);
    setEditingNewImages([]);
    setEditingNewImagePreviews([]);
  };

  const cancelEditActivity = () => {
    setEditingActivityId(null);
    setEditingContent('');
    setEditingImages([]);
    setEditingNewImages([]);
    setEditingNewImagePreviews([]);
  };

  const handleEditActivityImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
    }

    setEditingNewImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingNewImagePreviews(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEditingImage = (index: number) => {
    setEditingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeEditingNewImage = (index: number) => {
    setEditingNewImages(prev => prev.filter((_, i) => i !== index));
    setEditingNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const saveEditedActivity = async () => {
    if (!editingActivityId) return;
    if (!editingContent.trim()) {
      setError('Activity content cannot be empty');
      return;
    }

    setIsUpdatingActivity(true);
    try {
      let newImageUrls: string[] = [];
      if (editingNewImages.length > 0) {
        newImageUrls = await uploadGalleryImages(editingNewImages);
      }

      const updatedImages = [...editingImages, ...newImageUrls];
      setActivities(prev => prev.map(activity => (
        activity.id === editingActivityId
          ? { ...activity, content: editingContent, images: updatedImages }
          : activity
      )));

      cancelEditActivity();
    } catch (error) {
      console.error('Error updating activity:', error);
      setError('Error updating activity');
    } finally {
      setIsUpdatingActivity(false);
    }
  };

  const handleDragStart = (activityId: string) => {
    setDraggingActivityId(activityId);
  };

  const handleDragEnd = () => {
    setDraggingActivityId(null);
    setDragOverActivityId(null);
  };

  const handleDropOnActivity = (targetActivityId: string) => {
    if (!draggingActivityId || draggingActivityId === targetActivityId) return;

    const fromIndex = activities.findIndex(activity => activity.id === draggingActivityId);
    const toIndex = activities.findIndex(activity => activity.id === targetActivityId);
    if (fromIndex === -1 || toIndex === -1) return;

    const updated = [...activities];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setActivities(updated);
    setDraggingActivityId(null);
    setDragOverActivityId(null);
  };

  const handleDragOverActivity = (activityId: string) => {
    if (draggingActivityId && draggingActivityId !== activityId) {
      setDragOverActivityId(activityId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      // CRITICAL: Always preserve the original featured image unless explicitly changed
      let imageUrl = formData.image || imagePreview;
      
      // Only change the image if a new file is explicitly uploaded
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setIsSaving(false);
          return;
        }
      }
      
      // Final safeguard: if imageUrl is still empty, use the original project image
      if (!imageUrl && imagePreview) {
        imageUrl = imagePreview;
      }

      // Upload new gallery images and combine with existing ones
      let galleryUrls: string[] = [...existingGallery];
      if (galleryFiles.length > 0) {
        setIsUploadingGallery(true);
        const newGalleryUrls = await uploadGalleryImages(galleryFiles);
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
        setIsUploadingGallery(false);
      }


      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
          gallery: galleryUrls.length > 0 ? galleryUrls : [],
          activities: activities
        })
      });

      if (response.ok) {
        router.push('/admin/projects');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setError('An error occurred while updating the project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/projects" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Project</h1>
          <p className="text-gray-600">Update project details and content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter project title"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Brief description of the project"
                />
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Content *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Detailed description of the project..."
                  height={300}
                />
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="local">Local Events</option>
                    <option value="k152">Erasmus+ KA152</option>
                    <option value="k153">Erasmus+ KA153</option>
                    <option value="ka210">Erasmus+ KA210</option>
                    <option value="k220">Erasmus+ KA220</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                
                {/* Current Image */}
                {formData.image && !imageFile && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current image:</p>
                    <img
                      src={formData.image}
                      alt="Current"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}

                {/* File Upload */}
                <div className="mb-4">
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a new image file (PNG, JPG, GIF) - Max 5MB
                  </p>
                </div>

                {/* Image Preview */}
                {imagePreview && imageFile && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">New image preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}

              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Images
                </label>
                
                {/* Existing Gallery Images */}
                {existingGallery.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current gallery images:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingGallery.map((imageUrl, index) => (
                        <div key={`existing-${index}`} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingGalleryImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery Upload */}
                <div className="mb-4">
                  <input
                    type="file"
                    id="galleryFiles"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload additional images for the project gallery (PNG, JPG, GIF) - Max 5MB each
                  </p>
                </div>

                {/* New Gallery Previews */}
                {galleryPreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">New images to add:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {galleryPreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <img
                            src={preview}
                            alt={`New Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Partners (for Erasmus projects) */}
            </div>

            {/* Activities Section */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Project Activities</h3>
                  <p className="text-sm text-gray-600">Add activity updates for this project (optional). Each activity can include text content and images.</p>
                </div>
                <div className="text-sm text-gray-500">
                  {activities.length} {activities.length === 1 ? 'activity' : 'activities'} added
                </div>
              </div>
              
              {/* Add New Activity */}
              <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-6 hover:border-gray-400 transition-colors">
                <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Activity
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Content
                    </label>
                    <RichTextEditor
                      value={newActivity.content}
                      onChange={(content) => setNewActivity({ ...newActivity, content })}
                      placeholder="Describe the activity update..."
                      height={200}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleActivityImageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-500">Select multiple images for this activity</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={addActivity}
                      disabled={!newActivity.content.trim() || isUploadingActivity}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {isUploadingActivity ? 'Adding Activity...' : 'Add Activity'}
                    </button>
                    {activities.length > 0 && (
                      <span className="text-sm text-gray-500">
                        You can add more activities after saving this one
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Existing Activities */}
              {activities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No activities added yet. Activities are optional and can be added later.</p>
                </div>
              )}

              {activities.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-700">Added Activities</h4>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <Fragment key={activity.id}>
                        {dragOverActivityId === activity.id && draggingActivityId !== activity.id && (
                          <div className="border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-lg p-4 h-24 mb-4" />
                        )}
                        <div
                          draggable
                          onDragStart={() => handleDragStart(activity.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => {
                            e.preventDefault();
                            handleDragOverActivity(activity.id);
                          }}
                          onDrop={() => handleDropOnActivity(activity.id)}
                          className={`border rounded-lg p-4 bg-gray-50 ${
                            draggingActivityId === activity.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                          }`}
                          title="Drag to reorder"
                        >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                              {index + 1}
                            </div>
                            <h5 className="text-sm font-medium text-gray-700">Activity #{index + 1}</h5>
                          </div>
                          <div className="flex items-center space-x-2">
                            {editingActivityId !== activity.id && (
                              <button
                                type="button"
                                onClick={() => startEditActivity(activity)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeActivity(activity.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        {editingActivityId === activity.id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Activity Content
                              </label>
                              <RichTextEditor
                                value={editingContent}
                                onChange={(content) => setEditingContent(content)}
                                placeholder="Update the activity content..."
                                height={200}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Existing Images
                              </label>
                              {editingImages.length === 0 ? (
                                <p className="text-sm text-gray-500">No images attached.</p>
                              ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {editingImages.map((image, imgIndex) => (
                                    <div key={imgIndex} className="relative group">
                                      <img
                                        src={image}
                                        alt={`Activity ${index + 1} image ${imgIndex + 1}`}
                                        className="w-full h-20 object-cover rounded-lg"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeEditingImage(imgIndex)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add New Images
                              </label>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleEditActivityImageChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {editingNewImagePreviews.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {editingNewImagePreviews.map((preview, imgIndex) => (
                                    <div key={imgIndex} className="relative group">
                                      <img
                                        src={preview}
                                        alt={`New activity image ${imgIndex + 1}`}
                                        className="w-full h-20 object-cover rounded-lg"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeEditingNewImage(imgIndex)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                type="button"
                                onClick={cancelEditActivity}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={saveEditedActivity}
                                disabled={isUpdatingActivity}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isUpdatingActivity ? 'Saving...' : 'Save'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {activity.content}
                              </ReactMarkdown>
                            </div>
                            {activity.images.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Images ({activity.images.length})</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {activity.images.map((image, imgIndex) => (
                                    <img
                                      key={imgIndex}
                                      src={image}
                                      alt={`Activity ${index + 1} image ${imgIndex + 1}`}
                                      className="w-full h-20 object-cover rounded-lg"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <Link
                href="/admin/projects"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving || isUploading || isUploadingGallery || isUploadingActivity}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading Image...' : isUploadingGallery ? 'Uploading Gallery...' : isUploadingActivity ? 'Adding Activity...' : isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
