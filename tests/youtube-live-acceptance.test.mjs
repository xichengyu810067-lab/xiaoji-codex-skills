import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const skill = (name) => readFileSync(join(process.cwd(), "skills", name, "SKILL.md"), "utf8");
const triage = skill("triage-render-lavalink-runtime");
const capture = skill("capture-discord-live-acceptance");
const forbiddenAuth = ["OAuth", "poToken", "cookie", "visitorData", "refreshToken"];

assert.match(triage, /歷史 build failure.*current live deployment/s);
assert.match(triage, /TVHTML5_SIMPLY/);
assert.match(triage, /AllClientsFailedException.*requires login/s);
assert.match(triage, /loadtracks.*URL parse.*不等於播放/s);
assert.match(triage, /五個相異.*TrackStart.*正在播放/s);
assert.match(capture, /五個相異.*TrackStart.*已開始播放.*正在播放/s);
assert.match(capture, /queue、pause、resume、skip、stop/);
assert.match(capture, /question\.md/);
for (const term of forbiddenAuth) {
  assert.match(triage, new RegExp(term));
  assert.match(capture, new RegExp(term));
}
console.log("PASS YouTube live acceptance: safe source policy, five-track gate, controls, and blocker contract");
