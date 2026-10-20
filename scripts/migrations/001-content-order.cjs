const { MongoClient } = require("mongodb");
const MIGRATION = "001-content-order";
const collections = {
  educations: "startDate", jobs: "startDate", projects: "createdAt",
  skillsets: "createdAt", certificates: "createdAt", comments: "createdAt",
  blogposts: "createdAt", insights: "createdAt",
};

async function plan(db, name, dateField, session) {
  const rows = await db.collection(name).find({}, { session }).sort({ [dateField]: -1, _id: 1 }).toArray();
  // Retain configured positions; append unmigrated rows in the previous date order.
  const valid = row => Number.isInteger(row.order) && row.order > 0;
  rows.sort((a, b) => valid(a) && valid(b) ? a.order - b.order : valid(a) ? -1 : valid(b) ? 1 : 0);
  let orders = 0, emojis = 0;
  const operations = rows.flatMap((row, index) => {
    const fields = {};
    if (row.order !== index + 1) { fields.order = index + 1; orders++; }
    if (name === "skillsets" && typeof row.emoji !== "string") { fields.emoji = ""; emojis++; }
    return Object.keys(fields).length ? [{ updateOne: { filter: { _id: row._id }, update: { $set: fields } } }] : [];
  });
  return { operations, summary: { collection: name, records: rows.length, orders, emojis } };
}

async function migrate(client, db, { dryRun = true } = {}) {
  const results = [];
  for (const [name, dateField] of Object.entries(collections)) {
    if (dryRun) {
      results.push((await plan(db, name, dateField)).summary);
      continue;
    }
    // Use the same lock as runtime writes. Each collection is atomic and rerunnable.
    const locks = db.collection("contentorderlocks");
    await locks.updateOne({ _id: name }, { $setOnInsert: { revision: 0 } }, { upsert: true });
    const session = client.startSession();
    try {
      const summary = await session.withTransaction(async () => {
        await locks.updateOne({ _id: name }, { $inc: { revision: 1 } }, { session });
        const { operations, summary } = await plan(db, name, dateField, session);
        if (operations.length) await db.collection(name).bulkWrite(operations, { session });
        await db.collection("schema_migrations").updateOne(
          { _id: MIGRATION + ":" + name },
          { $setOnInsert: { appliedAt: new Date(), summary } },
          { upsert: true, session }
        );
        return summary;
      });
      results.push(summary);
    } finally { await session.endSession(); }
  }
  return results;
}

module.exports = { migrate };
if (require.main === module) {
  require("@next/env").loadEnvConfig(process.cwd());
  const dryRun = !process.argv.includes("--apply");
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("MONGODB_URI is required."); process.exitCode = 1; }
  else {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
    (async () => {
      try {
        await client.connect();
        console.log(dryRun ? "Migration preview (no writes)" : "Applying content ordering migration");
        console.table(await migrate(client, client.db(), { dryRun }));
      } catch (error) {
        // Do not print connection strings or credential-bearing connection errors.
        console.error("Migration failed:", error.codeName || error.name, "code:", error.code || "unknown");
        process.exitCode = 1;
      } finally { await client.close(); }
    })();
  }
}
