import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";

const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

export default defineManifest(async () => ({
  manifest_version: 3,
  name: "ReadVault - Bookmark. Organize. Thrive",
  description:
    "ReadVault is an extension that acts as your digital reading vault. Save and organize pages in one place for easy access anytime.",
  version: `${major}.${minor}.${patch}`,
  version_name: version,
  icons: {
    // "16": "src/assets/icons/icon-16.png",
    // "32": "src/assets/icons/icon-32.png",
    "48": "src/assets/icons/icon-48.png",
    "128": "src/assets/icons/icon-128.png",
  },
  background: {
    service_worker: "src/background/index.ts",
  },
  action: {
    default_popup: "index.html",
    default_icon: {
      // "16": "src/assets/icons/icon-16.png",
      // "32": "src/assets/icons/icon-32.png",
      "48": "src/assets/icons/icon-48.png",
      "128": "src/assets/icons/icon-128.png",
    },
  },
  permissions: ["tabs"] as chrome.runtime.ManifestPermissions[],
  //used for hot reload to work, disable on prod
  host_permissions: ["<all_urls>"],
}));
