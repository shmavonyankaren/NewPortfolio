// Run: npm exec --yes --package=playwright -- node tests/admin-order-browser.cjs
// Uses the local app and mocked content APIs; never modifies portfolio data.
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
let playwright;
for (const directory of (process.env.PATH || "").split(path.delimiter)) {
  try { playwright = require(path.join(directory, "..", "playwright")); break; } catch {}
}
if (!playwright) throw new Error("Run this script through npm exec --package=playwright.");
async function waitForAssertion(check) {
  const deadline = Date.now() + 15000;
  while (!(await check())) {
    if (Date.now() > deadline) throw new Error("Timed out waiting for assertion: " + check);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
function expect(locator) {
  return {
    toBeEnabled: () => waitForAssertion(() => locator.isEnabled()),
    toBeDisabled: () => waitForAssertion(() => locator.isDisabled()),
  };
}
expect.poll = check => ({ toBe: value => waitForAssertion(async () => (await check()) === value) });
(async () => {
  const executablePath = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].find(file => fs.existsSync(file));
  const browser = await playwright.chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1100 }, hasTouch: true });
    await context.addCookies([require("./browser-session.cjs")()]);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    let rows = ["Alpha", "Beta", "Gamma"].map((title, index) => ({
      _id: String(index + 1), title, image: "/assets/images/logo1.png", skills: [{ name: "TypeScript" }], order: index + 1,
    }));
    const requests = [];
    let failNext = false;
    await page.route("**/api/admin/**", async route => {
      const request = route.request();
      if (request.url().includes("/skillsets")) {
        if (request.method() === "PATCH") {
          const data = request.postDataJSON();
          requests.push(data);
          if (failNext) {
            failNext = false;
            return route.fulfill({ status: 500, json: { error: "Test save failed" } });
          }
          assert.deepEqual(data.expectedIds, rows.map(row => row._id));
          const id = request.url().split("/").at(-1);
          const index = rows.findIndex(row => row._id === id);
          rows.splice(data.order - 1, 0, rows.splice(index, 1)[0]);
          rows = rows.map((row, index) => ({ ...row, order: index + 1 }));
        }
        return route.fulfill({ json: rows });
      }
      return route.fulfill({ json: [] });
    });
    await page.goto("http://localhost:3000/admin-dashboard");
    await page.getByRole("button", { name: "Skills & Expertise", exact: true }).click();
    const ids = () => page.locator("[data-reorder-id]").evaluateAll(elements => elements.map(element => element.dataset.reorderId));
    await page.getByRole("button", { name: "Move item at position 3", exact: true }).waitFor();
    const source = await page.getByRole("button", { name: "Move item at position 3", exact: true }).boundingBox();
    const destination = await page.getByRole("button", { name: "Move item at position 1", exact: true }).boundingBox();
    await page.mouse.move(source.x + 10, source.y + 10);
    await page.mouse.down();
    await page.mouse.move(destination.x + 10, destination.y + 10, { steps: 15 });
    await page.mouse.up();
    await page.getByRole("status").filter({ hasText: "Order saved" }).waitFor();
    assert.deepEqual(await ids(), ["3", "1", "2"]);
    assert.equal(requests.at(-1).order, 1);
    await page.getByRole("button", { name: "Move item at position 1", exact: true }).press("End");
    await page.waitForFunction(() => document.querySelector("[data-reorder-id]")?.dataset.reorderId === "1");
    assert.deepEqual(await ids(), ["1", "2", "3"]);
    await page.getByRole("status").filter({ hasText: "position 3" }).waitFor();
    failNext = true;
    await page.getByRole("button", { name: "Move item at position 1", exact: true }).press("ArrowDown");
    await page.getByRole("alert").filter({ hasText: "Test save failed" }).waitFor();
    assert.deepEqual(await ids(), ["1", "2", "3"]);
    await page.unroute("**/api/admin/**");
    const fixtures = Array.from({ length: 8 }, (_, index) => ({
      _id: String(index + 1), order: index + 1, title: "Item " + (index + 1),
      name: "Person " + index, position: "Engineer", company: "Company",
      institution: "University", field: "Computing", degree: "BSc",
      image: "/assets/images/logo1.png", logo: "/assets/images/logo1.png", description: "Description", shortDescription: "Summary", content: "Blog content",
      insight: "Insight", comment: "Comment", issuer: "Issuer",
      dateIssued: "2024-01-01", startDate: "2020-01-01", endDate: "2022-01-01",
      createdAt: "2024-01-01", skills: [], responsibilities: [], technologies: [],
      features: [], challenges: [], fileUrl: "/test.pdf", fileName: "",
      email: "person@example.com", phone: "123", location: "City",
      status: "Live & Maintained", teamType: "solo", duration: "1 year"
    }));
    let writes = 0;
    await page.route("**/api/admin/**", route => {
      if (route.request().method() !== "GET") writes++;
      return route.fulfill({ json: fixtures });
    });
    const pendingUploads = [];
    await page.route("**/api/uploadthing**", route => {
      if (route.request().method() === "POST") pendingUploads.push(route);
      else return route.continue();
    });
    for (const tab of ["Jobs", "Education", "Contact Info", "Insights", "Certificates", "Comments Section", "Blog Posts", "Projects", "Skills & Expertise"]) {
      await page.getByRole("button", { name: tab, exact: true }).click();
      const selector = tab === "Contact Info" ? "[data-contact-id]" : "[data-reorder-id]";
      const row = page.locator(selector).nth(4);
      await row.waitFor();
      await row.scrollIntoViewIfNeeded();
      const before = await row.boundingBox();
      await row.getByTitle("Edit", { exact: true }).click();
      await row.locator("form").waitFor();
      assert.equal(await page.locator("form").count(), 1, tab + ": exactly one form");
      const after = await row.boundingBox();
      assert.ok(Math.abs(before.y - after.y) < 5, tab + ": selected row stays in place");
      assert.equal(await page.locator(selector).count(), 8, tab + ": keeps all list slots");
      const submit = row.locator('button[type="submit"]');
      await expect(submit).toBeEnabled();
      const requiredText = row.locator('input[required]:not([type="date"]), textarea[required]').first();
      const original = await requiredText.inputValue();
      await requiredText.fill("   ");
      await expect(submit).toBeDisabled();
      const beforeWrites = writes;
      await row.locator("form").evaluate(form => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
      assert.equal(writes, beforeWrites, tab + ": invalid submit is guarded");
      await requiredText.fill(original);
      await expect(submit).toBeEnabled();
      if (["Jobs", "Education", "Skills & Expertise"].includes(tab)) {
        await row.getByRole("button", { name: "+ Add Skill", exact: true }).click();
        await expect(submit).toBeDisabled();
        await expect(row.getByRole("button", { name: "Save Skill", exact: true })).toBeDisabled();
        await row.getByRole("button", { name: "Cancel", exact: true }).first().click();
        await expect(submit).toBeEnabled();
      }
      if (tab === "Skills & Expertise") {
        assert.equal(await row.locator('input[type="file"]').count(), 1);
        await row.getByRole("button", { name: "Remove image", exact: true }).click();
        assert.equal(await row.getByRole("button", { name: "Update Skillset", exact: true }).isDisabled(), true);
      }
      if (tab === "Jobs" || tab === "Education") {
        await row.getByRole("button", { name: "Remove logo", exact: true }).click();
        assert.equal(await row.getByRole("button", { name: tab === "Jobs" ? "Update Job" : "Update Education", exact: true }).isDisabled(), true);
      }
      if (tab === "Certificates") {
        await row.locator('input[type="file"]').first().setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: Buffer.from("test image") });
        await expect(submit).toBeDisabled();
        await expect.poll(() => pendingUploads.length).toBe(1);
        await row.locator("form").evaluate(form => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
        assert.equal(writes, beforeWrites, "Uploading blocks direct submit");
        await pendingUploads.shift().fulfill({ status: 400, json: { message: "Test upload failure" } });
        await expect(submit).toBeEnabled();
        await row.getByRole("button", { name: "Remove logo", exact: true }).click();
        assert.equal(await row.getByRole("button", { name: "Update Certificate", exact: true }).isEnabled(), true);
      }
      await row.getByRole("button", { name: "Cancel", exact: true }).click();
      assert.equal(await page.locator("form").count(), 0, tab + ": cancel restores the card");
      await row.getByTitle("Edit", { exact: true }).waitFor();
    }
    await page.getByRole("button", { name: "General Information", exact: true }).click();
    const general = page.locator("form");
    await general.waitFor();
    await expect(general.locator('button[type="submit"]')).toBeDisabled();
    await general.locator('input[required]').fill("Test User");
    for (const field of await general.locator('textarea[required]').all()) await field.fill("Description");
    await expect(general.locator('button[type="submit"]')).toBeEnabled();
    assert.equal(writes, 0, "Blocked saves never reach the API");
    assert.deepEqual(errors, []);
    console.log("PASS: drag and keyboard ordering, failed-save recovery, in-place edit/cancel across all nine admin lists, required images, optional logos, required-field guards across all ten forms, nested draft guards, and delayed/failed upload recovery.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
