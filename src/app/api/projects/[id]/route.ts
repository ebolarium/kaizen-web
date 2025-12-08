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

// GET - Get specific project (public access)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Connect to database
    await connectDB();

    // Find project by projectId
    const project = await Project.findOne({ projectId: id });

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Return in original format
    return NextResponse.json({
      id: project.projectId,
      category: project.category,
      title: project.title,
      description: project.description,
      content: project.content,
      image: project.image,
      gallery: project.gallery,
      activities: project.activities.map(a => ({
        id: a.activityId,
        content: a.content,
        images: a.images
      })),
      date: project.date.toISOString().split('T')[0],
      status: project.status,
      ...(project.partners && { partners: project.partners })
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error reading project:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update project (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const projectData = await request.json();

    // Connect to database
    await connectDB();

    // Find and update project
    const project = await Project.findOne({ projectId: id });

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Update fields
    project.title = projectData.title || project.title;
    project.description = projectData.description !== undefined ? projectData.description : project.description;
    project.content = projectData.content !== undefined ? projectData.content : project.content;
    project.image = projectData.image || project.image;
    project.category = projectData.category || project.category;
    project.gallery = projectData.gallery !== undefined ? projectData.gallery : project.gallery;
    project.activities = projectData.activities !== undefined
      ? projectData.activities.map((activity: any) => ({
        activityId: activity.id || activity.activityId,
        content: activity.content,
        images: activity.images || []
      }))
      : project.activities;
    project.status = projectData.status || project.status;
    if (projectData.partners) {
      project.partners = projectData.partners;
    }

    await project.save();

    // Return in original format
    return NextResponse.json({
      message: 'Project updated successfully',
      project: {
        id: project.projectId,
        title: project.title,
        description: project.description,
        content: project.content,
        image: project.image,
        gallery: project.gallery,
        activities: project.activities.map(a => ({
          id: a.activityId,
          content: a.content,
          images: a.images
        })),
        date: project.date.toISOString().split('T')[0],
        status: project.status,
        ...(project.partners && { partners: project.partners })
      }
    });

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Connect to database
    await connectDB();

    // Find and delete project
    const project = await Project.findOneAndDelete({ projectId: id });

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Return in original format
    return NextResponse.json({
      message: 'Project deleted successfully',
      project: {
        id: project.projectId,
        title: project.title,
        description: project.description,
        content: project.content,
        image: project.image,
        gallery: project.gallery,
        activities: project.activities.map(a => ({
          id: a.activityId,
          content: a.content,
          images: a.images
        })),
        date: project.date.toISOString().split('T')[0],
        status: project.status,
        ...(project.partners && { partners: project.partners })
      }
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
