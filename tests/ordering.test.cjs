const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");

// Compile project TypeScript in memory; no build output or production DB access.
require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  module._compile(outputText, filename);
};
require.extensions[".tsx"] = require.extensions[".ts"];
const { listOrdered, createOrdered, updateOrdered, deleteOrdered, clearOrdered, OrderError } =
  require("../lib/db/ordering.ts");
const { Skillset } = require("../lib/models/Skillset.ts");
const { Education } = require("../lib/models/Education.ts");
const { migrate } = require("../scripts/migrations/001-content-order.cjs");
const { migrate: migrateImages } = require("../scripts/migrations/002-content-images.cjs");
const { migrate: migrateLogos } = require("../scripts/migrations/003-education-job-logos.cjs");
const migrateExisting = async () => {
  const result = await migrate(mongoose.connection.getClient(), mongoose.connection.db, { dryRun: false });
  await migrateImages(mongoose.connection.getClient(), mongoose.connection.db, { dryRun: false });
  await migrateLogos(mongoose.connection.getClient(), mongoose.connection.db, { dryRun: false });
  return result;
};
let server;
before(async () => {
  server = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(server.getUri(), { dbName: "ordering_test" });
  await Skillset.init();
  await Education.init();
}, { timeout: 180000 });
after(async () => {
  await mongoose.disconnect();
  if (server) await server.stop();
});

async function reset() { await clearOrdered(Skillset); }
async function titles() {
  const rows = await listOrdered(Skillset);
  assert.deepEqual(rows.map(row => row.order), rows.map((_, index) => index + 1));
  return rows.map(row => row.title);
}
async function seed() {
  await reset();
  const result = [];
  for (const title of ["A", "B", "C"]) result.push(await createOrdered(Skillset, { image: "/assets/images/logo1.png", title }));
  return result;
}

test("creation defaults to the next position and insertion shifts siblings", async () => {
  await reset();
  const a = await createOrdered(Skillset, { image: "/assets/images/logo1.png", title: "A" });
  assert.equal(a.order, 1);
  await createOrdered(Skillset, { image: "/assets/images/logo1.png", title: "B" });
  await createOrdered(Skillset, { image: "/assets/images/logo1.png", title: "C", order: 2 });
  assert.deepEqual(await titles(), ["A", "C", "B"]);
});

test("moving third to first and first to third shifts the intervening items", async () => {
  const [a, , c] = await seed();
  await updateOrdered(Skillset, String(c._id), { order: 1 });
  assert.deepEqual(await titles(), ["C", "A", "B"]);
  await updateOrdered(Skillset, String(c._id), { order: 3 });
  assert.deepEqual(await titles(), ["A", "B", "C"]);
  await updateOrdered(Skillset, String(a._id), { order: 3 });
  assert.deepEqual(await titles(), ["B", "C", "A"]);
});

test("all source/destination pairs preserve sibling relative order", async () => {
  for (let from = 0; from < 3; from++) for (let to = 0; to < 3; to++) {
    const docs = await seed();
    const expected = ["A", "B", "C"];
    expected.splice(to, 0, expected.splice(from, 1)[0]);
    await updateOrdered(Skillset, String(docs[from]._id), { order: to + 1 });
    assert.deepEqual(await titles(), expected);
  }
});

test("deletion closes gaps and the next creation appends", async () => {
  const [, b] = await seed();
  await deleteOrdered(Skillset, String(b._id));
  assert.deepEqual(await titles(), ["A", "C"]);
  assert.equal((await createOrdered(Skillset, { image: "/assets/images/logo1.png", title: "D" })).order, 3);
  assert.equal(await deleteOrdered(Skillset, String(new mongoose.Types.ObjectId())), null);
});

