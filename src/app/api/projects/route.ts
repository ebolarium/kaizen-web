import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to verify admin token
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// GET - Get all projects (public access)
export async function GET() {
  try {
    console.log('🔍 GET /api/projects called');

    // Connect to database
    console.log('📡 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Fetch all projects
    console.log('📂 Fetching projects from database...');
    const projects = await Project.find({}).sort({ date: -1 });
    console.log(`📊 Found ${projects.length} projects in database`);

    // Transform to match original JSON structure
    const data = {
      local: projects
        .filter(p => p.category === 'local')
        .map(p => ({
          id: p.projectId,
          title: p.title,
          description: p.description,
          content: p.content,
          image: p.image,
          gallery: p.gallery,
          activities: p.activities.map(a => ({
            id: a.activityId,
            content: a.content,
            images: a.images
          })),
          date: p.date.toISOString().split('T')[0],
          status: p.status,
          ...(p.partners && { partners: p.partners })
        })),
      erasmus: {
        k1: {
          k152: projects
            .filter(p => p.category === 'k152')
            .map(p => ({
              id: p.projectId,
              title: p.title,
              description: p.description,
              content: p.content,
              image: p.image,
              gallery: p.gallery,
              activities: p.activities.map(a => ({
                id: a.activityId,
                content: a.content,
                images: a.images
              })),
              date: p.date.toISOString().split('T')[0],
              status: p.status,
              ...(p.partners && { partners: p.partners })
            })),
          k153: projects
            .filter(p => p.category === 'k153')
            .map(p => ({
              id: p.projectId,
              title: p.title,
              description: p.description,
              content: p.content,
              image: p.image,
              gallery: p.gallery,
              activities: p.activities.map(a => ({
                id: a.activityId,
                content: a.content,
                images: a.images
              })),
              date: p.date.toISOString().split('T')[0],
              status: p.status,
              ...(p.partners && { partners: p.partners })
            }))
        },
        k2: {
          ka210: projects
            .filter(p => p.category === 'ka210')
            .map(p => ({
              id: p.projectId,
              title: p.title,
              description: p.description,
              content: p.content,
              image: p.image,
              gallery: p.gallery,
              activities: p.activities.map(a => ({
                id: a.activityId,
                content: a.content,
                images: a.images
              })),
              date: p.date.toISOString().split('T')[0],
              status: p.status,
              ...(p.partners && { partners: p.partners })
            })),
          k220: projects
            .filter(p => p.category === 'k220')
            .map(p => ({
              id: p.projectId,
              title: p.title,
              description: p.description,
              content: p.content,
              image: p.image,
              gallery: p.gallery,
              activities: p.activities.map(a => ({
                id: a.activityId,
                content: a.content,
                images: a.images
              })),
              date: p.date.toISOString().split('T')[0],
              status: p.status,
              ...(p.partners && { partners: p.partners })
            }))
        }
      }
    };

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const projectData = await request.json();

    // Validate required fields
    if (!projectData.title || !projectData.category) {
      return NextResponse.json(
        { message: 'Title and category are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Generate new project ID
    const newId = `${projectData.category.toLowerCase()}-${Date.now()}`;

    // Create new project
    const newProject = await Project.create({
      projectId: newId,
      category: projectData.category,
      title: projectData.title,
      description: projectData.description || '',
      content: projectData.content || '',
      image: projectData.image || '/images/Erasmus_Logo.png',
      gallery: projectData.gallery || [],
      activities: (projectData.activities || []).map((activity: any) => ({
        activityId: activity.id || `${Date.now()}`,
        content: activity.content,
        images: activity.images || []
      })),
      date: new Date(),
      status: projectData.status || 'active',
      ...(projectData.partners && { partners: projectData.partners })
    });

    // Return in original format
    return NextResponse.json({
      message: 'Project created successfully',
      project: {
        id: newProject.projectId,
        title: newProject.title,
        description: newProject.description,
        content: newProject.content,
        image: newProject.image,
        gallery: newProject.gallery,
        activities: newProject.activities.map(a => ({
          id: a.activityId,
          content: a.content,
          images: a.images
        })),
        date: newProject.date.toISOString().split('T')[0],
        status: newProject.status,
        ...(newProject.partners && { partners: newProject.partners })
      }
    });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

