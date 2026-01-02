import { NextRequest, NextResponse } from "next/server";
import GeneralInfo from "@/lib/models/GeneralInfo";
import { connectDB } from "@/lib/db/connection";

export async function GET() {
  try {
    await connectDB();
    const info = await GeneralInfo.findOne({});
    return NextResponse.json(info || {}, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch general info:", error);
    return NextResponse.json(
      { error: "Failed to fetch general info" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userPhoto, fullName, shortAbout, fullDescription } = body;

    if (!fullName || !shortAbout || !fullDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Delete existing info and create new one
    await GeneralInfo.deleteMany({});

    const info = new GeneralInfo({
      userPhoto,
      fullName,
      shortAbout,
      fullDescription,
    });

    await info.save();
    return NextResponse.json(info, { status: 201 });
  } catch (error) {
    console.error("Failed to create general info:", error);
    return NextResponse.json(
      { error: "Failed to create general info" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userPhoto, fullName, shortAbout, fullDescription } = body;

    if (!fullName || !shortAbout || !fullDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const info = await GeneralInfo.findOneAndUpdate(
      {},
      {
        userPhoto,
        fullName,
        shortAbout,
        fullDescription,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(info, { status: 200 });
  } catch (error) {
    console.error("Failed to update general info:", error);
    return NextResponse.json(
      { error: "Failed to update general info" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await GeneralInfo.deleteMany({});
    return NextResponse.json(
      { message: "General info deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete general info:", error);
    return NextResponse.json(
      { error: "Failed to delete general info" },
      { status: 500 }
    );
  }
}
