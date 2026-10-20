import { OrderError, listOrdered, clearOrdered, createOrdered } from "@/lib/db/ordering";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/lib/models/Comment";
import { connectDB } from "@/lib/db/connection";

export async function GET() {
  try {
    await connectDB();
    const comments = await listOrdered(Comment);
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Failed to fetch comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, position, comment, image, order } = body;

    if (!name || !position || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newComment = await createOrdered(Comment, {
      name,
      position,
      comment,
      order,
      image: image || "",
    });


    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Failed to create comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await clearOrdered(Comment);
    return NextResponse.json(
      { message: "All comments deleted" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Failed to delete all comments:", error);
    return NextResponse.json(
      { error: "Failed to delete all comments" },
      { status: 500 }
    );
  }
}
