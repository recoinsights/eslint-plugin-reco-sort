import * as esbuild from "esbuild";

const watch = process.argv.find((arg) => arg == "--watch")
    ? {
          onRebuild(error: unknown, result: unknown) {
              if (error) console.error("watch build failed:", error);
              else console.log("watch build succeeded:", result);
          },
      }
    : false;

const options = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: "node16",
    tsconfig: 'tsconfig.prod.json',
    watch,
};

esbuild.build({
    ...options,
    format: "cjs",
    outfile: "lib/index.js",
});

esbuild.build({
    ...options,
    format: "esm",
    outfile: "lib/index.mjs",
});
