import { connectDB } from "@/lib/db/connection";
import { Certificate as CertificateModel } from "@/lib/models/Certificate";
import { NextRequest, NextResponse } from "next/server";

type Certificate = {
  _id?: string;
  title: string;
  issuer: string;
  dateIssued: string;
  description: string;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
};

const normalize = (doc: any) => {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  if (obj.dateIssued) {
    const d = new Date(obj.dateIssued);
    if (!Number.isNaN(d.getTime())) obj.dateIssued = d.toISOString();
  }
  return obj;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const certificate = await CertificateModel.findById(id);
    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(normalize(certificate));
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to fetch certificate: ${
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
    const data: Certificate = await request.json();

    console.log(
      "Updating certificate",
      id,
      "with data:",
      JSON.stringify(data, null, 2)
    );

    if (!data.dateIssued || Number.isNaN(new Date(data.dateIssued).getTime())) {
      return NextResponse.json(
        { error: "Invalid or missing dateIssued" },
        { status: 400 }
      );
    }
    const updatedCertificate = await CertificateModel.findByIdAndUpdate(
      id,
      {
        title: data.title,
        issuer: data.issuer,
        dateIssued: new Date(data.dateIssued),
        description: data.description,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileType: data.fileType,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCertificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    console.log("Certificate updated successfully:", updatedCertificate._id);
    return NextResponse.json(normalize(updatedCertificate));
  } catch (error) {
    console.error("Failed to update certificate:", error);
    return NextResponse.json(
      {
        error: `Failed to update certificate: ${
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
    const deletedCertificate = await CertificateModel.findByIdAndDelete(id);
    if (!deletedCertificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }
    console.log("Certificate deleted successfully:", id);
    return NextResponse.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to delete certificate: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
