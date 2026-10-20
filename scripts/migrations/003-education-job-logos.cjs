const { MongoClient } = require("mongodb");
const MIGRATION = "003-education-job-logos";
const DEFAULT_IMAGE = "/assets/images/logo1.png";
async function plan(db, name, session) {
  const field = "logo";
  const rows = await db.collection(name).find({}, { session, projection: { [field]: 1 } }).toArray();
  const missing = rows.filter(row => typeof row.logo !== "string" || !row.logo.trim());
  return {
    operations: missing.map(row => ({ updateOne: {
      filter: { _id: row._id }, update: { $set: { [field]: DEFAULT_IMAGE } }
    } })),
    summary: { collection: name, records: rows.length, imagesToFill: missing.length }
  };
}
async function migrate(client, db, { dryRun = true } = {}) {
  const results = [];
  for (const name of ["educations", "jobs"]) {
    if (dryRun) { results.push((await plan(db, name)).summary); continue; }
    const locks = db.collection("contentorderlocks");
    await locks.updateOne({ _id: name }, { $setOnInsert: { revision: 0 } }, { upsert: true });
    const session = client.startSession();
    try {
      results.push(await session.withTransaction(async () => {
        await locks.updateOne({ _id: name }, { $inc: { revision: 1 } }, { session });
        const { operations, summary } = await plan(db, name, session);
        if (operations.length) await db.collection(name).bulkWrite(operations, { session });
        await db.collection("schema_migrations").updateOne(
          { _id: MIGRATION + ":" + name },
          { $setOnInsert: { appliedAt: new Date(), summary } },
          { upsert: true, session }
        );
        return summary;
      }));
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
        console.log(dryRun ? "Migration preview (no writes)" : "Applying education and job logo migration");
        console.table(await migrate(client, client.db(), { dryRun }));
      } catch (error) {
        // Do not print connection strings or credential-bearing connection errors.
        console.error("Migration failed:", error.codeName || error.name, "code:", error.code || "unknown");
        process.exitCode = 1;
      } finally { await client.close(); }
    })();
  }
}
