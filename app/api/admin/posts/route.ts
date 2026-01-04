import { connectDB } from "@/lib/db/connection";
import BlogPost from "@/lib/models/BlogPost";
import { NextRequest, NextResponse } from "next/server";

type Post = {
  _id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET(req: Request) {
  try {
    await connectDB();
    const blogs: Post[] = await BlogPost.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(blogs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching blog posts", error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { title, content, imageUrl } = await req.json();
    const newBlogPost = new BlogPost({ title, content, imageUrl });
    const savedPost: Post = await newBlogPost.save();
    return new Response(JSON.stringify(savedPost), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error creating blog post", error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    await BlogPost.deleteMany({});
    return NextResponse.json(
      { message: "All blog posts deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error deleting blog posts", error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
