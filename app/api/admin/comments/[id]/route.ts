import { orderHandler } from "@/lib/db/order-handler";
import { OrderError, updateOrdered, deleteOrdered } from "@/lib/db/ordering";
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
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
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
    const deletedComment = await deleteOrdered(Insight, id);
    if (!deletedComment) {
      return NextResponse.json(
        { error: `Comment with id ${id} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(deletedComment);
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
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
      const updatedComment = await updateOrdered(Insight, id, data);
      if (!updatedComment) {
        return NextResponse.json(
          { error: `Comment with id ${id} not found` },
          { status: 404 }
        );
      }
      return NextResponse.json(updatedComment);
    } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(
        { error: `Failed to update comment ${error}` },
        { status: 500 }
      );
    }
  }
}

export const PATCH = orderHandler(Insight);
