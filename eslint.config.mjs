/* eslint-disable no-underscore-dangle */
import pluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

/** @see https://www.raulmelo.me/en/blog/migration-eslint-to-flat-config */
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname, // optional; default: process.cwd()
  resolvePluginsRelativeTo: __dirname, // optional
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends("airbnb-base"),
  prettierConfig,
  prettierPluginRecommended,
  {
    rules: {
      "import/no-extraneous-dependencies": [
        "warn",
        {
          devDependencies: [
            "**/*.config.{mts,ts,mjs,js}",
            "**/storybook/**",
            "**/stories/**",
            "**/*.stories.{ts,tsx,js,jsx}",
            "**/*.{spec,test}.{ts,tsx,js,jsx}",
          ],
        },
      ],
    },
  },
];
