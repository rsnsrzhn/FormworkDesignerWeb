import webpack from "webpack";
import {
  mkdir,
  copyFile,
  cp,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("..", import.meta.url));
await mkdir(path.join(root, "dist"), { recursive: true });
const stats = await new Promise((resolve, reject) =>
  webpack(
    {
      mode: "production",
      context: root,
      entry: "./src/main.tsx",
      output: {
        path: path.join(root, "dist"),
        filename: "assets/app.[contenthash:12].js",
        clean: true,
      },
      resolve: { extensions: [".tsx", ".ts", ".js"] },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: path.join(root, "scripts/ts-loader.cjs"),
          },
        ],
      },
      performance: { maxAssetSize: 300000, maxEntrypointSize: 300000 },
    },
    (error, stats) => (error ? reject(error) : resolve(stats))
  )
);
if (stats.hasErrors()) throw new Error(stats.toString({ colors: false }));
console.log(stats.toString({ colors: false, modules: false, chunks: false }));
const assets = await readdir(path.join(root, "dist/assets"));
const script = assets.find((name) => /^app\..*\.js$/.test(name));
await copyFile(
  path.join(root, "src/styles.css"),
  path.join(root, "dist/assets/styles.css")
);
const fontRoot = path.join(root, "node_modules/@fontsource/onest/files");
await mkdir(path.join(root, "dist/assets/fonts"), { recursive: true });
await copyFile(
  path.join(root, "node_modules/@fontsource/onest/LICENSE"),
  path.join(root, "dist/assets/fonts/OFL.txt")
);
for (const name of await readdir(fontRoot)) {
  if (/onest-(cyrillic|latin)-(400|500|600|700)-normal\.woff2$/.test(name))
    await copyFile(
      path.join(fontRoot, name),
      path.join(root, "dist/assets/fonts", name)
    );
}
await cp(path.join(root, "public"), path.join(root, "dist"), {
  recursive: true,
});
const html = (await readFile(path.join(root, "index.html"), "utf8")).replace(
  "__SCRIPT__",
  `/assets/${script}`
);
await writeFile(path.join(root, "dist/index.html"), html);