test("invalid orders and invalid content leave the entire list unchanged", async () => {
  const [a] = await seed();
  for (const order of [0, -1, 4, 1.5, "2", null, NaN, Infinity]) {
    await assert.rejects(updateOrdered(Skillset, String(a._id), { order }), OrderError);
    assert.deepEqual(await titles(), ["A", "B", "C"]);
  }
  await assert.rejects(createOrdered(Skillset, { image: "/assets/images/logo1.png", title: "bad", order: 5 }), OrderError);
  await assert.rejects(updateOrdered(Skillset, String(a._id), { title: "", order: 3 }));
  await assert.rejects(createOrdered(Skillset, { image: "/assets/images/logo1.png", title: "", order: 1 }));
  assert.deepEqual(await titles(), ["A", "B", "C"]);
});

test("legacy rows are backfilled in date order without changing timestamps", async () => {
  await reset();
  const older = new Date("2020-01-01"), newer = new Date("2021-01-01");
  await Skillset.collection.insertMany([
    { title: "Old", createdAt: older, updatedAt: older },
    { title: "New", createdAt: newer, updatedAt: newer },
  ]);
  const preview = await migrate(mongoose.connection.getClient(), mongoose.connection.db);
  assert.equal(preview.find(row => row.collection === "skillsets").orders, 2);
  assert.equal(await Skillset.countDocuments({ order: { $exists: true } }), 0);
  await listOrdered(Skillset);
  assert.equal(await Skillset.countDocuments({ order: { $exists: true } }), 0);
  await migrateExisting();
  assert.deepEqual(await titles(), ["New", "Old"]);
  assert.equal((await migrateExisting()).every(row => row.orders === 0 && row.emojis === 0), true);
  const rows = await Skillset.find().sort({ order: 1 });
  assert.deepEqual(rows.map(row => row.order), [1, 2]);
  assert.equal(rows[0].updatedAt.getTime(), newer.getTime());
  assert.equal(rows[1].updatedAt.getTime(), older.getTime());
});

test("education migration follows start date and has its own positions", async () => {
  await Education.collection.insertMany([
    { institution: "Old", startDate: new Date("2010-01-01") },
    { institution: "New", startDate: new Date("2020-01-01") },
  ]);
  await migrateExisting();
  const rows = await listOrdered(Education);
  assert.deepEqual(rows.map(row => row.institution), ["New", "Old"]);
  assert.deepEqual(rows.map(row => row.order), [1, 2]);
});

test("emoji text round-trips at skillset level and content edits keep position", async () => {
  const [a] = await seed();
  const emoji = String.fromCodePoint(0x1f469, 0x200d, 0x1f4bb);
  await updateOrdered(Skillset, String(a._id), { emoji, skills: [{ name: "TypeScript" }] });
  const saved = await Skillset.findById(a._id);
  assert.equal(saved.emoji, emoji);
  assert.equal(saved.order, 1);
  assert.equal(saved.skills[0].name, "TypeScript");
  await updateOrdered(Skillset, String(a._id), { emoji: "" });
  assert.equal((await Skillset.findById(a._id)).emoji, "");
});

test("simultaneous creates and moves retain unique contiguous positions", async () => {
  await reset();
  await Promise.all(Array.from({ length: 6 }, (_, index) =>
    createOrdered(Skillset, { image: "/assets/images/logo1.png", title: String(index) })));
  assert.equal((await titles()).length, 6);
  const rows = await listOrdered(Skillset);
  await Promise.all(rows.map(row => updateOrdered(Skillset, String(row._id), { order: 1 })));
  assert.equal(new Set(await titles()).size, 6);
});

test("deleting all resets the next position to one", async () => {
  await reset();
  assert.deepEqual(await titles(), []);
  assert.equal((await createOrdered(Skillset, { image: "/assets/images/logo1.png", title: "First" })).order, 1);
});


