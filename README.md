# xiaoji-codex-skills

Four fail-closed Codex skills for protected-main releases, dirty-worktree
recovery, Lavalink runtime triage, and Discord live-acceptance capture.

Each skill is self-contained: `SKILL.md`, `agents/openai.yaml`, and only its
needed one-level `references/` material. The repository scripts enforce the
shared `PASS` / `FAIL` / `BLOCKED` / `PARTIAL` evidence contract, structural
boundaries, and public-content secret checks.

## Local checks

```powershell
npm ci
npm test
npm run validate
npm run check:public
```

The skills deliberately fail closed: they never reset, clean, stash, bypass
branch protection, push directly to protected `main`, replay an unknown reply,
or treat WSS/simulated checks as evidence of real audio playback.
