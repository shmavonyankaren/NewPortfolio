import { OrderError, listOrdered, clearOrdered, createOrdered } from "@/lib/db/ordering";
import { connectDB } from "@/lib/db/connection";
import BlogPost from "@/lib/models/BlogPost";
import { NextRequest, NextResponse } from "next/server";

type Post = {
  order?: number;
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
    const blogs: Post[] = await listOrdered(BlogPost);
    return new Response(JSON.stringify(blogs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
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
    const { title, content, imageUrl, order } = await req.json();
    const newBlogPost = await createOrdered(BlogPost, { title, content, imageUrl, order });
    const savedPost: Post = newBlogPost;
    return new Response(JSON.stringify(savedPost), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
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
    await clearOrdered(BlogPost);
    return NextResponse.json(
      { message: "All blog posts deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
    return new Response(
      JSON.stringify({ message: "Error deleting blog posts", error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