// Load the actual Next.js handlers, replacing only their connection bootstrap.
// All query, validation, serialization and transaction code still runs.
const Module = require("node:module");
const path = require("node:path");
const originalLoad = Module._load;
process.env.ADMIN_SESSION_SECRET = "isolated-ordering-test-secret-not-for-production";
const { createSession } = require("../lib/auth/session.ts");
let testAuthenticated = true;
Module._load = function(request, parent, isMain) {
  if (request === "next/headers") return { cookies: async () => ({get: () => testAuthenticated ? {value: createSession()} : undefined}) };
  if (request === "next/cache") return {revalidatePath: () => {}, revalidateTag: () => {}};
  if (request === "@/lib/db/connection") return { connectDB: async () => mongoose };
  if (request.startsWith("@/")) request = path.join(__dirname, "..", request.slice(2));
  return originalLoad.call(this, request, parent, isMain);
};
const fixtures = {
  educations: { logo: "/assets/images/logo1.png", institution: "College", field: "CS", startDate: "2020-01-01", description: "Education", skills: [] },
  jobs: { logo: "/assets/images/logo1.png", company: "Company", position: "Engineer", startDate: "2020-01-01", description: "Job", skills: [], responsibilities: [] },
  projects: { title: "Project", shortDescription: "Short", description: "Long", image: "/project.png", status: "Completed", teamType: "solo" },
  skillsets: { image: "/assets/images/logo1.png", title: "Skills", emoji: "DEV", skills: [{ name: "TypeScript" }] },
  certificates: { title: "Certificate", issuer: "Issuer", dateIssued: "2020-01-01", description: "Certificate", fileUrl: "/file.pdf" },
  "comments-section": { name: "Person", position: "Engineer", comment: "Comment" },
  posts: { title: "Post", content: "Content" },
  comments: { name: "Person", position: "Engineer", insight: "Insight" },
};
fixtures.projects.status = "Live & Maintained";
for (const [section, data] of Object.entries(fixtures)) {
  test(section + " API supports creation, ordering, bounds and deletion", async t => {
    t.mock.method(console, "log", () => {});
    const collection = require("../app/api/admin/" + section + "/route.ts");
    const item = require("../app/api/admin/" + section + "/[id]/route.ts");
    const request = payload => new Request("http://localhost/api/admin/" + section, {
      method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" },
    });
    const params = id => ({ params: Promise.resolve({ id }) });
    assert.equal((await collection.DELETE()).status, 200);
    const ids = [];
    for (let index = 0; index < 3; index++) {
      const response = await collection.POST(request(data));
      const body = await response.json();
      assert.equal(response.status, 201, JSON.stringify(body));
      assert.equal(body.order, index + 1);
      ids.push(body._id);
    }
    const moved = await item.PUT(request({ ...data, order: 1 }), params(ids[2]));
    assert.equal(moved.status, 200, JSON.stringify(await moved.json()));
    let rows = await (await collection.GET()).json();
    assert.deepEqual(rows.map(row => row._id), [ids[2], ids[0], ids[1]]);
    assert.deepEqual(rows.map(row => row.order), [1, 2, 3]);
    assert.equal((await item.PUT(request({ ...data, order: 4 }), params(ids[0]))).status, 400);
    assert.equal((await item.DELETE(request({}), params(ids[0]))).status, 200);
    rows = await (await collection.GET()).json();
    assert.deepEqual(rows.map(row => row.order), [1, 2]);
    if (section === "skillsets") assert.equal(rows[0].image, "/assets/images/logo1.png");
  });
}

test("migration preserves configured positions and emoji, fills legacy rows, and permits editing", async () => {
  await reset();
  const rows = await Skillset.collection.insertMany([
    { title: "Configured", order: 1, emoji: "DEV" },
    { title: "Legacy", createdAt: new Date("2020-01-01") },
  ]);
  await assert.rejects(updateOrdered(Skillset, String(rows.insertedIds[0]), { order: 1 }), /need migration/);
  await migrateExisting();
  assert.deepEqual(await titles(), ["Configured", "Legacy"]);
  const migrated = await Skillset.findById(rows.insertedIds[1]);
  assert.equal(migrated.emoji, "");
  await updateOrdered(Skillset, String(migrated._id), { order: 1, emoji: "NEW" });
  assert.deepEqual(await titles(), ["Legacy", "Configured"]);
  await migrateExisting();
  assert.deepEqual(await titles(), ["Legacy", "Configured"]);
  assert.equal((await Skillset.findById(rows.insertedIds[0])).emoji, "DEV");
});

