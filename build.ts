import tailwind from "bun-plugin-tailwind";
import { rm, mkdir, copyFile, readdir } from "node:fs/promises";
import path from "node:path";

const outdir = path.join(process.cwd(), "dist");
await rm(outdir, { recursive: true, force: true });

const entrypoints = [...new Bun.Glob("src/**/*.html").scanSync()];

const result = await Bun.build({
  entrypoints,
  outdir,
  plugins: [tailwind],
  minify: true,
  target: "browser",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

for (const output of result.outputs) {
  console.log(` ${path.relative(process.cwd(), output.path)}  ${(output.size / 1024).toFixed(1)} KB`);
}

// Copy PrivacyPolicyPage.html to dist as privacy.html
const assetsDir = path.join(process.cwd(), "src/assets");
const distDir = path.join(process.cwd(), "dist");

try {
  const files = await readdir(assetsDir);
  for (const file of files) {
    if (file.endsWith(".html")) {
      const src = path.join(assetsDir, file);
      const dest = path.join(distDir, file);
      await mkdir(distDir, { recursive: true });
      await copyFile(src, dest);
      console.log(` Copied ${file} to dist`);
    }
  }
} catch (err) {
  console.error("Error copying assets:", err);
}
