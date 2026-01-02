import { connectDB } from "@/lib/db/connection";
import { Skillset as SkillsetModel } from "@/lib/models/Skillset";
import { NextRequest, NextResponse } from "next/server";

type Skillset = {
  _id?: string;
  title: string;
  skills: Array<{
    name: string;
  }>;
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const skillsets = await SkillsetModel.find().sort({ createdAt: -1 });
    return NextResponse.json(skillsets);
  } catch (error) {
    console.error("Failed to fetch skillsets:", error);
    return NextResponse.json(
      { error: "Failed to fetch skillsets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data: Skillset = await request.json();

    // Log incoming data for debugging
    console.log("Incoming skillset data:", JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.title) {
      console.warn("Missing required field: title");
      return NextResponse.json(
        { error: "Missing required field: title" },
        { status: 400 }
      );
    }

    // Ensure skills is an array of objects
    if (!Array.isArray(data.skills)) {
      data.skills = [];
    }
    data.skills = data.skills
      .map((skill: string | { name?: string }) => {
        if (!skill) return null;
        if (typeof skill === "string") {
          return { name: skill };
        }
        if (skill.name) {
          return {
            name: String(skill.name).trim(),
          };
        }
        return null;
      })
      .filter(
        (skill): skill is { name: string } =>
          skill !== null && skill.name.length > 0
      );

    console.log("Skills after processing:", JSON.stringify(data.skills));

    const newSkillset = new SkillsetModel({
      title: data.title,
      skills: data.skills,
    });

    await newSkillset.save();
    console.log("Skillset created successfully:", newSkillset._id);

    return NextResponse.json(newSkillset, { status: 201 });
  } catch (error) {
    console.error("Failed to create skillset:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to create skillset", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create skillset" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    await SkillsetModel.deleteMany({});
    console.log("All skillsets deleted successfully");
    return NextResponse.json(
      { message: "All skillsets deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete all skillsets:", error);
    return NextResponse.json(
      { error: "Failed to delete all skillsets" },
      { status: 500 }
    );
  }
}
