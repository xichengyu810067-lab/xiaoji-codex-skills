import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const skillsRoot = join(process.cwd(), "skills");
const skillNames = [
  "release-protected-main",
  "recover-nyanko-dirty-worktree",
  "triage-render-lavalink-runtime",
  "capture-discord-live-acceptance"
];
const allowedFiles = ["SKILL.md", "agents/openai.yaml", "references/evidence-contract.md"];

function filesBelow(folder, base = folder) {
  const found = [];
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const fullPath = join(folder, entry.name);
    if (entry.isDirectory()) found.push(...filesBelow(fullPath, base));
    else found.push(relative(base, fullPath).replaceAll("\\", "/"));
  }
  return found.sort();
}

assert.deepEqual(readdirSync(skillsRoot).sort(), skillNames.slice().sort());
for (const name of skillNames) {
  const folder = join(skillsRoot, name);
  assert.deepEqual(filesBelow(folder), allowedFiles, `${name} has only self-contained required files`);
  const skill = readFileSync(join(folder, "SKILL.md"), "utf8");
  const agent = readFileSync(join(folder, "agents/openai.yaml"), "utf8");
  assert.match(skill, new RegExp(`^---\\r?\\nname: ${name}\\r?\\ndescription: .+\\r?\\n---`, "s"));
  assert.doesNotMatch(skill, /TODO|README/i);
  assert.match(skill, /references\/evidence-contract\.md/);
  assert.match(agent, /display_name: ".+"/);
  assert.match(agent, /short_description: ".{25,64}"/);
  assert.match(agent, new RegExp(`default_prompt: "Use \\$${name} `));
}
console.log("PASS structure: four initialized skills have the approved minimal layout");
