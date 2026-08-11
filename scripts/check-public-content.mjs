import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const result = spawnSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" });
if (result.status !== 0) {
  console.error("FAIL public-content: Git file listing is unavailable");
  process.exit(1);
}

const privateKey = /-----BEGIN [A-Z ]*PRIVATE KEY-----/;
const githubToken = new RegExp(`\\bgh${"[pousr]"}_[A-Za-z0-9_]{20,}\\b`);
const githubFineGrained = new RegExp(`\\bgithub${"_pat"}_[A-Za-z0-9_]{20,}\\b`);
const slackToken = new RegExp(`\\bxox${"[baprs]"}-[A-Za-z0-9-]{20,}\\b`);
const accessKey = /\bAKIA[0-9A-Z]{16}\b/;
const bearer = /Authorization\s*:\s*Bearer\s+\S+/i;
const discordLikeToken = /\b[A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27}\b/;
const directUrl = /https?:\/\//i;
const ipv4 = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
const snowflake = /\b\d{17,20}\b/;
const secretPatterns = [privateKey, githubToken, githubFineGrained, slackToken, accessKey, bearer, discordLikeToken, directUrl, ipv4, snowflake];
const forbiddenPath = /(^|\/)(?:\.env(?:\..*)?|.*\.(?:sqlite|sqlite3|db|log|secure))$/i;
const failures = [];

for (const relativePath of result.stdout.split(/\r?\n/).filter(Boolean)) {
  if (forbiddenPath.test(relativePath)) {
    failures.push(`${relativePath}: forbidden public filename`);
    continue;
  }
  const absolutePath = resolve(process.cwd(), relativePath);
  if (!existsSync(absolutePath)) continue;
  const content = readFileSync(absolutePath, "utf8");
  if (secretPatterns.some((pattern) => pattern.test(content))) {
    failures.push(`${relativePath}: possible secret, real endpoint, or account identifier`);
  }
}

if (failures.length > 0) {
  console.error("FAIL public-content");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("PASS public-content: no forbidden public filenames or detectable secret-like content");
