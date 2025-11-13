import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        URL: "readonly",
        Blob: "readonly",
        Intl: "readonly",
        Date: "readonly",
        Object: "readonly",
        Array: "readonly",
        String: "readonly",
        JSON: "readonly",
        setTimeout: "readonly",
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["error", "warn"] }],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
