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

// GET - Get specific blog post (public access)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Connect to database
    await connectDB();

    // Find post by postId
    const post = await Post.findOne({ postId: id });

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Return in original format
    return NextResponse.json({
      id: post.postId,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      date: post.date.toISOString().split('T')[0],
      tags: post.tags,
      published: post.published
    });
  } catch (error) {
    console.error('Error reading post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update blog post (admin only)
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

    // Connect to database
    await connectDB();

    // Find and update post
    const post = await Post.findOne({ postId: id });

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Update fields
    post.title = postData.title || post.title;
    post.excerpt = postData.excerpt !== undefined ? postData.excerpt : post.excerpt;
    post.content = postData.content !== undefined ? postData.content : post.content;
    post.image = postData.image || post.image;
    post.author = postData.author || post.author;
    post.tags = postData.tags !== undefined ? postData.tags : post.tags;
    post.published = postData.published !== undefined ? postData.published : post.published;

    await post.save();

    // Return in original format
    return NextResponse.json({
      message: 'Post updated successfully',
      post: {
        id: post.postId,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        author: post.author,
        date: post.date.toISOString().split('T')[0],
        tags: post.tags,
        published: post.published
      }
    });

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post (admin only)
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

    // Find and delete post
    const post = await Post.findOneAndDelete({ postId: id });

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Return in original format
    return NextResponse.json({
      message: 'Post deleted successfully',
      post: {
        id: post.postId,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        author: post.author,
        date: post.date.toISOString().split('T')[0],
        tags: post.tags,
        published: post.published
      }
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
