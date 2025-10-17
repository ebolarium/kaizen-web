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

// Helper function to read blog posts
function readBlogPosts() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// Helper function to write blog posts
function writeBlogPosts(data: any) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET - Get all blog posts
export async function GET() {
  try {
    const data = readBlogPosts();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const postData = await request.json();
    
    // Validate required fields
    if (!postData.title || !postData.content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }

    const data = readBlogPosts();
    
    // Generate new post ID
    const newId = `post-${Date.now()}`;
    
    // Create new post
    const newPost = {
      id: newId,
      title: postData.title,
      excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
      content: postData.content,
      image: postData.image || '/images/blog/default.jpg',
      author: postData.author || 'Admin',
      date: new Date().toISOString().split('T')[0],
      tags: postData.tags || [],
      published: postData.published !== undefined ? postData.published : true
    };

    // Add to posts array
    data.posts.unshift(newPost);
    
    // Write back to file
    writeBlogPosts(data);

    return NextResponse.json({
      message: 'Blog post created successfully',
      post: newPost
    });

  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