test("reloading a legacy cached skillset schema recognizes migrated fields", async () => {
  mongoose.deleteModel("Skillset");
  const Legacy = mongoose.model("Skillset", new mongoose.Schema({ title: String, skills: [{ name: String }] }));
  const old = Legacy.hydrate({ title: "Existing", order: 1, emoji: "DEV" });
  assert.equal(old.order, undefined);
  assert.equal(old.get("order"), 1);
  delete require.cache[require.resolve("../lib/models/Skillset.ts")];
  const { Skillset: Refreshed } = require("../lib/models/Skillset.ts");
  const current = Refreshed.hydrate({ title: "Existing", order: 1, emoji: "DEV" });
  assert.equal(current.order, 1);
  assert.equal(current.emoji, "DEV");
  await Refreshed.deleteMany({});
  const first = await createOrdered(Refreshed, { image: "/assets/images/logo1.png", title: "First" });
  const second = await createOrdered(Refreshed, { image: "/assets/images/logo1.png", title: "Second" });
  await updateOrdered(Refreshed, String(second._id), { order: 1 });
  assert.equal((await Refreshed.findById(first._id)).order, 2);
});

for (const [section, data] of Object.entries(fixtures)) {
  test(section + " drag endpoint changes only order and rejects stale lists", async t => {
    t.mock.method(console, "log", () => {});
    const collection = require("../app/api/admin/" + section + "/route.ts");
    const item = require("../app/api/admin/" + section + "/[id]/route.ts");
    const request = payload => new Request("http://localhost", { method: "PATCH", body: JSON.stringify(payload) });
    const params = id => ({ params: Promise.resolve({ id }) });
    await collection.DELETE();
    const ids = [];
    for (let index = 0; index < 3; index++) {
      const response = await collection.POST(request(data));
      ids.push((await response.json())._id);
    }
    const before = await (await collection.GET()).json();
    const response = await item.PATCH(request({ order: 1, expectedIds: ids }), params(ids[2]));
    assert.equal(response.status, 200);
    const after = await response.json();
    assert.deepEqual(after.map(row => row._id), [ids[2], ids[0], ids[1]]);
    for (const row of after) {
      const old = before.find(value => value._id === row._id);
      const { order: ignoredOld, ...oldContent } = old;
      const { order: ignoredNew, ...newContent } = row;
      assert.deepEqual(newContent, oldContent);
    }
    assert.equal((await item.PATCH(request({ order: 1, expectedIds: ids }), params(ids[1]))).status, 409);
    assert.equal((await item.PATCH(request({ order: 0, expectedIds: after.map(row => row._id) }), params(ids[1]))).status, 400);
    assert.equal((await item.PATCH(request({}), params(ids[1]))).status, 400);
  });
}

test("image migration fills old rows, preserves custom/removed logos, and is idempotent", async () => {
  await Skillset.deleteMany({});
  const certificates = mongoose.connection.db.collection("certificates");
  await certificates.deleteMany({});
  await Skillset.collection.insertMany([
    { title: "Legacy", order: 1, emoji: "old", updatedAt: new Date("2020-01-01") },
    { title: "Custom", order: 2, image: "/custom.png" },
  ]);
  await certificates.insertMany([{ title: "Legacy" }, { title: "Custom", logo: "/custom.png" }, { title: "Removed", logo: "" }]);
  const preview = await migrateImages(mongoose.connection.getClient(), mongoose.connection.db);
  assert.deepEqual(preview.map(row => row.imagesToFill), [1, 1]);
  assert.equal(await Skillset.countDocuments({ image: { $exists: false } }), 1);
  await migrateImages(mongoose.connection.getClient(), mongoose.connection.db, { dryRun: false });
  const legacy = await Skillset.findOne({ title: "Legacy" });
  assert.equal(legacy.image, "/assets/images/logo1.png");
  assert.equal(legacy.updatedAt.getTime(), new Date("2020-01-01").getTime());
  assert.equal((await Skillset.findOne({ title: "Custom" })).image, "/custom.png");
  assert.equal((await certificates.findOne({ title: "Removed" })).logo, "");
  assert.equal((await certificates.findOne({ title: "Custom" })).logo, "/custom.png");
  assert.deepEqual((await migrateImages(mongoose.connection.getClient(), mongoose.connection.db)).map(row => row.imagesToFill), [0, 0]);
});

