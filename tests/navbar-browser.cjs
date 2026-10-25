// npm exec --yes --package=playwright -- node tests/navbar-browser.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
let playwright;
for (const directory of (process.env.PATH || "").split(path.delimiter)) {
  try { playwright = require(path.join(directory, "..", "playwright")); break; } catch {}
}
if (!playwright) throw new Error("Run through npm exec with playwright.");
const origin = process.env.TEST_BASE_URL || "http://localhost:3000";
(async () => {
  const executablePath = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(file => fs.existsSync(file));
  const browser = await playwright.chromium.launch({headless:true, ...(executablePath ? {executablePath} : {})});
  try {
    const page = await browser.newPage();
    await page.route(/sentry\.io|\/monitoring/, route => route.abort());
    for (const locale of ["en", "de"]) {
      const messages = require(`../messages/${locale}.json`).Navigation;
      await page.goto(`${origin}/${locale}`, {waitUntil:"domcontentloaded",timeout:90000});
      const nav = page.locator("header > div").first();
      const links = nav.locator("a:visible");
      const next = nav.getByRole("button", {name:messages.nextGroup, exact:true});
      const previous = nav.getByRole("button", {name:messages.previousGroup, exact:true});
      for (const theme of ["light", "dark"]) for (const width of [320,375,390,430,768,1024,1440]) {
        await page.setViewportSize({width,height:900});
        if (width === 320) {
          await nav.getByRole("button").last().click();
          await page.getByRole("menuitem", {name:locale === "de" ? (theme === "light" ? "Hell" : "Dunkel") : (theme === "light" ? "Light" : "Dark"),exact:true}).click();
          await page.getByRole("menu").waitFor({state:"hidden"});
        }
        await page.waitForTimeout(250);
        await page.waitForFunction(() => document.querySelector("header > div")?.getBoundingClientRect().y >= 19);
        assert.equal(await page.locator("html").evaluate(element => element.classList.contains("dark")), theme === "dark");
        const before = await nav.boundingBox();
        assert.ok(before.x >= 0 && before.x + before.width <= width + 1, `navbar fits ${locale}/${theme}/${width}`);
        const expected = ["Home","Projects","About", ...(width >= 768 ? ["Contact","Blog"] : [])].map(key => messages[key]);
        assert.deepEqual(await links.allTextContents(), expected);
        const checkLayout = async () => {
          const boxes = await nav.locator("a:visible, button:visible").evaluateAll(elements => elements.map(element => {
            const r = element.getBoundingClientRect();
            return {left:r.left,right:r.right,center:r.top+r.height/2};
          }));
          for (const box of boxes) {
            assert.ok(box.left >= before.x && box.right <= before.x + before.width, "controls stay inside navbar");
            assert.ok(Math.abs(box.center - boxes[0].center) < 2, "single horizontal row");
          }
          for (let i = 1; i < boxes.length; i++) assert.ok(boxes[i].left >= boxes[i-1].right - 1, "controls do not overlap");
        };
        await checkLayout();
        assert.ok(await nav.getByRole("button", {name:messages.language,exact:true}).isVisible());
        if (width < 768) {
          await next.focus();
          await page.keyboard.press("Enter");
          await previous.waitFor();
          await page.waitForTimeout(220);
          assert.deepEqual(await links.allTextContents(), [messages.Contact,messages.Blog]);
          const after = await nav.boundingBox();
          assert.equal(after.width, before.width, "group switch preserves width");
          assert.equal(after.height, before.height, "group switch preserves height");
          await checkLayout();
          assert.ok(await previous.evaluate(element => element === document.activeElement), "arrow retains keyboard focus");
          await previous.click();
          await page.waitForTimeout(220);
        } else {
          assert.equal(await next.count(),0);
          assert.equal(await previous.count(),0);
          assert.equal(await links.count(),5);
        }
        if (width === 320 || width === 768) await nav.screenshot({path:path.join(require("node:os").tmpdir(), `navbar-${locale}-${theme}-${width}.png`)});
        console.log(`PASS ${locale} ${theme} ${width}px`);
      }
      await page.setViewportSize({width:320,height:900});
      for (const route of ["/contact","/posts","/about","/projects",""]) {
        await page.goto(`${origin}/${locale}${route}`, {waitUntil:"domcontentloaded",timeout:90000});
        await nav.locator('a[aria-current="page"]:visible').waitFor();
        assert.equal(await nav.locator('a[aria-current="page"]:visible').getAttribute("href"), `/${locale}${route}`);
        assert.equal(await links.count(), ["/contact","/posts"].includes(route) ? 2 : 3);
      }
      await next.click();
      await nav.getByRole("link", {name:messages.Contact,exact:true}).click();
      await page.waitForURL(`**/${locale}/contact`);
      await previous.waitFor();
      await page.goBack();
      await next.waitFor();
      await nav.getByRole("button", {name:messages.language,exact:true}).click();
      await page.getByRole("menuitem", {name:locale === "en" ? "Deutsch" : "English",exact:true}).waitFor();
      await page.keyboard.press("Escape");
      await page.getByRole("menu").waitFor({state:"hidden"});
      for (const theme of ["light", "dark"]) {
        await nav.getByRole("button").last().click();
        await page.getByRole("menuitem", {name:locale === "de" ? (theme === "light" ? "Hell" : "Dunkel") : (theme === "light" ? "Light" : "Dark"),exact:true}).click();
        assert.equal(await page.locator("html").evaluate(element => element.classList.contains("dark")), theme === "dark");
        await page.getByRole("menu").waitFor({state:"hidden"});
      }
    }
    console.log("PASS active-route groups, browser history, keyboard paging and language menus.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });

