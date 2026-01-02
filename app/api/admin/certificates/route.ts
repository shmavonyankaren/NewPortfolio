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

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const certificates = await CertificateModel.find().sort({ createdAt: -1 });
    return NextResponse.json(certificates.map(normalize));
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data: Certificate = await request.json();

    console.log("Incoming certificate data:", JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.title || !data.issuer || !data.description || !data.fileUrl) {
      console.warn("Missing required fields");
      return NextResponse.json(
        {
          error: "Missing required fields: title, issuer, description, fileUrl",
        },
        { status: 400 }
      );
    }

    if (!data.dateIssued || Number.isNaN(new Date(data.dateIssued).getTime())) {
      return NextResponse.json(
        { error: "Invalid or missing dateIssued" },
        { status: 400 }
      );
    }

    const newCertificate = new CertificateModel({
      title: data.title,
      issuer: data.issuer,
      dateIssued: new Date(data.dateIssued),
      description: data.description,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      fileType: data.fileType,
    });

    await newCertificate.save();
    console.log("Certificate created successfully:", newCertificate._id);

    return NextResponse.json(normalize(newCertificate), { status: 201 });
  } catch (error) {
    console.error("Failed to create certificate:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to create certificate", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    await CertificateModel.deleteMany({});
    console.log("All certificates deleted successfully");
    return NextResponse.json(
      { message: "All certificates deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete all certificates:", error);
    return NextResponse.json(
      { error: "Failed to delete all certificates" },
      { status: 500 }
    );
  }
}
