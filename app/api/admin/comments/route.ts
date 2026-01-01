import { connectDB } from "@/lib/db/connection";
import { Insight } from "@/lib/models/Insight";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const comments = await Insight.find().sort({ createdAt: -1 });
    return NextResponse.json(comments);
  } catch (error) {
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
    const comment = await Insight.create(data);
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create comment ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await Insight.deleteMany({});
    return NextResponse.json(
      { message: "All comments deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete comments ${error}` },
      { status: 500 }
    );
  }
}
