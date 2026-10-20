/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Model, isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { OrderError, OrderConflictError, reorderOrdered } from "./ordering";

export function orderHandler(model: Model<any>) {
  return async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
      const body = await request.json();
      if (!body || typeof body.order !== "number" || !Number.isInteger(body.order)) {
        return NextResponse.json({ error: "Order must be an integer." }, { status: 400 });
      }
      await connectDB();
      const rows = await reorderOrdered(model, id, body.order, body.expectedIds);
      if (!rows) return NextResponse.json({ error: "Item not found" }, { status: 404 });
      return NextResponse.json(rows);
    } catch (error) {
      if (error instanceof OrderError) return NextResponse.json({ error: error.message }, {
        status: error instanceof OrderConflictError ? 409 : 400,
      });
      if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      console.error("Failed to reorder item:", error);
      return NextResponse.json({ error: "Could not save the new order. Please try again." }, { status: 500 });
    }
  };
}
