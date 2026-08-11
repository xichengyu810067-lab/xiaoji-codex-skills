import assert from "node:assert/strict";
import { scanContent } from "../scripts/check-public-content.mjs";

const syntheticUri = "wss" + "://example.invalid/socket";
const privateUri = "wss" + "://voice" + ".internal/socket";
const databaseUri = "postgres" + "://db" + ".internal/app";
const fileUri = "file" + ":///private/data.sqlite";
const privateConnection = "Host" + "=" + "db" + ".internal;Port=5432;Database=app";
const privateName = "cache" + ".local";

assert.deepEqual(scanContent("README.md", `Synthetic endpoint: ${syntheticUri}`), []);
assert.deepEqual(scanContent("skills/demo/SKILL.md", `Synthetic endpoint: ${syntheticUri}`), []);
assert.match(scanContent("notes.txt", syntheticUri).join("\n"), /forbidden URI or endpoint/);
assert.match(scanContent("notes.txt", privateUri).join("\n"), /forbidden URI or endpoint/);
assert.match(scanContent("notes.txt", databaseUri).join("\n"), /forbidden URI or endpoint/);
assert.match(scanContent("notes.txt", fileUri).join("\n"), /forbidden URI or endpoint/);
assert.match(scanContent("notes.txt", privateConnection).join("\n"), /forbidden connection string/);
assert.match(scanContent("notes.txt", `service=${privateName}`).join("\n"), /private hostname/);
assert.match(scanContent("notes.txt", "redis" + "://cache.example.invalid/0").join("\n"), /forbidden URI or endpoint/);
console.log("PASS public-content unit tests: URI, connection string, private-host, and documented synthetic cases");
