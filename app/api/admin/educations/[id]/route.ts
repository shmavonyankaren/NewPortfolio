import { connectDB } from "@/lib/db/connection";
import { Education } from "@/lib/models/Education";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const education = await Education.findById(id);
    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(education);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch education" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();
    const education = await Education.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(education);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update education" },
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
    const education = await Education.findByIdAndDelete(id);
    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Education deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete education" },
      { status: 500 }
    );
  }
}
