import { connectDB } from "@/lib/db/connection";
import { Project } from "@/lib/models/Project";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    console.log("Fetching project with ID:", id);
    const project = await Project.findById(id);
    if (!project) {
      console.error("Project not found with ID:", id);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("GET project error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
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

    console.log("Updating project with ID:", id, "Data:", data);

    // Validate status enum if provided
    if (data.status) {
      const validStatuses = ["Live & Maintained", "In Development", "Planned"];
      if (!validStatuses.includes(data.status)) {
        return NextResponse.json(
          {
            error: `Invalid status. Must be one of: ${validStatuses.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate teamType enum if provided
    if (data.teamType) {
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
    }

    // Validate technologies array if provided
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

    // Validate features array if provided
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

    // Validate challenges array if provided
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

    // Build the update object - only include fields that are provided
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.shortDescription !== undefined)
      updateData.shortDescription = data.shortDescription;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.technologies !== undefined)
      updateData.technologies = data.technologies;
    if (data.features !== undefined) updateData.features = data.features;
    if (data.challenges !== undefined) updateData.challenges = data.challenges;
    if (data.demoUrl !== undefined) updateData.demoUrl = data.demoUrl;
    if (data.githubUrl !== undefined) updateData.githubUrl = data.githubUrl;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.teamType !== undefined) updateData.teamType = data.teamType;
    if (data.status !== undefined) updateData.status = data.status;

    console.log("Update object being sent to Mongoose:", updateData);

    // First, check if the project exists
    const existingProject = await Project.findById(id);
    console.log("Existing project found:", existingProject ? "YES" : "NO");
    if (!existingProject) {
      console.error("Project does not exist with ID:", id);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: false, // Disable validators on partial updates to avoid issues
    });
    if (!project) {
      console.error("Failed to update project with ID:", id);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    console.log("Project updated successfully:", project);
    return NextResponse.json(project);
  } catch (error) {
    console.error("Project update error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Detailed error:", errorMessage);
    return NextResponse.json(
      {
        error: errorMessage || "Failed to update project",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
