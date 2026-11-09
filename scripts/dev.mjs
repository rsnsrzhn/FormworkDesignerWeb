import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const localDotnet = path.join(
  homedir(),
  ".dotnet",
  process.platform === "win32" ? "dotnet.exe" : "dotnet"
);
const dotnet =
  process.env.DOTNET_BIN || (existsSync(localDotnet) ? localDotnet : "dotnet");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const children = new Set();
let stopping = false;

function start(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32" && command === npm,
    ...options,
  });
  children.add(child);
  child.on("exit", () => children.delete(child));
  child.on("error", () => children.delete(child));
  return child;
}

async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  await Promise.all(
    [...children].map(
      (child) =>
        new Promise((resolve) => {
          if (
            !child.pid ||
            child.exitCode !== null ||
            child.signalCode !== null
          ) {
            resolve();
            return;
          }
          const timer = setTimeout(() => child.kill("SIGKILL"), 5000);
          child.once("exit", () => {
            clearTimeout(timer);
            resolve();
          });
          child.kill("SIGTERM");
        })
    )
  );
}

async function run(command, args, { timeoutMs = 0 } = {}) {
  if (stopping) throw new Error("Запуск отменён.");
  await new Promise((resolve, reject) => {
    const child = start(command, args);
    const timer =
      timeoutMs > 0
        ? setTimeout(() => {
            child.kill("SIGTERM");
            reject(
              new Error(
                `Восстановление NuGet не завершилось за ${Math.round(
                  timeoutMs / 1000
                )} с. Проверьте доступ к api.nuget.org. Для просмотра интерфейса без API: npm run preview.`
              )
            );
          }, timeoutMs)
        : undefined;
    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("exit", (code) => {
      clearTimeout(timer);
      code === 0
        ? resolve()
        : reject(new Error(`Команда ${command} завершилась с кодом ${code}.`));
    });
  });
}

function watch(child, label) {
  child.once("error", (error) => {
    console.error(`${label}: ${error.message}`);
    void stop(1);
  });
  child.once("exit", (code) => {
    if (!stopping) {
      console.error(`${label} остановлен.`);
      void stop(code || 1);
    }
  });
}

process.once("SIGINT", () => void stop());
process.once("SIGTERM", () => void stop());

try {
  if (
    !existsSync(
      path.join(root, "FormworkDesignerWeb/ClientApp/node_modules/typescript")
    )
  ) {
    await run(npm, ["ci", "--prefix", "FormworkDesignerWeb/ClientApp"]);
  }
  console.log("\n[1/3] Сборка React");
  await run(npm, ["run", "build", "--prefix", "FormworkDesignerWeb/ClientApp"]);
  const restoreTimeout = Number(process.env.RESTORE_TIMEOUT_MS || 120000);
  if (
    !Number.isFinite(restoreTimeout) ||
    restoreTimeout < 100 ||
    restoreTimeout > 600000
  )
    throw new Error("RESTORE_TIMEOUT_MS должен быть от 100 до 600000.");
  console.log("\n[2/3] Восстановление пакетов NuGet");
  const restoreArgs = [
    "restore",
    "FormworkDesignerWeb/FormworkDesignerWeb.csproj",
    "--verbosity",
    "normal",
    "--disable-parallel",
  ];
  if (process.env.NUGET_CONFIG) {
    const config = path.resolve(root, process.env.NUGET_CONFIG);
    if (!existsSync(config)) throw new Error(`Не найден NuGet config: ${config}`);
    restoreArgs.push("--configfile", config);
  }
  await run(
    dotnet,
    restoreArgs,
    { timeoutMs: restoreTimeout }
  );
  console.log("\n[3/3] Сборка API");
  await run(dotnet, [
    "build",
    "FormworkDesignerWeb",
    "--no-restore",
    "--disable-build-servers",
    "-m:1",
  ]);
  if (!stopping) {
    const api = start(
      dotnet,
      [
        path.join(
          root,
          "FormworkDesignerWeb/bin/Debug/net10.0/FormworkDesignerWeb.dll"
        ),
        "--urls",
        "http://localhost:5080",
      ],
      {
        cwd: path.join(root, "FormworkDesignerWeb"),
        env: {
          ...process.env,
          ASPNETCORE_ENVIRONMENT: "Development",
          Site__PublicOrigin: "http://localhost:5173",
        },
      }
    );
    watch(api, "API");
    const frontend = start(
      process.execPath,
      [path.join(root, "FormworkDesignerWeb/ClientApp/scripts/dev.mjs")],
      {
        env: { ...process.env, PORT: "5173", API_URL: "http://localhost:5080" },
      }
    );
    watch(frontend, "Frontend");
    console.log(
      "\nСайт: http://localhost:5173\nAPI: http://localhost:5080\nОстановка обоих процессов: Ctrl+C\n"
    );
  }
} catch (error) {
  if (!stopping) console.error(`Не удалось запустить проект: ${error.message}`);
  await stop(1);
}
