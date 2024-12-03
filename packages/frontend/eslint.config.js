import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

import rootEsLint from "../../eslint.config.mjs";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...rootEsLint,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: [
            "./packages/frontend/tsconfig.app.json",
            "./packages/frontend/tsconfig.node.json",
          ],
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-shadow": "off",
      "import/no-absolute-path": "warn",
      "import/no-unresolved": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "import/prefer-default-export": "off",
      "import/extensions": "off",
    },
  },
  {
    extends: storybook.configs["flat/recommended"],
    files: ["**/*.stories.{ts,tsx,js,jsx}"],
    plugins: {
      storybook,
    },
    rules: {
      "storybook/story-exports": "error",
    },
  },
);
