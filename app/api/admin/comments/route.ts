import { OrderError, listOrdered, createOrdered, clearOrdered } from "@/lib/db/ordering";
import { connectDB } from "@/lib/db/connection";
import { Insight } from "@/lib/models/Insight";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const comments = await listOrdered(Insight);
    return NextResponse.json(comments);
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      { error: `Failed to fetch comments ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const comment = await createOrdered(Insight, data);
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      { error: `Failed to create comment ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await clearOrdered(Insight);
    return NextResponse.json(
      { message: "All comments deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      { error: `Failed to delete comments ${error}` },
      { status: 500 }
    );
  }
}