test("skillset image is required by both API and schema", async t => {
  t.mock.method(console, "log", () => {});
  const route = require("../app/api/admin/skillsets/route.ts");
  for (const image of [undefined, "", "   ", null, 123]) {
    const response = await route.POST(new Request("http://localhost", {
      method: "POST", body: JSON.stringify({ title: "Missing image", image, skills: [] }),
    }));
    assert.equal(response.status, 400);
  }
  await assert.rejects(new Skillset({ title: "Missing image", order: 1 }).validate());
});

test("certificate logo round-trips and can be removed", async t => {
  t.mock.method(console, "log", () => {});
  const collection = require("../app/api/admin/certificates/route.ts");
  const item = require("../app/api/admin/certificates/[id]/route.ts");
  await collection.DELETE();
  const request = body => new Request("http://localhost", { method: "POST", body: JSON.stringify(body) });
  const response = await collection.POST(request({ ...fixtures.certificates, logo: "/assets/images/logo1.png" }));
  assert.equal(response.status, 201);
  const created = await response.json();
  assert.equal(created.logo, "/assets/images/logo1.png");
  const updated = await item.PUT(request({ ...fixtures.certificates, logo: "" }), { params: Promise.resolve({ id: created._id }) });
  assert.equal(updated.status, 200);
  assert.equal((await updated.json()).logo, "");
});

for (const section of ["educations", "jobs"]) {
  test(section + " requires a logo on create and edit and saves replacement logos", async t => {
    t.mock.method(console, "log", () => {});
    const collection = require("../app/api/admin/" + section + "/route.ts");
    const item = require("../app/api/admin/" + section + "/[id]/route.ts");
    const request = data => new Request("http://localhost", { method: "POST", body: JSON.stringify(data) });
    await collection.DELETE();
    const createdResponse = await collection.POST(request(fixtures[section]));
    assert.equal(createdResponse.status, 201);
    const created = await createdResponse.json();
    const params = { params: Promise.resolve({ id: created._id }) };
    for (const logo of [undefined, null, "", "   ", 123]) {
      assert.equal((await collection.POST(request({ ...fixtures[section], logo }))).status, 400);
      assert.equal((await item.PUT(request({ ...fixtures[section], logo }), params)).status, 400);
    }
    const response = await item.PUT(request({ ...fixtures[section], logo: "/custom-logo.png" }), params);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).logo, "/custom-logo.png");
    const Model = section === "educations" ? Education : require("../lib/models/Job.ts").Job;
    await assert.rejects(new Model({ ...fixtures[section], logo: "", order: 1 }).validate());
  });
}

test("education/job logo migration preserves saved logos and is repeatable", async () => {
  for (const name of ["educations", "jobs"]) {
    const collection = mongoose.connection.db.collection(name);
    await collection.deleteMany({});
    await collection.insertMany([
      { logo: "/custom.png", order: 1 },
      { order: 2, updatedAt: new Date("2020-01-01") },
      { logo: "  ", order: 3 },
    ]);
  }
  const client = mongoose.connection.getClient(), db = mongoose.connection.db;
  assert.deepEqual((await migrateLogos(client, db)).map(row => row.imagesToFill), [2, 2]);
  assert.equal(await db.collection("jobs").countDocuments({ logo: { $exists: false } }), 1);
  await migrateLogos(client, db, { dryRun: false });
  for (const name of ["educations", "jobs"]) {
    const rows = await db.collection(name).find().sort({ order: 1 }).toArray();
    assert.deepEqual(rows.map(row => row.logo), ["/custom.png", "/assets/images/logo1.png", "/assets/images/logo1.png"]);
    assert.equal(rows[1].updatedAt.getTime(), new Date("2020-01-01").getTime());
  }
  assert.deepEqual((await migrateLogos(client, db, { dryRun: false })).map(row => row.imagesToFill), [0, 0]);
});

