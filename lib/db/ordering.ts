/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { type Model, type ClientSession } from "mongoose";

export class OrderError extends Error {}
export function position(value: unknown, fallback: number, maximum: number) {
  const order = value === undefined ? fallback : value;
  if (typeof order !== "number" || !Number.isInteger(order) || order < 1 || order > maximum) {
    throw new OrderError("Order must be an integer from 1 to " + maximum + ".");
  }
  return order;
}

// Serialize writes per collection, including simultaneous first inserts.
const Lock = mongoose.models.ContentOrderLock || mongoose.model("ContentOrderLock",
  new mongoose.Schema({ _id: String, revision: { type: Number, default: 0 } }));

async function transaction<T>(model: Model<any>, operation: (session: ClientSession) => Promise<T>): Promise<T> {
  await Lock.updateOne({ _id: model.collection.name }, { $setOnInsert: { revision: 0 } }, { upsert: true });
  return mongoose.connection.transaction(async session => {
    await Lock.updateOne({ _id: model.collection.name }, { $inc: { revision: 1 } }, { session });
    return operation(session);
  });
}

async function orderedForWrite(model: Model<any>, session: ClientSession) {
  const docs = await model.find().sort({ order: 1, _id: 1 }).session(session);
  if (docs.some((doc, index) => doc.get("order") !== index + 1)) {
    throw new OrderError("Existing records need migration. Run npm run migrate:content-order before editing.");
  }
  return docs;
}

export async function listOrdered(model: Model<any>) {
  // Reads never migrate data. The date fallback keeps legacy lists readable during rollout.
  const legacy = ["Education", "Job"].includes(model.modelName) ? "startDate" : "createdAt";
  return model.find().sort({ order: 1, [legacy]: -1, _id: 1 });
}

export async function createOrdered(model: Model<any>, data: Record<string, any>) {
  return transaction(model, async session => {
    const docs = await orderedForWrite(model, session);
    const order = position(data.order, docs.length + 1, docs.length + 1);
    const clean: Record<string, any> = { ...data, order };
    delete clean._id;
    const doc = new model(clean);
    await doc.validate();
    await model.updateMany({ order: { $gte: order } }, { $inc: { order: 1 } }, { session, timestamps: false });
    await doc.save({ session });
    return doc;
  });
}

export async function updateOrdered(model: Model<any>, id: string, data: Record<string, any>) {
  return transaction(model, async session => {
    const docs = await orderedForWrite(model, session);
    const doc = docs.find(item => String(item._id) === id);
    if (!doc) return null;
    const previous = doc.order;
    const order = position(data.order, previous, docs.length);
    const clean: Record<string, any> = { ...data, order };
    delete clean._id;
    for (const [key, value] of Object.entries(clean)) {
      if (!key.startsWith("$") && !key.includes(".") && !["createdAt", "updatedAt", "__v"].includes(key)) doc.set(key, value);
    }
    await doc.validate();
    if (order < previous) {
      await model.updateMany({ order: { $gte: order, $lt: previous } }, { $inc: { order: 1 } }, { session, timestamps: false });
    } else if (order > previous) {
      await model.updateMany({ order: { $gt: previous, $lte: order } }, { $inc: { order: -1 } }, { session, timestamps: false });
    }
    await doc.save({ session });
    return doc;
  });
}

export async function deleteOrdered(model: Model<any>, id: string) {
  return transaction(model, async session => {
    await orderedForWrite(model, session);
    const doc = await model.findByIdAndDelete(id, { session });
    if (doc) await model.updateMany({ order: { $gt: doc.order } }, { $inc: { order: -1 } }, { session, timestamps: false });
    return doc;
  });
}

export async function clearOrdered(model: Model<any>) {
  return transaction(model, session => model.deleteMany({}, { session }));
}

export class OrderConflictError extends OrderError {}

export async function reorderOrdered(model: Model<any>, id: string, requestedOrder: unknown, expectedIds: unknown) {
  return transaction(model, async session => {
    const docs = await orderedForWrite(model, session);
    const doc = docs.find(item => String(item._id) === id);
    if (!doc) return null;
    if (!Array.isArray(expectedIds) || expectedIds.length !== docs.length ||
        docs.some((item, index) => String(item._id) !== expectedIds[index])) {
      throw new OrderConflictError("This list changed in another window. Refresh it and try again.");
    }
    const order = position(requestedOrder, doc.get("order"), docs.length);
    const previous = doc.get("order");
    if (order < previous) {
      await model.updateMany({ order: { $gte: order, $lt: previous } }, { $inc: { order: 1 } }, { session, timestamps: false });
    } else if (order > previous) {
      await model.updateMany({ order: { $gt: previous, $lte: order } }, { $inc: { order: -1 } }, { session, timestamps: false });
    }
    // Ordering must not revalidate or rewrite unrelated legacy content.
    await model.updateOne({ _id: doc._id }, { $set: { order } }, { session, timestamps: false });
    return model.find().sort({ order: 1, _id: 1 }).session(session);
  });
}
