import { connectDB } from "@/lib/db/connection";
import { Education as EducationModel } from "@/lib/models/Education";
import { NextRequest, NextResponse } from "next/server";

type Education = {
  _id?: string;
  institution: string;
  degree?: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  logo?: string;
  isCurrentlyStudying: boolean;
  skills: Array<{
    name: string;
    image?: string;
  }>;
};

export async function GET() {
  try {
    await connectDB();
    const educations = await EducationModel.find().sort({ startDate: -1 });
    return NextResponse.json(educations);
  } catch (error) {
    console.error("Failed to fetch educations:", error);
    return NextResponse.json(
      { error: "Failed to fetch educations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data: Education = await request.json();

    // Log incoming data for debugging
    console.log("Incoming education data:", JSON.stringify(data, null, 2));

    // Validate required fields
    if (
      !data.institution ||
      !data.field ||
      !data.description ||
      !data.startDate
    ) {
      console.warn("Missing required fields:", {
        institution: !data.institution,
        field: !data.field,
        description: !data.description,
        startDate: !data.startDate,
      });
      return NextResponse.json(
        {
          error:
            "Missing required fields: institution, field, description, startDate",
        },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects
    if (typeof data.startDate === "string") {
      data.startDate = new Date(data.startDate);
      console.log("Converted startDate to:", data.startDate);
    }
    if (data.endDate && typeof data.endDate === "string") {
      data.endDate = new Date(data.endDate);
      console.log("Converted endDate to:", data.endDate);
    }

    // Ensure skills is an array of objects
    if (!Array.isArray(data.skills)) {
      data.skills = [];
    }
    data.skills = data.skills
      .map((skill: string | { name?: string; image?: string }) => {
        if (!skill) return null;
        if (typeof skill === "string") {
          return { name: skill };
        }
        if (skill.name) {
          return {
            name: String(skill.name).trim(),
            ...(skill.image && skill.image.trim()
              ? { image: skill.image.trim() }
              : {}),
          };
        }
        return null;
      })
      .filter(
        (skill): skill is { name: string; image?: string } =>
          skill !== null && skill.name.length > 0
      );

    console.log("Skills after processing:", JSON.stringify(data.skills));

    console.log("Creating education with data:", JSON.stringify(data, null, 2));
    const education = await EducationModel.create(data);
    console.log("Education created successfully:", education._id);
    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Failed to create education - Error:", errorMessage);
    console.error("Stack trace:", errorStack);

    return NextResponse.json(
      {
        error: "Failed to create education",
        message: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await EducationModel.deleteMany({});
    console.log("Educations deleted:", result.deletedCount);
    return NextResponse.json({
      message: "All educations deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to delete educations:", errorMessage);
    return NextResponse.json(
      { error: "Failed to delete educations" },
      { status: 500 }
    );
  }
}
