# Shared evidence contract

Use exactly one final status: `PASS`, `FAIL`, `BLOCKED`, or `PARTIAL`.

| Status | Meaning |
| --- | --- |
| `PASS` | Every required condition was actually checked and satisfied. |
| `FAIL` | A scoped check was actually run and did not satisfy its condition. |
| `BLOCKED` | Required authority, safe input, correlation, or verification is missing. Stop before a risky action. |
| `PARTIAL` | Some scoped observations are verified, but the required conclusion remains incomplete. |

Every report must contain only these safe fields:

```text
status: <PASS|FAIL|BLOCKED|PARTIAL>
scope: <sanitized subsystem and intended outcome>
checks: <actual checks and their bounded results>
observations: <sanitized facts, not raw artifacts>
limitations: <what was not verified and why>
next_action: <smallest safe, authorized action>
```

Do not include secrets, credentials, real endpoints, user or account IDs,
raw logs, screenshots, database contents, or formal production evidence.
Never infer `PASS` from a simulation, connectivity signal, prior evidence, or
an uncorrelated reply. Preserve uncertainty in `BLOCKED` or `PARTIAL`.
