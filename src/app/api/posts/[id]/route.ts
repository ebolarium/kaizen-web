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

// GET - Get specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = readBlogPosts();
    const post = data.posts.find((p: any) => p.id === id);
    
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error reading blog post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update blog post
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
    const postData = await request.json();
    const data = readBlogPosts();
    
    // Find the post index
    const postIndex = data.posts.findIndex((p: any) => p.id === id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Update the post
    data.posts[postIndex] = {
      ...data.posts[postIndex],
      title: postData.title || data.posts[postIndex].title,
      excerpt: postData.excerpt || data.posts[postIndex].excerpt,
      content: postData.content || data.posts[postIndex].content,
      image: postData.image || data.posts[postIndex].image,
      author: postData.author || data.posts[postIndex].author,
      tags: postData.tags || data.posts[postIndex].tags,
      published: postData.published !== undefined ? postData.published : data.posts[postIndex].published,
      updatedAt: new Date().toISOString()
    };
    
    // Write back to file
    writeBlogPosts(data);

    return NextResponse.json({
      message: 'Blog post updated successfully',
      post: data.posts[postIndex]
    });

  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = readBlogPosts();
    
    // Find the post index
    const postIndex = data.posts.findIndex((p: any) => p.id === params.id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Remove the post
    const deletedPost = data.posts.splice(postIndex, 1)[0];
    
    // Write back to file
    writeBlogPosts(data);

    return NextResponse.json({
      message: 'Blog post deleted successfully',
      post: deletedPost
    });

  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

