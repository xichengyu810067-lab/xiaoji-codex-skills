import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const privateKey = /-----BEGIN [A-Z ]*PRIVATE KEY-----/;
const githubToken = new RegExp(`\\bgh${"[pousr]"}_[A-Za-z0-9_]{20,}\\b`);
const githubFineGrained = new RegExp(`\\bgithub${"_pat"}_[A-Za-z0-9_]{20,}\\b`);
const slackToken = new RegExp(`\\bxox${"[baprs]"}-[A-Za-z0-9-]{20,}\\b`);
const accessKey = /\bAKIA[0-9A-Z]{16}\b/;
const bearer = /Authorization\s*:\s*Bearer\s+\S+/i;
const discordLikeToken = /\b[A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27}\b/;
const networkUri = /\b(?:https?|wss?|postgres(?:ql)?|mysql|mariadb|mongodb(?:\+[a-z0-9]+)?|redis|sqlite|file):\/\/[^\s"'`<>]+/gi;
const connectionString = /\b(?:host|hostname|server|data\s*source|datasource)\s*=\s*[^\s;'"`]+(?:\s*;\s*(?:port|database|user(?:\s*id)?|password|sslmode)\s*=\s*[^\s;'"`]+)?/gi;
const privateHostSuffixes = ["local", "internal", "lan", "home", "corp", "private"];
const loopbackHostname = "local" + "host";
const privateHostname = new RegExp(`\\b(?:${loopbackHostname}|[a-z0-9][a-z0-9-]*\\.(?:${privateHostSuffixes.join("|")}))\\b`, "gi");
const ipv4 = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
const snowflake = /\b\d{17,20}\b/;
const secretPatterns = [privateKey, githubToken, githubFineGrained, slackToken, accessKey, bearer, discordLikeToken, ipv4, snowflake];
const forbiddenPath = /(^|\/)(?:\.env(?:\..*)?|.*\.(?:sqlite|sqlite3|db|log|secure))$/i;
const documentationPath = /(^|\/)(?:README|SKILL)\.md$/i;
const syntheticHost = /(?:^|\/\/)(?:[a-z0-9-]+\.)?example\.(?:invalid|test|com)(?:[/:?#]|$)/i;

function isSyntheticDocumentationValue(relativePath, value) {
  return documentationPath.test(relativePath) && syntheticHost.test(value);
}

function collectPatternFailures(relativePath, content, pattern, reason) {
  const failures = [];
  for (const match of content.matchAll(pattern)) {
    if (!isSyntheticDocumentationValue(relativePath, match[0])) {
      failures.push(`${relativePath}: ${reason}`);
    }
  }
  return failures;
}

export function scanContent(relativePath, content) {
  const failures = [];
  if (forbiddenPath.test(relativePath)) {
    return [`${relativePath}: forbidden public filename`];
  }
  if (secretPatterns.some((pattern) => pattern.test(content))) {
    failures.push(`${relativePath}: possible secret or account identifier`);
  }
  failures.push(...collectPatternFailures(relativePath, content, networkUri, "forbidden URI or endpoint"));
  failures.push(...collectPatternFailures(relativePath, content, connectionString, "forbidden connection string"));
  failures.push(...collectPatternFailures(relativePath, content, privateHostname, "private hostname"));
  return failures;
}

export function scanPublicFiles(root = process.cwd()) {
  const result = spawnSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    return ["Git file listing is unavailable"];
  }
  const failures = [];
  for (const relativePath of result.stdout.split(/\r?\n/).filter(Boolean)) {
    const absolutePath = resolve(root, relativePath);
    if (!existsSync(absolutePath)) continue;
    failures.push(...scanContent(relativePath, readFileSync(absolutePath, "utf8")));
  }
  return failures;
}

function main() {
  const failures = scanPublicFiles();
  if (failures.length > 0) {
    console.error("FAIL public-content");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log("PASS public-content: no forbidden public filenames, secret-like content, URIs, or private endpoints");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
