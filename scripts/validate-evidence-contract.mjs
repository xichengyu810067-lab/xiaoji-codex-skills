import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const skillNames = [
  "release-protected-main",
  "recover-nyanko-dirty-worktree",
  "triage-render-lavalink-runtime",
  "capture-discord-live-acceptance"
];
const root = process.cwd();
const reference = "references/evidence-contract.md";
const contracts = skillNames.map((name) => readFileSync(resolve(root, "skills", name, reference), "utf8"));

for (const contract of contracts) {
  assert.match(contract, /Use exactly one final status: `PASS`, `FAIL`, `BLOCKED`, or `PARTIAL`\./);
  assert.match(contract, /status: <PASS\|FAIL\|BLOCKED\|PARTIAL>/);
  assert.match(contract, /Never infer `PASS` from a simulation/);
}
assert.ok(contracts.every((contract) => contract === contracts[0]), "Evidence contracts must be byte-identical.");
console.log("PASS evidence-contract: four skills share the same fail-closed contract");
