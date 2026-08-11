---
name: recover-nyanko-dirty-worktree
description: 安全盤點與復原 Nyanko 專案的 dirty Git worktree。當需要處理未提交變更、來源不明檔案、衝突風險或回滾判定時使用；保留資料並在來源或授權不明時 fail closed。
---

# Nyanko dirty worktree 復原

先閱讀 [evidence contract](references/evidence-contract.md)。此 skill 的第一步永遠是保全，不是清理。

## 流程

1. 唯讀取得 repository root、branch、HEAD、工作樹、暫存區、未追蹤檔與可用回滾點。
2. 以路徑、變更類型與已知任務關聯分類；回報時只描述非敏感摘要，不要貼出可能含秘密的 diff 或 log。
3. 若變更來源、擁有者、敏感性或目標不明，回報 `BLOCKED`。不要猜測它們是否可刪除或可提交。
4. 僅在使用者明確選擇且目標位置安全時，提出可回復的下一步，例如建立隔離副本或由原擁有者核對。先列出預期影響，再要求核可。
5. 重新以唯讀方式確認保全結果；沒有完整來源對照時只能回報 `PARTIAL`，不可宣稱乾淨或已復原。

## 不可跨越的限制

- 不要自動執行 `git reset`、`git clean`、`git stash`、覆寫、刪除或自動提交。
- 不要將未追蹤檔視為垃圾，也不要因為工作樹不乾淨而略過 Git 基線。
- 不要將 token、登入資料、真實主機、帳號 ID、資料庫、原始 log 或截圖寫入 evidence。

輸出 contract 摘要與一個需要使用者或原擁有者選擇的最小後續動作。
