import { connectDB } from "@/lib/db/connection";
import { Insight } from "@/lib/models/Insight";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const comment = await Insight.findById(id);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json(
      { error: `"Failed to fetch comment ${error}"` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const deletedComment = await Insight.findByIdAndDelete(id);
    if (!deletedComment) {
      return NextResponse.json(
        { error: `Comment with id ${id} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(deletedComment);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete comment ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  {
    try {
      await connectDB();
      const { id } = await params;
      const data = await request.json();
      const updatedComment = await Insight.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updatedComment) {
        return NextResponse.json(
          { error: `Comment with id ${id} not found` },
          { status: 404 }
        );
      }
      return NextResponse.json(updatedComment);
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to update comment ${error}` },
        { status: 500 }
      );
    }
  }
}
