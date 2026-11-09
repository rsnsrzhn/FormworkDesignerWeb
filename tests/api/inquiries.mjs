import { spawn, spawnSync } from "node:child_process";
import { mkdtemp, readFile, mkdir, copyFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
const dotnet = process.env.DOTNET_BIN || "dotnet";
const root = process.cwd();
const temp = await mkdtemp(path.join(tmpdir(), "formwork-api-"));
const origin = "http://localhost:5173";
const valid = {
  requestId: crypto.randomUUID(),
  fullName: "Тестовый Пользователь",
  email: "test@example.org",
  phone: "+375 (29) 123-45-67",
  consent: true,
  policyVersion: "2026-11-03",
  website: "",
};
let child;
async function start(enabled = true, production = false) {
  const port = 18580;
  let output = "";
  child = spawn(
    dotnet,
    [
      "run",
      "--no-launch-profile",
      "--project",
      "FormworkDesignerWeb",
      "--configuration",
      "Release",
      "--no-build",
    ],
    {
      cwd: root,
      env: {
        ...process.env,
        ASPNETCORE_ENVIRONMENT: production ? "Production" : "Development",
        ASPNETCORE_URLS: `http://127.0.0.1:${port}`,
        Site__PublicOrigin: origin,
        Site__DataDirectory: path.join(temp, "data"),
        Site__AcceptInquiries: String(enabled),
        Site__LegalReviewed: "false",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  child.stdout.on("data", (b) => {
    output += b;
  });
  child.stderr.on("data", (b) => {
    output += b;
  });
  child.on("error", (error) => {
    output += error.message;
  });
  for (let n = 0; n < 100; n++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (response.ok) return `http://127.0.0.1:${port}`;
    } catch {}
    if (child.exitCode !== null) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`API did not start: ${output}`);
}
async function stop() {
  if (!child || child.exitCode !== null) return;
  await new Promise((resolve) => {
    child.once("exit", resolve);
    child.kill("SIGTERM");
  });
}
function cli(command, filename, dataDirectory = path.join(temp, "data")) {
  const result = spawnSync(
    dotnet,
    [
      path.join(
        root,
        "FormworkDesignerWeb/bin/Release/net10.0/FormworkDesignerWeb.dll"
      ),
      command,
      ...(filename ? [filename] : []),
    ],
    {
      env: { ...process.env, Site__DataDirectory: dataDirectory },
      encoding: "utf8",
    }
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
}
try {
  let base = await start();
  const send = (data, override = {}) =>
    fetch(base + "/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
        ...override,
      },
      body: JSON.stringify(data),
    });
  assert.equal((await send(valid)).status, 202);
  assert.equal((await send(valid)).status, 202);
  assert.equal(
    (await send({ ...valid, phone: "+7 916 123 45 67" })).status,
    409
  );
  assert.equal(
    (await send({ ...valid, requestId: crypto.randomUUID(), consent: false }))
      .status,
    400
  );
  assert.equal(
    (
      await send({
        ...valid,
        requestId: crypto.randomUUID(),
        website: "spam.example",
      })
    ).status,
    202
  );
  assert.equal((await send(valid)).status, 429);
  assert.equal((await fetch(base + "/api/inquiries")).status, 405);
  assert.equal((await fetch(base + "/data/inquiries.db")).status, 404);
  console.log(
    "PASS save, idempotency, validation, honeypot, rate limiting, private records"
  );
  await stop();
  const csv = path.join(temp, "inquiries.csv");
  cli("export", csv);
  const exported = await readFile(csv, "utf8");
  assert.equal(exported.trim().split("\n").length, 2);
  assert.ok(exported.includes("'+375291234567"));
  const backup = path.join(temp, "backup.db");
  cli("backup", backup);
  const restored = path.join(temp, "restore");
  await mkdir(restored);
  await copyFile(backup, path.join(restored, "inquiries.db"));
  const restoredCsv = path.join(temp, "restored.csv");
  cli("export", restoredCsv, restored);
  assert.equal(await readFile(restoredCsv, "utf8"), exported);
  console.log(
    "PASS CSV export, formula protection, online backup and restoration"
  );
  base = await start();
  assert.equal(
    (await send({ ...valid, phone: "+7 701 123 45 67" })).status,
    400
  );
  assert.equal(
    (
      await send(
        { ...valid, requestId: crypto.randomUUID() },
        { Origin: "https://evil.example" }
      )
    ).status,
    403
  );
  assert.equal(
    (
      await send({
        ...valid,
        requestId: crypto.randomUUID(),
        policyVersion: "old",
      })
    ).status,
    400
  );
  assert.equal(
    (
      await send({
        ...valid,
        requestId: crypto.randomUUID(),
        phone: "8 (916) 123-45-67",
      })
    ).status,
    202
  );
  await stop();
  base = await start(true, true);
  assert.equal((await send(valid)).status, 503);
  assert.equal(
    (await (await fetch(base + "/api/site-config")).json()).inquiriesEnabled,
    false
  );
  console.log(
    "PASS origin, policy version, Russian phone, production legal gate"
  );
} finally {
  await stop();
  await rm(temp, { recursive: true, force: true });
}
