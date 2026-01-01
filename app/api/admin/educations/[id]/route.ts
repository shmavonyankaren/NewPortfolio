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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const education: Education | null = await EducationModel.findById(id);
    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(education);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to fetch education: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
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
    const data: Education = await request.json();

    // Log incoming data for debugging
    console.log(
      "Updating education",
      id,
      "with data:",
      JSON.stringify(data, null, 2)
    );

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

    // Remove _id from update data to avoid conflicts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = data;

    console.log(
      "Updating with processed data:",
      JSON.stringify(updateData, null, 2)
    );
    console.log("Updating skills:", JSON.stringify(updateData.skills, null, 2));

    // Fetch existing education
    const education = await EducationModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    console.log("Education updated successfully:", education._id);
    console.log("Final education object:", JSON.stringify(education, null, 2));
    return NextResponse.json(education);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Failed to update education - Error:", errorMessage);
    console.error("Stack trace:", errorStack);

    return NextResponse.json(
      {
        error: `Failed to update education: ${errorMessage}`,
        message: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
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
    const education = await EducationModel.findByIdAndDelete(id);
    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Education deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to delete education: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
