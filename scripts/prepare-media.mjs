import { mkdir, copyFile, access } from "node:fs/promises";
import path from "node:path";
const source = path.resolve(process.argv[2] || "opalubka-roliki-2026-11-02");
const target = path.resolve(process.argv[3] || "media");
if (source === target)
  throw new Error("Исходный каталог должен отличаться от целевого.");
const names = [
  "01-primery",
  "02-razbivka",
  "03-vysota",
  "04-list",
  "05-risovanie",
];
for (const name of names)
  for (const ext of ["jpg", "mp4"])
    await access(path.join(source, `${name}.${ext}`));
await mkdir(target, { recursive: true });
for (const name of names)
  for (const ext of ["jpg", "mp4"])
    await copyFile(
      path.join(source, `${name}.${ext}`),
      path.join(target, `${name}.${ext}`)
    );
console.log("Подготовлены 5 изображений и 5 видео. Установщик не копируется.");
