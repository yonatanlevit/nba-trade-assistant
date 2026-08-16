// QA helper for the validation-outage check in docs/qa-plan.md §4.
//
// Sits between the app and bball-GM. Roster calls (/teams, /players) always
// pass through to the real API, so name resolution keeps working. Only
// /trades/validate can be failed on demand -- which is exactly the outage the
// monotonicity invariant is about.
//
//   node outage-proxy.mjs
//   set BBALLGM_BASE_URL=http://127.0.0.1:4599 and start the app
//   curl http://127.0.0.1:4599/__outage/on    <- validation starts failing
//   curl http://127.0.0.1:4599/__outage/off   <- validation recovers

import http from "node:http";

const REAL = process.env.REAL_BASE ?? "https://bball-gm.com/api";
const PORT = Number(process.env.PORT ?? 4599);

let outage = false;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const path = url.pathname;

  if (path === "/__outage/on") {
    outage = true;
    console.log("\n>>> OUTAGE ON  — /trades/validate now returns 503\n");
    return page(res);
  }
  if (path === "/__outage/off") {
    outage = false;
    console.log("\n>>> OUTAGE OFF — validation restored\n");
    return page(res);
  }
  if (path === "/__outage") return page(res);

  // 503 is deliberate: the client treats 5xx as an infrastructure failure,
  // while 4xx would be read as a definitive "invalid trade" verdict instead.
  if (outage && path.startsWith("/trades/validate")) {
    console.log("  x 503 (simulated outage)  " + path);
    return json(res, 503, { error: "simulated outage" });
  }

  const body = await readBody(req);
  try {
    const upstream = await fetch(REAL + path + url.search, {
      method: req.method,
      headers: { "content-type": "application/json" },
      body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
    });
    const text = await upstream.text();
    console.log(`  . ${upstream.status} ${req.method} ${path}`);
    res.writeHead(upstream.status, {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    });
    res.end(text);
  } catch (e) {
    console.log("  ! upstream unreachable: " + e.message);
    json(res, 502, { error: String(e) });
  }
});

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

function json(res, code, obj) {
  res.writeHead(code, { "content-type": "application/json" });
  res.end(JSON.stringify(obj));
}

/** Big obvious status page — a bare JSON body is far too easy to misread as
 *  a blank page while you are mid-QA. */
function page(res) {
  const on = outage;
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(`<!doctype html>
<meta charset="utf-8"><title>${on ? "OUTAGE ON" : "outage off"}</title>
<body style="margin:0;font:16px/1.5 system-ui,sans-serif;background:${on ? "#2b0b0b" : "#0b2b14"};color:#fff;
             display:flex;align-items:center;justify-content:center;height:100vh;text-align:center">
  <div>
    <div style="font-size:12px;letter-spacing:.2em;opacity:.6;text-transform:uppercase">bball-GM validation</div>
    <div style="font-size:72px;font-weight:800;margin:.15em 0;color:${on ? "#ff6b6b" : "#4ade80"}">
      ${on ? "BLOCKED" : "LIVE"}
    </div>
    <p style="opacity:.75;max-width:34em;margin:0 auto 1.6em">
      ${on
        ? "POST /trades/validate returns 503. Roster lookups still work, so name resolution is unaffected."
        : "All requests pass through to the real bball-GM API."}
    </p>
    <a href="/__outage/${on ? "off" : "on"}"
       style="display:inline-block;padding:.85em 2em;border-radius:8px;font-weight:700;text-decoration:none;
              background:${on ? "#4ade80" : "#ff6b6b"};color:#111">
      ${on ? "Restore validation" : "Block validation"}
    </a>
    <p style="opacity:.4;font-size:13px;margin-top:2.5em">refresh this tab any time to see current state</p>
  </div>
</body>`);
}

server.listen(PORT, () => {
  console.log(`outage proxy listening on http://127.0.0.1:${PORT}`);
  console.log(`  upstream: ${REAL}`);
  console.log(`  toggle:   /__outage/on   /__outage/off   /__outage\n`);
});
