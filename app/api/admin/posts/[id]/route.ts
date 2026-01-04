import { connectDB } from "@/lib/db/connection";
import BlogPost from "@/lib/models/BlogPost";
import { NextRequest } from "next/server";

type Post = {
  _id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const blog: Post | null = await BlogPost.findById(id);
    if (!blog) {
      return new Response(JSON.stringify({ message: "Blog post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(blog), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching blog post", error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const deletedBlog: Post | null = await BlogPost.findByIdAndDelete(id);
    if (!deletedBlog) {
      return new Response(JSON.stringify({ message: "Blog post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ message: "Blog post deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error deleting blog post", error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const data = await req.json();
    const updatedBlog = await BlogPost.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedBlog) {
      console.error("Blog post not found with ID:", id);
      return new Response(JSON.stringify({ message: "Blog post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Blog post updated successfully:", updatedBlog._id);
    return new Response(JSON.stringify(updatedBlog), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT /api/admin/posts/[id] error:", error);
    return new Response(
      JSON.stringify({
        message: "Error updating blog post",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
