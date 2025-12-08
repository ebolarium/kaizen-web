import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongodb';
import Post from '@/lib/models/Post';

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

// GET - Get all blog posts
export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Fetch all posts, sorted by date descending
    const posts = await Post.find({}).sort({ date: -1 });

    // Transform to match original JSON structure
    const data = {
      posts: posts.map(p => ({
        id: p.postId,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        image: p.image,
        author: p.author,
        date: p.date.toISOString().split('T')[0],
        tags: p.tags,
        published: p.published
      }))
    };

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

    // Connect to database
    await connectDB();

    // Generate new post ID
    const newId = `post-${Date.now()}`;

    // Create new post
    const newPost = await Post.create({
      postId: newId,
      title: postData.title,
      excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
      content: postData.content,
      image: postData.image || '/images/blog/default.jpg',
      author: postData.author || 'Admin',
      date: new Date(),
      tags: postData.tags || [],
      published: postData.published !== undefined ? postData.published : true
    });

    // Return in original format
    return NextResponse.json({
      message: 'Blog post created successfully',
      post: {
        id: newPost.postId,
        title: newPost.title,
        excerpt: newPost.excerpt,
        content: newPost.content,
        image: newPost.image,
        author: newPost.author,
        date: newPost.date.toISOString().split('T')[0],
        tags: newPost.tags,
        published: newPost.published
      }
    });

  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
