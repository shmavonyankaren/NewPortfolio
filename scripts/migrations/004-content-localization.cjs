const { ObjectId, BSON, MongoClient } = require("mongodb");
const fs = require("node:fs");
const path = require("node:path");
const collections = { projects: ["technologies", "features", "challenges"], jobs: ["skills", "responsibilities"], educations: ["skills"], skillsets: ["skills"], generalinfos: [], certificates: [], insights: [], comments: [], blogposts: [], contacts: [] };

function changes(doc, fields, name) {
  const update = {};
  for (const field of fields) {
    if (!Array.isArray(doc[field])) continue;
    const items = doc[field];
    if (items.some(item => !item || typeof item !== "object")) throw new Error(`${name}: legacy ${field} contains non-object items; review before migration.`);
    const ids = items.filter(item => item._id).map(item => String(item._id));
    if (new Set(ids).size !== ids.length) throw new Error(`${name}: duplicate nested IDs require review.`);
    if (items.some(item => !item._id)) update[field] = items.map(item => item._id ? item : { ...item, _id: new ObjectId() });
  }
  if (name === "educations" && doc.outcomeItems === undefined && doc.learningOutcomes?.length) {
    if (!Array.isArray(doc.learningOutcomes) || doc.learningOutcomes.some(value => typeof value !== "string")) throw new Error("Review malformed learning outcomes before migration.");
    update.outcomeItems = doc.learningOutcomes.map(value => ({ _id: new ObjectId(), name: value }));
  }
  return update;
}

async function migrate(client, db, { dryRun = true, backupPath } = {}) {
  const snapshot = {};
  const plan = [];
  for (const [name, fields] of Object.entries(collections)) {
    const docs = await db.collection(name).find({}).toArray();
    snapshot[name] = docs;
    const writes = docs.map(doc => ({ doc, update: changes(doc, fields, name) })).filter(item => Object.keys(item.update).length);
    plan.push({ name, writes, records: docs.length, translated: docs.filter(doc => Object.values(doc.translations?.de || {}).some(Boolean)).length });
  }
  if (!dryRun) {
    if (!backupPath) throw new Error("An explicit --backup path is required before applying this migration.");
    // Exclusive create prevents overwriting a previous backup. Extended JSON preserves BSON types.
    fs.mkdirSync(path.dirname(path.resolve(backupPath)), {recursive: true});
    fs.writeFileSync(backupPath, BSON.EJSON.stringify({ database: db.databaseName, createdAt: new Date(), collections: snapshot }, {relaxed: false}), {flag: "wx", mode: 0o600});
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        for (const {name, writes} of plan) for (const {doc, update} of writes) {
          const filter = {_id: doc._id};
          for (const key of Object.keys(update)) filter[key] = doc[key] === undefined ? {$exists: false} : doc[key];
          if (update.outcomeItems) filter.learningOutcomes = doc.learningOutcomes;
          const result = await db.collection(name).updateOne(filter, {$set: update}, {session});
          if (result.matchedCount !== 1) throw new Error("Content changed during migration; no changes committed. Retry with a fresh backup.");
        }
        await db.collection("schema_migrations").updateOne({_id:"004-content-localization"}, {$set:{completedAt:new Date()}}, {upsert:true,session});
      });
    } finally { await session.endSession(); }
  }
  return plan.map(({name, records, translated, writes}) => ({collection:name,records,translated,recordsToUpdate:writes.length}));
}
module.exports = {migrate, changes};
if (require.main === module) {
  require("@next/env").loadEnvConfig(process.cwd());
  const dryRun = !process.argv.includes("--apply");
  const backupPath = process.argv.includes("--backup") ? process.argv[process.argv.indexOf("--backup") + 1] : undefined;
  (async () => {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required.");
    if (!dryRun && !backupPath) throw new Error("Use --apply --backup <private-backup-file> after reviewing the dry run.");
    const client = new MongoClient(process.env.MONGODB_URI, {serverSelectionTimeoutMS: 15000});
    try { await client.connect(); console.log(dryRun ? "Read-only localization preview" : "Applying localization identity migration"); console.table(await migrate(client, client.db(), {dryRun,backupPath})); }
    finally { await client.close(); }
  })().catch(error => { console.error(error.message); process.exitCode = 1; });
}
