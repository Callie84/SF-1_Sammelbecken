/* eslint-env node */
const js = require("@eslint/js");
const globals = require("globals");
const prettier = require("eslint-config-prettier");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "_backup_sf1_*/**",
      "**/build/**",
      "**/dist/**",
      "**/*.min.js",
      "API/**",
      "apps/**",
      "Affiliate/**",
      "Bewertungen/**",
      "Dashboard/**",
      "Favoriten/**",
      "GrowManager/**",
      "Karte/**",
      "Kontakt/**",
      "LightingTool/**",
      "LiveFilter/**",
      "Merkliste/**",
      "Preisalarm/**",
      "SeedFinder/**",
      "Suchassistent/**",
      "Vergleich/**",
      "Werbebanner/**",
    ],
  },
  {
    files: ["server.js", "httpsServer.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.es2022 },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-console": "off",
    },
  },
  prettier,
];
