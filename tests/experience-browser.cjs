// npm exec --yes --package=playwright --package=esbuild -- node tests/experience-browser.cjs
// Bundles the actual components with fixture props; never writes to content APIs.
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
function tool(name) {
  for (const directory of (process.env.PATH || "").split(path.delimiter)) {
    try { return require(path.join(directory, "..", name)); } catch { /* try next */ }
  }
  throw new Error("Run through npm exec with playwright and esbuild.");
}
(async () => {
  const source = [
    'import React from "react";',
    'import {NextIntlClientProvider} from "next-intl";',
    'import messages from "./messages/en.json";',
    'import germanMessages from "./messages/de.json";',
    'import {createRoot} from "react-dom/client";',
    'import AboutEducation from "./components/about/AboutEducation";',
    'import AboutExperience from "./components/about/AboutExperience";',
    'import Experience from "./components/ExperienceSection";',
    'const skills = Array.from({length:12}, (_,i) => ({name: "Skill " + i, image:"/assets/images/logo1.png", description:"Hidden skill description"}));',
    'const common = {startDate:"2020-01-01",endDate:"2024-01-01",logo:"/assets/images/logo1.png",description:"Full description remains visible.",skills};',
    'const educations = [{...common, degree:"BSc",field:"Computing",institution:"University",learningOutcomes:["One","Two","Three","Four","Five","Six"]},{...common,degree:"Legacy",field:"Legacy program",institution:"Legacy school"}];',
    'const jobs = [{...common,company:"Company",position:"Engineer",responsibilities:["A","B","C","D","E"].map(name=>({name}))}];',
    'const root = createRoot(document.getElementById("fixture")); root.render(<NextIntlClientProvider locale="en" messages={messages} timeZone="UTC"><div id="about"><AboutEducation educations={educations}/><AboutExperience jobs={jobs}/></div><Experience jobs={jobs} education={educations}/></NextIntlClientProvider>);'
    ,'window.renderTimeline = locale => root.render(<NextIntlClientProvider key={locale} locale={locale} messages={locale === "de" ? germanMessages : messages} timeZone="UTC"><Experience jobs={[{...jobs[0],position:"Earlier",startDate:"2019-01-01"},{...jobs[0],position:"Later",startDate:"2024-03-01"}]} /></NextIntlClientProvider>);'
  ].join("\n");
  const bundle = await tool("esbuild").build({ stdin: { contents: source, resolveDir: process.cwd(), loader:"tsx" }, bundle:true, write:false, platform:"browser", jsx:"automatic", define:{"process.env": "{}", "process.env.NODE_ENV":'"development"'}, alias:{"@":process.cwd()} });
  const executablePath = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(file=>fs.existsSync(file));
  const browser = await tool("playwright").chromium.launch({headless:true, ...(executablePath ? {executablePath} : {})});
  try {
    const page = await browser.newPage();
    await page.goto("http://localhost:3000/about");
    const aboutStyles = await page.locator('link[rel="stylesheet"]').evaluateAll(links=>links.map(link=>link.href));
    await page.goto("http://localhost:3000/");
    const homeStyles = await page.locator('link[rel="stylesheet"]').evaluateAll(links=>links.map(link=>link.href));
    const styles = [...new Set([...aboutStyles, ...homeStyles])];
    await page.route("**/experience-fixture", route=>route.fulfill({contentType:"text/html",body:'<!doctype html><html><head>'+styles.map(href=>'<link rel="stylesheet" href="'+href+'">').join("")+'</head><body><main style="overflow:hidden;padding:20px"><div id="fixture"></div></main><script src="/experience-fixture.js"></script></body></html>'}));
    await page.route("**/experience-fixture.js", route=>route.fulfill({contentType:"application/javascript",body:bundle.outputFiles[0].text}));
    const errors=[];
    page.on("pageerror", error=>{ errors.push(error.message); console.error(error.message); });
    await page.goto("http://localhost:3000/experience-fixture");
    await page.locator("#about").waitFor();
    for (const width of [1440,390]) for (const dark of [false,true]) {
      await page.setViewportSize({width,height:1000});
      await page.evaluate(dark=>document.documentElement.classList.toggle("dark",dark),dark);
      const about=page.locator("#about");
      const outcomes=about.getByRole("region",{name:"Key Learning Outcomes",exact:true});
      const responsibilities=about.getByRole("region",{name:"Responsibilities",exact:true});
      assert.equal(await outcomes.count(),1,"legacy record has no empty outcomes heading");
      assert.equal(await outcomes.locator("li").count(),4);
      await outcomes.getByRole("button",{name:/Show more/}).click();
      assert.equal(await outcomes.locator("li").count(),6);
      assert.equal(await responsibilities.locator("li").count(),4,"entries expand independently");
      await outcomes.getByRole("button",{name:/Show less/}).click();
      assert.equal(await about.getByText("Hidden skill description").count(),0);
      assert.equal(await about.getByText("Skills Learned",{exact:true}).count(),0);
      assert.equal(await about.getByText("Skill 0",{exact:true}).count(),3,"education and job skills are name badges");
      const skills=page.locator("#experience").getByRole("list",{name:"Education skills",exact:true}).first();
      const icon=skills.getByRole("listitem",{name:"Skill 0",exact:true});
      await icon.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      await icon.hover();
      await icon.getByRole("tooltip").waitFor();
      assert.equal(await icon.getByRole("tooltip").innerText(),"Skill 0");
      await page.mouse.move(0,0);
      await icon.focus();
      await icon.getByRole("tooltip").waitFor();
      await page.waitForTimeout(300);
      const box=await icon.getByRole("tooltip").boundingBox();
      const iconBox=await icon.boundingBox();
      assert.ok(box.y+box.height<iconBox.y,"old tooltip sits above the icon");
      assert.equal(await icon.getAttribute("title"),null);
      const image=await icon.locator("img").boundingBox();
      assert.equal(image.width,40); assert.equal(image.height,40);
      const rows=await skills.locator("li").evaluateAll(items=>new Set(items.map(item=>Math.round(item.getBoundingClientRect().top))).size);
      if(width===390) assert.ok(rows>1,"icons wrap on mobile");
      const timeline=page.locator("#experience");
      const detail=timeline.getByRole("region",{name:"Key Learning Outcomes",exact:true});
      await detail.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      const before=await timeline.locator(".timeline-logo").first().boundingBox();
      await detail.getByRole("button",{name:/Show more/}).click();
      await page.waitForTimeout(150);
      const after=await timeline.locator(".timeline-logo").first().boundingBox();
      assert.ok(Math.abs(before.x-after.x)<1,"expansion preserves timeline horizontal alignment");
      assert.equal(await detail.locator("li").count(),6);
      await detail.getByRole("button",{name:/Show less/}).click();
    }
    for (const locale of ["de", "en"]) {
      await page.evaluate(locale => window.renderTimeline(locale), locale);
      await page.getByRole("heading", {name:"Later",exact:true}).waitFor();
      assert.deepEqual(await page.locator(".expText h1").allTextContents(), ["Later", "Earlier"], "raw date ordering stays unchanged in " + locale);
      assert.ok((await page.locator("#experience").innerText()).includes(locale === "de" ? "M\u00e4rz 2024" : "March 2024"));
    }
    assert.deepEqual(errors,[]);
    console.log("PASS: public components, legacy records, independent expansion, restored hover/focus tooltips and About name badges, 40px icons, mobile wrapping, light/dark themes, and timeline alignment.");
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
