import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

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

// Helper function to read projects
function readProjects() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'projects.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// Helper function to write projects
function writeProjects(data: { local: any[]; erasmus: any }) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'projects.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET - Get all projects (public access)
export async function GET() {
  try {
    const data = readProjects();
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

    const data = readProjects();
    
    // Generate new project ID
    const newId = `${projectData.category.toLowerCase()}-${Date.now()}`;
    
    // Create new project
    const newProject = {
      id: newId,
      title: projectData.title,
      description: projectData.description || '',
      content: projectData.content || '',
      image: projectData.image || '/images/projects/default.jpg',
      gallery: projectData.gallery || [],
      activities: projectData.activities || [],
      date: new Date().toISOString().split('T')[0],
      status: projectData.status || 'active',
      ...(projectData.partners && { partners: projectData.partners })
    };

    // Add to appropriate category
    if (projectData.category === 'local') {
      data.local.push(newProject);
    } else if (projectData.category === 'k152') {
      data.erasmus.k1.k152.push(newProject);
    } else if (projectData.category === 'k153') {
      data.erasmus.k1.k153.push(newProject);
    } else if (projectData.category === 'k210') {
      data.erasmus.k2.k210.push(newProject);
    } else if (projectData.category === 'k220') {
      data.erasmus.k2.k220.push(newProject);
    } else {
      return NextResponse.json(
        { message: 'Invalid category' },
        { status: 400 }
      );
    }
    
    // Write back to file
    writeProjects(data);

    return NextResponse.json({
      message: 'Project created successfully',
      project: newProject
    });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
