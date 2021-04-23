/* eslint-disable import/no-extraneous-dependencies */
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    external: Object.keys(pkg.dependencies),
    plugins: [
      typescript({
        tsconfig: "./tsconfig.build.json",
      }),
    ],
    output: [{ dir: "./dist", format: "cjs", sourcemap: true }],
  },
];
