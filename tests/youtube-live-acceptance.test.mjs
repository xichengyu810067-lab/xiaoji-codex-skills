import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const skill = (name) => readFileSync(join(process.cwd(), "skills", name, "SKILL.md"), "utf8");
const triage = skill("triage-render-lavalink-runtime");
const capture = skill("capture-discord-live-acceptance");
const forbiddenAuth = ["OAuth", "poToken", "cookie", "token", "visitorData", "refreshToken"];
const blockerFields = ["status: BLOCKED", "scope:", "attempted:", "blocker:", "impact:", "required_authority:", "next_action:"];

assert.match(triage, /歷史 build failure.*current live deployment/s);
assert.match(triage, /僅允許 `TVHTML5_SIMPLY`.*不要加入替代 client.*fallback/s);
assert.match(capture, /只允許 `TVHTML5_SIMPLY`.*不要使用主 Google 帳號/s);
assert.match(triage, /AllClientsFailedException.*requires login.*停止重送.*`FAIL`.*`BLOCKED`/s);
assert.match(capture, /AllClientsFailedException.*requires login.*`FAIL`.*`BLOCKED`.*不得以 OAuth.*重試/s);
assert.match(triage, /loadtracks.*URL parse.*不等於播放/s);
assert.match(triage, /五個相異.*actual `TrackStart`.*正在播放/s);
assert.match(capture, /五個相異.*actual `TrackStart`.*已開始播放.*正在播放/s);
assert.match(triage, /queue、pause、resume、skip、stop.*五個獨立.*時間序列.*不要把已完成的播放 gate 延伸成 controls `PASS`/s);
assert.match(capture, /queue、pause、resume、skip、stop.*各自需要一條獨立時間序列.*未執行.*`BLOCKED`.*`PARTIAL`/s);
assert.match(triage, /question\.md.*不要放入正式環境位置、帳號、guild、URL、secret.*影片識別值/s);
assert.match(capture, /question\.md.*不要記錄正式環境位置、帳號、guild、URL、secret.*影片識別值/s);
for (const term of forbiddenAuth) {
  assert.match(triage, new RegExp(`不要使用.*${term}|不要以 ${term}`));
  assert.match(capture, new RegExp(`不要使用.*${term}|不得以 ${term}`));
}
for (const field of blockerFields) {
  assert.match(triage, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(capture, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}
console.log("PASS YouTube live acceptance: safe source policy, five-track gate, controls, and blocker contract");
