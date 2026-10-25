// Read-only public checks; all CMS writes in this test are intercepted.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
let playwright;
for (const directory of (process.env.PATH || "").split(path.delimiter)) { try { playwright = require(path.join(directory, "..", "playwright")); break; } catch {} }
if (!playwright) throw new Error("Run with npm exec --package=playwright.");
const origin = process.env.TEST_BASE_URL || "http://localhost:3000";
(async () => {
  const executablePath = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(file => fs.existsSync(file));
  const browser = await playwright.chromium.launch({headless:true,...(executablePath ? {executablePath} : {})});
  try {
    const context=await browser.newContext();
    await context.route(/sentry\.io|\/monitoring/, route=>route.abort());
    const page=await context.newPage();const errors=[];page.on("pageerror",error=>errors.push(error.message));
    for(const route of ["/", "/about", "/projects", "/posts", "/contact"]) {
      const response=await fetch(origin+route+"?source=test",{redirect:"manual"});
      assert.equal(response.status,308);assert.equal(new URL(response.headers.get("location"),origin).pathname,"/en"+(route==="/"?"":route));assert.ok(response.headers.get("location").includes("source=test"));
    }
    for(const locale of ["en","de"])for(const route of ["", "/about", "/projects", "/posts", "/contact"]) {
      const response=await page.goto(origin+"/"+locale+route);assert.equal(response.status(),200);
      assert.equal(await page.locator("html").getAttribute("lang"),locale);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"),origin+"/"+locale+route);
      assert.equal(await page.locator('link[hreflang="de"]').count(),1);
      assert.equal(await page.locator('meta[property="og:locale"]').getAttribute("content"),locale==="de"?"de_DE":"en_US");
      const active=page.locator('header a[aria-current="page"]');assert.equal(await active.count(),1);
    }
    await page.goto(origin+"/de/contact?source=switch#contact");
    await page.getByRole("button",{name:"Darstellung ändern"}).click();await page.getByRole("menuitem",{name:"Dunkel",exact:true}).click();
    await page.getByRole("button",{name:"Sprache ändern"}).click();await page.getByRole("menuitem",{name:"English",exact:true}).click();
    await page.waitForURL("**/en/contact?source=switch#contact");
    assert.ok((await page.locator("html").getAttribute("class")).includes("dark"));
    await page.getByRole("heading",{name:"Send a message",exact:true}).waitFor();
    await page.getByRole("button",{name:"Change language"}).click();await page.getByRole("menuitem",{name:"Deutsch",exact:true}).click();
    await page.waitForURL("**/de/contact?source=switch#contact");
    await page.getByRole("heading",{name:"Nachricht senden",exact:true}).waitFor();
    for(const width of [320,360,768,1440]) {
      await page.setViewportSize({width,height:900});
      const box=await page.locator("header > div").first().boundingBox();assert.ok(box.x>=-1 && box.x+box.width<=width+1,"navbar fits "+width);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),"no horizontal page overflow at "+width);
      await page.getByRole("button",{name:"Sprache ändern"}).click();await page.getByRole("menuitem",{name:"English",exact:true}).waitFor();await page.keyboard.press("Escape");await page.getByRole("menu").waitFor({state:"hidden"});
    }
    const projects=await (await fetch(origin+"/api/admin/projects")).json();
    if(projects.length) {
      const id=projects[0]._id;
      await page.goto(origin+"/de/projects/"+id);
      assert.ok((await page.title()).includes(projects[0].translations?.de?.title || projects[0].title));
      await page.getByRole("button",{name:"Sprache ändern"}).click();await page.getByRole("menuitem",{name:"English",exact:true}).click();await page.waitForURL("**/en/projects/"+id);
    }
    assert.equal((await page.goto(origin+"/de/projects/invalid-id")).status(),404);
    await context.addCookies([require("./browser-session.cjs")()]);
    let record={_id:"123456789012345678901234",order:1,title:"English title",content:"English article",imageUrl:"",translations:{de:{title:"Deutscher Titel"}}};let saved;
    await page.route("**/api/admin/**",route=>{const request=route.request();if(request.url().includes("/posts")){if(request.method()==="PUT"){saved=request.postDataJSON();record={...record,...saved};return route.fulfill({json:record});}return route.fulfill({json:[record]});}return route.fulfill({json:[]});});
    await page.goto(origin+"/admin-dashboard");assert.equal(await page.getByRole("button",{name:/Change language|Sprache ändern/}).count(),0);
    await page.getByRole("button",{name:"Blog Posts",exact:true}).click();await page.locator('[data-reorder-id]').first().getByTitle("Edit",{exact:true}).click();
    await page.getByRole("tab",{name:"Deutsch",exact:true}).click();
    await page.locator("#BlogPost-de-content").fill("Deutscher Artikel");
    await page.getByRole("tab",{name:"English",exact:true}).click();await page.getByRole("tab",{name:"Deutsch",exact:true}).click();assert.equal(await page.locator("#BlogPost-de-content").inputValue(),"Deutscher Artikel");
    await page.getByRole("button",{name:"Save record",exact:true}).click();await page.waitForFunction(()=>!document.querySelector("form"));
    assert.equal(saved.title,"English title");assert.equal(saved.content,"English article");assert.equal(saved.translations.de.title,"Deutscher Titel");assert.equal(saved.translations.de.content,"Deutscher Artikel");
    assert.deepEqual(errors,[]);
    console.log("PASS: redirects, 10 locale pages, metadata, switch/query/hash, theme, active navigation, 320/360px navbar, project identity/404 and bilingual CMS drafts.");
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
