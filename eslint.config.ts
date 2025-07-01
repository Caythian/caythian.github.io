import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({}),
  {
    files: ["**/*.{js, jsx, ts,tsx}"],
  },
];

export default eslintConfig;
