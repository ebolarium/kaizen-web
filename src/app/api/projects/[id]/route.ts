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
function writeProjects(data: any) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'projects.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Helper function to find project by ID
function findProjectById(data: any, id: string) {
  // Search in local projects
  for (let i = 0; i < data.local.length; i++) {
    if (data.local[i].id === id) {
      return { project: data.local[i], category: 'local', index: i };
    }
  }
  
  // Search in K152 projects
  for (let i = 0; i < data.erasmus.k1.k152.length; i++) {
    if (data.erasmus.k1.k152[i].id === id) {
      return { project: data.erasmus.k1.k152[i], category: 'k152', index: i };
    }
  }
  
  // Search in K153 projects
  for (let i = 0; i < data.erasmus.k1.k153.length; i++) {
    if (data.erasmus.k1.k153[i].id === id) {
      return { project: data.erasmus.k1.k153[i], category: 'k153', index: i };
    }
  }
  
  // Search in KA210 projects
  for (let i = 0; i < data.erasmus.k2.ka210.length; i++) {
    if (data.erasmus.k2.ka210[i].id === id) {
      return { project: data.erasmus.k2.ka210[i], category: 'ka210', index: i };
    }
  }
  
  // Search in K220 projects
  for (let i = 0; i < data.erasmus.k2.k220.length; i++) {
    if (data.erasmus.k2.k220[i].id === id) {
      return { project: data.erasmus.k2.k220[i], category: 'k220', index: i };
    }
  }
  
  return null;
}

// GET - Get specific project (public access)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = readProjects();
    const result = findProjectById(data, id);
    
    if (!result) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...result.project,
      category: result.category
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
    const data = readProjects();
    
    // Find the project
    const result = findProjectById(data, id);
    
    if (!result) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Update the project
    const updatedProject = {
      ...result.project,
      title: projectData.title || result.project.title,
      description: projectData.description || result.project.description,
      content: projectData.content || result.project.content,
      image: projectData.image || result.project.image,
      gallery: projectData.gallery !== undefined ? projectData.gallery : result.project.gallery || [],
      activities: projectData.activities !== undefined ? projectData.activities : result.project.activities || [],
      status: projectData.status || result.project.status,
      ...(projectData.partners && { partners: projectData.partners })
    };

    // Update in the appropriate array
    if (result.category === 'local') {
      data.local[result.index] = updatedProject;
    } else if (result.category === 'k152') {
      data.erasmus.k1.k152[result.index] = updatedProject;
    } else if (result.category === 'k153') {
      data.erasmus.k1.k153[result.index] = updatedProject;
    } else if (result.category === 'ka210') {
      data.erasmus.k2.ka210[result.index] = updatedProject;
    } else if (result.category === 'k220') {
      data.erasmus.k2.k220[result.index] = updatedProject;
    }
    
    // Write back to file
    writeProjects(data);

    return NextResponse.json({
      message: 'Project updated successfully',
      project: updatedProject
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
    const data = readProjects();
    
    // Find the project
    const result = findProjectById(data, id);
    
    if (!result) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Remove from the appropriate array
    let deletedProject;
    if (result.category === 'local') {
      deletedProject = data.local.splice(result.index, 1)[0];
    } else if (result.category === 'k152') {
      deletedProject = data.erasmus.k1.k152.splice(result.index, 1)[0];
    } else if (result.category === 'k153') {
      deletedProject = data.erasmus.k1.k153.splice(result.index, 1)[0];
    } else if (result.category === 'ka210') {
      deletedProject = data.erasmus.k2.ka210.splice(result.index, 1)[0];
    } else if (result.category === 'k220') {
      deletedProject = data.erasmus.k2.k220.splice(result.index, 1)[0];
    }
    
    // Write back to file
    writeProjects(data);

    return NextResponse.json({
      message: 'Project deleted successfully',
      project: deletedProject
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
