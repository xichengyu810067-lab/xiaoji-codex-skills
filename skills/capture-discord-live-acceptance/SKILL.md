---
name: capture-discord-live-acceptance
description: 在受控 Discord live 場景中安全擷取 acceptance evidence。當需要核對命令、bot 回覆、voice 行為或真人驗收時使用；未知回覆、未授權資料或未證實播放一律 fail closed。
---

# Discord live acceptance 擷取

先閱讀 [evidence contract](references/evidence-contract.md)。這個 skill 不會保存正式 evidence；它只產生可安全分享的摘要。

## 流程

1. 確認測試範圍、操作人員、受控頻道、預期單一行為與停止條件。缺少任一項時回報 `BLOCKED`。
2. 在每次操作前建立不含真實 ID 的本地操作標籤與預期結果；不要收集 token、登入資料、真實主機、帳號 ID、原始訊息、log 或截圖。
3. 執行一次已核可的操作，等待可安全關聯的回覆。回覆未知、重複、逾時或歧義時停止並回報 `BLOCKED` 或 `PARTIAL`；不得重送命令。
4. 分別驗證 command acknowledgement、voice state 與客戶端媒體輸出。WSS 或 mock 成功不是 live acceptance，也不是播放證據。
5. 只有預期行為、可關聯回覆與真人確認都實際完成時才回報 `PASS`；已執行但不符預期是 `FAIL`。

## 交付

輸出 contract 摘要、各階段的實際結果與安全下一步。不要把模擬測試、連線成功或未關聯回覆描述為 live acceptance。
