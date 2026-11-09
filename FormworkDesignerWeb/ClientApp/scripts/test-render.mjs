import webpack from "webpack";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawnSync } from "node:child_process";
const root = fileURLToPath(new URL("..", import.meta.url));
const stats = await new Promise((resolve, reject) =>
  webpack(
    {
      mode: "development",
      target: "node",
      context: root,
      entry: "./tests/render.tsx",
      output: { path: path.join(root, "test-results"), filename: "render.cjs" },
      resolve: { extensions: [".tsx", ".ts", ".js"] },
      externalsPresets: { node: true },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: path.join(root, "scripts/ts-loader.cjs"),
          },
        ],
      },
    },
    (error, result) => (error ? reject(error) : resolve(result))
  )
);
if (stats.hasErrors()) throw new Error(stats.toString());
const result = spawnSync(
  process.execPath,
  [path.join(root, "test-results/render.cjs")],
  { stdio: "inherit" }
);
process.exitCode = result.status || 0;
