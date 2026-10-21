// Run with npm exec --yes --package=playwright -- node tests/admin-nested-items-browser.cjs
// All content APIs are mocked. This test never writes to the portfolio database.
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
let playwright;
for (const directory of (process.env.PATH || "").split(path.delimiter)) {
  try { playwright = require(path.join(directory, "..", "playwright")); break; } catch {}
}
if (!playwright) throw new Error("Run through npm exec --package=playwright.");
async function until(check) {
  const deadline = Date.now() + 15000;
  while (!(await check())) {
    if (Date.now() > deadline) throw new Error("Assertion timed out: " + check);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
(async () => {
  const executablePath = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(file => fs.existsSync(file));
  const browser = await playwright.chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
    await context.addCookies([{ name: "isAdmin", value: "true", domain: "localhost", path: "/" }]);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const named = () => ["Alpha", "Beta", "Gamma"].map(name => ({ name, image: "/assets/images/logo1.png", description: name + " description" }));
    const base = {
      _id: "1", order: 1, title: "Existing record", company: "Company", position: "Engineer",
      institution: "University", field: "Computing", degree: "BSc", description: "Existing description", shortDescription: "Summary",
      image: "/assets/images/logo1.png", logo: "/assets/images/logo1.png", startDate: "2020-01-01", endDate: "2022-01-01",
      status: "Live & Maintained", teamType: "solo", duration: "1 year", skills: named(),
      learningOutcomes: ["Alpha", "Beta", "Gamma"],
      responsibilities: ["Alpha", "Beta", "Gamma"].map(name => ({ name })),
      technologies: ["Alpha", "Beta", "Gamma"].map(name => ({ name, icon: "/assets/images/logo1.png" })),
      features: ["Alpha", "Beta", "Gamma"].map(title => ({ title, description: title + " description" })),
      challenges: ["Alpha", "Beta", "Gamma"].map(challenge => ({ challenge, solution: challenge + " solution" }))
    };
    const records = Object.fromEntries(["skillsets", "educations", "jobs", "projects"].map(key => [key, structuredClone(base)]));
    const saves = [];
    await page.route("**/api/admin/**", async route => {
      const request = route.request();
      const key = new URL(request.url()).pathname.split("/")[3];
      if (!records[key]) return route.fulfill({ json: [] });
      if (request.method() === "PUT") {
        const data = request.postDataJSON();
        saves.push({ key, data });
        records[key] = { ...records[key], ...data };
        return route.fulfill({ json: records[key] });
      }
      assert.equal(request.method(), "GET", "No unexpected writes");
      return route.fulfill({ json: [records[key]] });
    });
    await page.goto("http://localhost:3000/admin-dashboard");
    const cases = [
      ["Skills & Expertise", "skillsets", [["Skills", "Skill", "skills", "name", "Skill Name"]]],
      ["Education", "educations", [["Skills Learned", "Skill", "skills", "name", "Skill Name"], ["Key Learning Outcomes", "Learning Outcome", "learningOutcomes", "name", "Learning Outcome"]]],
      ["Jobs", "jobs", [["Skills", "Skill", "skills", "name", "Skill Name"], ["Responsibilities", "Responsibility", "responsibilities", "name", "Responsibility Description"]]],
      ["Projects", "projects", [["Technologies & Tools", "Technology", "technologies", "name", "Technology Name"], ["Key Features", "Feature", "features", "title", "Feature Title"], ["Challenges & Solutions", "Challenge", "challenges", "challenge", "Challenge"]]]
    ];
    for (const [tab, key, sections] of cases) {
      await page.getByRole("button", { name: tab, exact: true }).click();
      await page.locator("[data-reorder-id]").first().getByTitle("Edit", { exact: true }).click();
      const form = page.locator("form");
      const submit = form.locator('button[type="submit"]');
      const expected = {};
      for (const [title, singular, field, primary, label] of sections) {
        const section = form.getByRole("region", { name: title, exact: true });
        const rows = section.locator("[data-nested-index]");
        await section.getByRole("button", { name: "Move " + singular.toLowerCase() + " at position 3", exact: true }).scrollIntoViewIfNeeded();
        const source = await section.getByRole("button", { name: "Move " + singular.toLowerCase() + " at position 3", exact: true }).boundingBox();
        const target = await section.getByRole("button", { name: "Move " + singular.toLowerCase() + " at position 1", exact: true }).boundingBox();
        await page.mouse.move(source.x + 8, source.y + 8);
        await page.mouse.down();
        await page.mouse.move(target.x + 8, target.y + 8, { steps: 15 });
        const previewText = await rows.evaluateAll(elements => elements.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top).map(element => element.textContent));
        assert.ok(previewText[0].includes("Gamma"), title + ": actual item previews in first position before release");
        assert.ok(previewText[1].includes("Alpha"));
        assert.ok(previewText[2].includes("Beta"));
        await page.mouse.up();
        await until(async () => (await rows.first().innerText()).includes("Gamma"));
        await section.getByRole("button", { name: "Move " + singular.toLowerCase() + " at position 1", exact: true }).press("ArrowDown");
        await until(async () => (await rows.nth(1).innerText()).includes("Gamma"));
        await section.getByRole("button", { name: "Edit " + singular.toLowerCase() + " at position 2", exact: true }).click();
        await until(() => submit.isDisabled());
        await section.getByRole("textbox", { name: label + " *", exact: true }).fill("Discard this");
        await section.getByRole("button", { name: "Cancel", exact: true }).click();
        assert.ok((await rows.nth(1).innerText()).includes("Gamma"));
        await section.getByRole("button", { name: "Edit " + singular.toLowerCase() + " at position 2", exact: true }).click();
        await section.getByRole("textbox", { name: label + " *", exact: true }).fill("   ");
        assert.equal(await section.getByRole("button", { name: "Save " + singular, exact: true }).isDisabled(), true);
        await section.getByRole("textbox", { name: label + " *", exact: true }).fill("Edited Gamma");
        await section.getByRole("button", { name: "Save " + singular, exact: true }).click();
        expected[field] = field === "learningOutcomes" ? ["Alpha", "Edited Gamma", "Beta"] : [base[field][0], { ...base[field][2], [primary]: "Edited Gamma" }, base[field][1]];
      }
      await until(() => submit.isEnabled());
      const before = saves.length;
      await submit.click();
      await until(async () => saves.length === before + 1);
      await until(async () => await page.locator("form").count() === 0);
      for (const [field, values] of Object.entries(expected)) assert.deepEqual(saves.at(-1).data[field], values, tab + ": preserves complete items and saved order");
      assert.equal(saves.at(-1).data.description, base.description);
      await page.reload();
      await page.getByRole("button", { name: tab, exact: true }).click();
      await page.locator("[data-reorder-id]").first().getByTitle("Edit", { exact: true }).click();
      for (const [title] of sections) assert.ok((await page.getByRole("region", { name: title, exact: true }).locator("[data-nested-index]").nth(1).innerText()).includes("Edited Gamma"));
      await page.locator("form").getByRole("button", { name: "Cancel", exact: true }).click();
    }
    assert.deepEqual(errors, []);
    console.log("PASS: all nested lists support pointer/keyboard reordering, edit/cancel, validation, save/reload, and preservation of existing item fields.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
