import { connectDB } from "@/lib/db/connection";
import { Education } from "@/lib/models/Education";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const educations = await Education.find().sort({ startDate: -1 });
    return NextResponse.json(educations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch educations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const education = await Education.create(data);
    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create education" },
      { status: 500 }
    );
  }
}
