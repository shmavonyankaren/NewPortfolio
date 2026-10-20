import { orderHandler } from "@/lib/db/order-handler";
import { OrderError, updateOrdered, deleteOrdered } from "@/lib/db/ordering";
import { connectDB } from "@/lib/db/connection";
import { Skillset as SkillsetModel } from "@/lib/models/Skillset";
import { NextRequest, NextResponse } from "next/server";

type Skillset = {
  order?: number;
  image: string;
  _id?: string;
  title: string;
  skills: Array<{
    name: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const skillset: Skillset | null = await SkillsetModel.findById(id);
    if (!skillset) {
      return NextResponse.json(
        { error: "Skillset not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(skillset);
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      {
        error: `Failed to fetch skillset: ${
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
    const data: Skillset = await request.json();
    if (typeof data.image !== "string" || !data.image.trim()) {
      return NextResponse.json({ error: "A skillset image is required." }, { status: 400 });
    }

    // Log incoming data for debugging
    console.log(
      "Updating skillset",
      id,
      "with data:",
      JSON.stringify(data, null, 2)
    );

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

    const updatedSkillset = await updateOrdered(SkillsetModel,
      id,
      {
        order: data.order,
      image: data.image.trim(),
      title: data.title,
        skills: data.skills,
      });

    if (!updatedSkillset) {
      return NextResponse.json(
        { error: "Skillset not found" },
        { status: 404 }
      );
    }

    console.log("Skillset updated successfully:", updatedSkillset._id);
    return NextResponse.json(updatedSkillset);
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Failed to update skillset:", error);
    return NextResponse.json(
      {
        error: `Failed to update skillset: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
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
    const deletedSkillset = await deleteOrdered(SkillsetModel, id);
    if (!deletedSkillset) {
      return NextResponse.json(
        { error: "Skillset not found" },
        { status: 404 }
      );
    }
    console.log("Skillset deleted successfully:", id);
    return NextResponse.json({ message: "Skillset deleted successfully" });
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      {
        error: `Failed to delete skillset: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}

export const PATCH = orderHandler(SkillsetModel);
