---
name: release-protected-main
description: 安全準備並判定受保護 main 分支的發佈。當任務涉及 protected main、必要 CI、PR 合併、分支保護或發佈核可時使用；要求可追溯 evidence，並在權限、保護規則或檢查無法驗證時 fail closed。
---

# 受保護 main 發佈

先閱讀 [evidence contract](references/evidence-contract.md)，所有結論均使用其中的狀態和欄位。

## 流程

1. 確認 repository、目標分支、發佈範圍與授權者。任一項不明確，回報 `BLOCKED`。
2. 唯讀確認工作樹、暫存區與待合併差異。若存在來源不明或未核可變更，停止並回報 `BLOCKED`；可建議使用 `$recover-nyanko-dirty-worktree`，但不得自行修復。
3. 唯讀確認 main 的保護規則、必要檢查與 PR 狀態。無法取得規則或檢查來源時，回報 `BLOCKED`，不得以推測補足。
4. 確認變更已經由受保護分支外的核可 PR 進入合併流程。不得直接 push 至 main、強推、暫時關閉保護，或要求管理者繞過保護。
5. 逐項記錄實際執行的檢查與結果。只有必要檢查、保護要求與授權合併都可驗證時才可回報 `PASS`；尚未完成完整核可時使用 `PARTIAL`。

## 禁止動作

- 不要執行 `reset`、`clean`、`stash`、歷史重寫或自動合併。
- 不要將未驗證的 CI 摘要、截圖或口頭訊息升級為 `PASS`。
- 不要在 evidence 中放入 token、登入資料、真實主機、帳號 ID、原始 log 或正式 production 證據。

交付時提供一份依 contract 的最小摘要，清楚分離已驗證、未驗證與下一位授權者需要執行的動作。
