// Local browser tests only. Content writes must be intercepted by each test.
const {createHmac,randomBytes} = require("node:crypto");
module.exports = function browserSession() {
  require("@next/env").loadEnvConfig(process.cwd());
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("Configure a local admin session secret for browser tests.");
  const payload = Buffer.from(JSON.stringify({exp:Math.floor(Date.now()/1000)+300,nonce:randomBytes(24).toString("hex")})).toString("base64url");
  return {name:"adminSession",value:payload+"."+createHmac("sha256",secret).update(payload).digest("base64url"),domain:"localhost",path:"/",httpOnly:true,sameSite:"Lax"};
};
