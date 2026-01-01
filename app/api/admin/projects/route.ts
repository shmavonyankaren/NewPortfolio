import { connectDB } from "@/lib/db/connection";
import { Project, IProject } from "@/lib/models/Project";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    // Validate required fields
    const missingFields = [];
    if (!data.title) missingFields.push("title");
    if (!data.description) missingFields.push("description");
    if (!data.shortDescription) missingFields.push("shortDescription");
    if (!data.image) missingFields.push("image");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate status enum
    const validStatuses = ["Live & Maintained", "In Development", "Planned"];
    if (!validStatuses.includes(data.status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate teamType enum
    const validTeamTypes = ["solo", "team"];
    if (!validTeamTypes.includes(data.teamType)) {
      return NextResponse.json(
        {
          error: `Invalid teamType. Must be one of: ${validTeamTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Validate technologies array
    if (Array.isArray(data.technologies)) {
      for (const tech of data.technologies) {
        if (!tech.name) {
          return NextResponse.json(
            { error: "Each technology must have a name" },
            { status: 400 }
          );
        }
      }
    }

    // Validate features array
    if (Array.isArray(data.features)) {
      for (const feature of data.features) {
        if (!feature.title || !feature.description) {
          return NextResponse.json(
            { error: "Each feature must have a title and description" },
            { status: 400 }
          );
        }
      }
    }

    // Validate challenges array
    if (Array.isArray(data.challenges)) {
      for (const challenge of data.challenges) {
        if (!challenge.challenge || !challenge.solution) {
          return NextResponse.json(
            { error: "Each challenge must have a challenge and solution" },
            { status: 400 }
          );
        }
      }
    }

    const project = await Project.create(data);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await Project.deleteMany({});
    console.log("Projects deleted:", result.deletedCount);
    return NextResponse.json({
      message: "All projects deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Failed to delete projects:", error);
    return NextResponse.json(
      { error: "Failed to delete projects" },
      { status: 500 }
    );
  }
}