test("About education and jobs display saved logos and default images", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  for (const [file, prop, fixture] of [
    ["AboutEducation", "educations", fixtures.educations],
    ["AboutExperience", "jobs", fixtures.jobs],
  ]) {
    const Component = require("../components/about/" + file + ".tsx").default;
    const render = logo => renderToStaticMarkup(React.createElement(require("next-intl").NextIntlClientProvider, {locale:"en",messages:require("../messages/en.json"),timeZone:"UTC"}, React.createElement(Component, { [prop]: [{ ...fixture, logo }] })));
    assert.ok(render("/custom-logo.png").includes('src="/custom-logo.png"'));
    assert.ok(render(undefined).includes('src="/assets/images/logo1.png"'));
    assert.ok(render("   ").includes('src="/assets/images/logo1.png"'));
  }
});


test("education outcomes validate, persist in order, and preserve legacy skills", async t => {
  t.mock.method(console, "log", () => {});
  const collection = require("../app/api/admin/educations/route.ts");
  const item = require("../app/api/admin/educations/[id]/route.ts");
  const request = payload => new Request("http://localhost", { method: "POST", body: JSON.stringify(payload) });
  await collection.DELETE();
  const data = { ...fixtures.educations, skills: [{ name: "TypeScript", image: "/custom-icon.svg", description: "Keep this description" }] };
  const created = await collection.POST(request({ ...data, learningOutcomes: [" First ", "", "Second", "  "] }));
  assert.equal(created.status, 201);
  const body = await created.json();
  assert.deepEqual(body.learningOutcomes, ["First", "Second"]);
  const params = { params: Promise.resolve({ id: body._id }) };
  const updated = await item.PUT(request({ ...data, learningOutcomes: ["Second", "Third", "First"] }), params);
  assert.equal(updated.status, 200);
  assert.deepEqual((await updated.json()).learningOutcomes, ["Second", "Third", "First"]);
  await item.PUT(request(data), params);
  let saved = await (await item.GET(request({}), params)).json();
  assert.deepEqual(saved.learningOutcomes, ["Second", "Third", "First"]);
  assert.equal(saved.skills[0].description, data.skills[0].description);
  assert.equal(saved.skills[0].image, data.skills[0].image);
  for (const invalid of [null, "text", [3], [{}]]) {
    assert.equal((await item.PUT(request({ ...data, learningOutcomes: invalid }), params)).status, 400);
    assert.equal((await collection.POST(request({ ...data, learningOutcomes: invalid }))).status, 400);
  }
  await Education.collection.updateOne({ _id: new mongoose.Types.ObjectId(body._id) }, { $unset: { learningOutcomes: "" } });
  saved = await (await item.GET(request({}), params)).json();
  assert.deepEqual(saved.learningOutcomes, []);
  assert.equal(saved.skills[0].description, data.skills[0].description);
  assert.equal((await Education.collection.findOne({ _id: new mongoose.Types.ObjectId(body._id) })).learningOutcomes, undefined, "read defaults do not mutate old records");
});

const { resolveContent, mergeContent } = require("../lib/content/localization.ts");
const { verifySession } = require("../lib/auth/session.ts");

