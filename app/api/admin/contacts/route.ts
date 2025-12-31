import { connectDB } from "@/lib/db/connection";
import { Contact } from "@/lib/models/Contact";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const contacts = await Contact.find();
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    const requiredFields = ["email", "phone", "location"] as const;
    for (const field of requiredFields) {
      if (!data?.[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const contact = await Contact.create({
      email: data.email,
      phone: data.phone,
      location: data.location,
      linkedIn: data.linkedIn ?? "",
      github: data.github ?? "",
      twitter: data.twitter ?? "",
      website: data.website ?? "",
      cvUrl: data.cvUrl ?? "",
    });
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/contacts error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create contact",
      },
      { status: 500 }
    );
  }
}
