import { connectDB } from "@/lib/db/connection";
import { Contact } from "@/lib/models/Contact";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json(contact);
  } catch (error) {
    console.error("GET contact error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact" },
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

    console.log("Updating contact with ID:", id, "Data:", data);

    if (data.email === "" || data.phone === "" || data.location === "") {
      return NextResponse.json(
        { error: "Required fields cannot be empty" },
        { status: 400 }
      );
    }

    const update = {
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.linkedIn !== undefined ? { linkedIn: data.linkedIn ?? "" } : {}),
      ...(data.github !== undefined ? { github: data.github ?? "" } : {}),
      ...(data.twitter !== undefined ? { twitter: data.twitter ?? "" } : {}),
      ...(data.website !== undefined ? { website: data.website ?? "" } : {}),
      ...(data.cvUrl !== undefined ? { cvUrl: data.cvUrl ?? "" } : {}),
    };

    console.log("Update object being sent to Mongoose:", update);

    // First, check if the contact exists
    const existingContact = await Contact.findById(id);
    console.log("Existing contact found:", existingContact ? "YES" : "NO");
    if (!existingContact) {
      console.error("Contact does not exist with ID:", id);
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const contact = await Contact.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: false, // Disable validators on partial updates
    });
    if (!contact) {
      console.error("Failed to update contact with ID:", id);
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    console.log("Contact updated successfully:", contact);
    return NextResponse.json(contact);
  } catch (error) {
    console.error("PUT /api/admin/contacts/[id] error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update contact",
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
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("DELETE contact error:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
