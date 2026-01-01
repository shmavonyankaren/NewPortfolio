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

export async function GET() {
  try {
    await connectDB();
    const jobs = await JobModel.find().sort({ startDate: -1 });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data: Job = await request.json();

    // Log incoming data for debugging
    console.log("Incoming job data:", JSON.stringify(data, null, 2));

    // Validate required fields
    if (
      !data.company ||
      !data.position ||
      !data.description ||
      !data.startDate
    ) {
      console.warn("Missing required fields:", {
        company: !data.company,
        position: !data.position,
        description: !data.description,
        startDate: !data.startDate,
      });
      return NextResponse.json(
        {
          error:
            "Missing required fields: company, position, description, startDate",
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

    console.log(
      "Responsibilities after processing:",
      JSON.stringify(data.responsibilities)
    );

    console.log("Creating job with data:", JSON.stringify(data, null, 2));
    const job = await JobModel.create(data);
    console.log("Job created successfully:", job._id);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Failed to create job - Error:", errorMessage);
    console.error("Stack trace:", errorStack);

    return NextResponse.json(
      {
        error: "Failed to create job",
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
    const result = await JobModel.deleteMany({});
    console.log("Jobs deleted:", result.deletedCount);
    return NextResponse.json({
      message: "All jobs deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to delete jobs:", errorMessage);
    return NextResponse.json(
      { error: "Failed to delete jobs" },
      { status: 500 }
    );
  }
}
