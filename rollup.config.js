import pkg from "./package.json";

export default [
  {
    input: "src/ninjaForm.js",
    output: {
      name: "ninjaForm",
      file: pkg.browser,
      format: "umd"
    }
  }
];
