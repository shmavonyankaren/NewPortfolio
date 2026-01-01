import { connectDB } from "@/lib/db/connection";
import { Job as JobModel } from "@/lib/models/Job";
import { NextRequest, NextResponse } from "next/server";

type Job = {
  _id?: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyWorking: boolean;
  skills: Array<{
    name: string;
    image?: string;
  }>;
  responsibilities: Array<{
    name: string;
  }>;
  logo?: string;
};

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const job: Job | null = await JobModel.findById(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to fetch job: ${
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
    const data: Job = await request.json();

    // Log incoming data for debugging
    console.log(
      "Updating job",
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

    // Ensure responsibilities is an array of objects
    if (!Array.isArray(data.responsibilities)) {
      data.responsibilities = [];
    }
    data.responsibilities = data.responsibilities
      .map((resp: string | { name?: string }) => {
        if (!resp) return null;
        if (typeof resp === "string") {
          return { name: resp };
        }
        if (resp.name) {
          return { name: String(resp.name).trim() };
        }
        return null;
      })
      .filter(
        (resp): resp is { name: string } =>
          resp !== null && resp.name.length > 0
      );

    // Remove _id from update data to avoid conflicts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = data;

    console.log(
      "Updating with processed data:",
      JSON.stringify(updateData, null, 2)
    );

    const job = await JobModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    console.log("Job updated successfully:", job._id);
    return NextResponse.json(job);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Failed to update job - Error:", errorMessage);
    console.error("Stack trace:", errorStack);

    return NextResponse.json(
      {
        error: `Failed to update job: ${errorMessage}`,
        message: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const job = await JobModel.findByIdAndDelete(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to delete job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