test("signed sessions reject forged, modified and expired cookies", () => {
  const token = createSession();
  assert.equal(verifySession(token), true);
  assert.equal(verifySession("true"), false);
  assert.equal(verifySession(token.slice(0,-4) + "AAAA"), false);
  assert.equal(verifySession(createSession(Date.now() - 90000000)), false);
});
test("every CMS mutation requires a session; public reads remain available", async () => {
  testAuthenticated = false;
  try {
    for (const section of [...Object.keys(fixtures), "contacts", "general-info"]) {
      const collection = require("../app/api/admin/" + section + "/route.ts");
      for (const method of ["POST", "DELETE", ...(section === "general-info" ? ["PUT"] : [])]) {
        const response = await collection[method](new Request("http://localhost/api/admin/" + section, {method, ...(method !== "DELETE" ? {body:"{}"} : {})}));
        assert.equal(response.status,401, section + " " + method);
      }
      assert.equal((await collection.GET()).status,200);
      if (section !== "general-info") {
        const item = require("../app/api/admin/" + section + "/[id]/route.ts");
        for (const method of ["PUT", "DELETE", ...(item.PATCH ? ["PATCH"] : [])]) assert.equal((await item[method](new Request("http://localhost",{method}), {params:Promise.resolve({id:new mongoose.Types.ObjectId().toString()})})).status,401);
      }
    }
  } finally { testAuthenticated = true; }
});
test("authenticated cross-origin writes are rejected", async () => {
 const posts = require("../app/api/admin/posts/route.ts");
 assert.equal((await posts.POST(new Request("http://localhost/api/admin/posts",{method:"POST",headers:{Origin:"https://attacker.invalid"},body:JSON.stringify(fixtures.posts)}))).status,403);
});
for (const [section, data] of Object.entries({...fixtures, contacts:{email:"test@example.com",phone:"+1",location:"City"}, "general-info":{fullName:"Person",shortAbout:"Short",fullDescription:"Full"}})) {
 test(section + " preserves English and German across independent edits", async () => {
  const collection = require("../app/api/admin/" + section + "/route.ts");
  await collection.DELETE();
  const field = section === "educations" ? "field" : section === "jobs" ? "position" : section === "comments" ? "insight" : section === "comments-section" ? "comment" : section === "contacts" ? "location" : section === "general-info" ? "shortAbout" : "title";
  const request = value => new Request("http://localhost", {method:"POST",body:JSON.stringify(value)});
  const created = await collection.POST(request(data)); assert.equal(created.status,201);
  const original = await created.json();
  const item = section === "general-info" ? collection : require("../app/api/admin/" + section + "/[id]/route.ts");
  const context = {params:Promise.resolve({id:original._id})};
  const translated = await item.PUT(request({translations:{de:{[field]:"Deutscher Inhalt"}}}),context);
  assert.equal(translated.status,200);
  let saved = await translated.json(); assert.equal(saved[field],data[field]); assert.equal(resolveContent(saved,"de")[field],"Deutscher Inhalt");
  const english = await item.PUT(request({...data,[field]:"Updated English"}),context);assert.equal(english.status,200);
  saved = await english.json(); assert.equal(saved.translations.de[field],"Deutscher Inhalt");assert.equal(saved[field],"Updated English");
  assert.equal(saved._id,original._id);assert.equal(saved.createdAt,original.createdAt);assert.equal(saved.order,original.order);
  for(const key of ["image","logo","fileUrl","dateIssued","startDate","cvUrl"]) if(original[key] !== undefined)assert.equal(saved[key],original[key]);
  assert.equal((await item.PUT(request({translations:{de:{[field]:42}}}),context)).status,400);
 });
}
test("nested translations follow IDs through edits, reorder and deletion", async () => {
 const {Project} = require("../lib/models/Project.ts");
 await clearOrdered(Project);
 const row = await createOrdered(Project,{...fixtures.projects,features:[{title:"A",description:"First",translations:{de:{title:"A DE",description:"Erste"}}},{title:"B",description:"Second",translations:{de:{title:"B DE",description:"Zweite"}}}]});
 const [a,b] = row.toObject().features;
 const updated = await updateOrdered(Project,String(row._id),{features:[{_id:b._id,title:"B changed",description:"Second"},{_id:a._id,title:"A",description:"First"}]});
 assert.equal(updated.features[0].translations.de.title,"B DE"); assert.equal(String(updated.features[0]._id),String(b._id));
 const reduced = await updateOrdered(Project,String(row._id),{features:[{_id:b._id,title:"B changed",description:"Second"}]});
 assert.equal(reduced.features.length,1);assert.equal(reduced.features[0].translations.de.description,"Zweite");
 await assert.rejects(updateOrdered(Project,String(row._id),{features:[{title:"Stale altered item",description:"Second"}]}),/Refresh/);
});
test("fallback does not mutate English and keeps paired fields together", () => {
 const source={title:"English",translations:{de:{title:" "}},features:[{title:"Feature",description:"Description",translations:{de:{title:"Funktion"}}}],skills:[{name:"Computer Science",image:"/icon.svg"}]};
 const result=resolveContent(source,"de");assert.equal(result.title,"English");assert.equal(result.features[0].title,"Feature");assert.equal(result.skills[0].name,"Informatik");assert.equal(result.skills[0].image,"/icon.svg");assert.equal(source.skills[0].name,"Computer Science");
 assert.equal(mergeContent({translations:{de:{title:"Titel",description:"Text"}}},{translations:{de:{title:"Neu"}}}).translations.de.description,"Text");
});
test("learning outcome companions preserve translations without index matching", async () => {
 await clearOrdered(Education);
 const row=await createOrdered(Education,{...fixtures.educations,learningOutcomes:["One","Two"]});
 const [a,b]=row.toObject().outcomeItems;
 const translated=await updateOrdered(Education,String(row._id),{outcomeItems:[{...a,translations:{de:{name:"Eins"}}},{...b,translations:{de:{name:"Zwei"}}}]});
 const reordered=await updateOrdered(Education,String(row._id),{outcomeItems:[translated.toObject().outcomeItems[1],translated.toObject().outcomeItems[0]]});
 assert.deepEqual(reordered.learningOutcomes,["Two","One"]);assert.deepEqual(resolveContent(reordered.toObject(),"de").learningOutcomes,["Zwei","Eins"]);
 const legacy=await updateOrdered(Education,String(row._id),{learningOutcomes:["One"]});assert.equal(legacy.outcomeItems[0].translations.de.name,"Eins");
});
test("localization migration is dry-run safe, backed up, additive and repeatable", async () => {
 const {migrate}=require("../scripts/migrations/004-content-localization.cjs");
 const db=mongoose.connection.db,client=mongoose.connection.getClient();
 for(const collection of ["projects","jobs","educations","skillsets"])await db.collection(collection).deleteMany({});
 const raw={_id:new mongoose.Types.ObjectId(),institution:"School",order:1,startDate:new Date("2020-01-01"),createdAt:new Date("2020-01-01"),updatedAt:new Date("2020-01-01"),logo:"/same.svg",learningOutcomes:["Original English","Two"],skills:[{name:"CS",image:"/same.svg"}]};
 await db.collection("educations").insertOne(raw);
 const preview=await migrate(client,db);assert.equal(preview.find(row=>row.collection==="educations").recordsToUpdate,1);
 assert.deepEqual(await db.collection("educations").findOne({_id:raw._id}),raw);
 const backup=path.join(require("node:os").tmpdir(),"portfolio-localization-test-"+Date.now()+".json");
 try {
  await migrate(client,db,{dryRun:false,backupPath:backup});
  const saved=await db.collection("educations").findOne({_id:raw._id});
  for(const key of ["_id","order","startDate","createdAt","updatedAt","logo","learningOutcomes"])assert.deepEqual(saved[key],raw[key]);
  assert.equal(saved.skills[0].image,raw.skills[0].image);
  assert.deepEqual(saved.outcomeItems.map(item=>item.name),raw.learningOutcomes);
  assert.equal((await migrate(client,db)).every(row=>row.recordsToUpdate===0),true);
  assert.ok(fs.readFileSync(backup,"utf8").includes("Original English"));
 } finally {if(fs.existsSync(backup))fs.unlinkSync(backup);}
});

test("all upload routes require a verified session before accepting files", async () => {
 const {ourFileRouter}=require("../app/api/uploadthing/core.ts");
 testAuthenticated=false;
 try {for(const route of Object.values(ourFileRouter)) await assert.rejects(route.middleware(), /UNAUTHORIZED/);} finally {testAuthenticated=true;}
 for(const route of Object.values(ourFileRouter)) assert.deepEqual(await route.middleware(), {admin:true});
});
