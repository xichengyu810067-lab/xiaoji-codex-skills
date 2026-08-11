---
name: triage-render-lavalink-runtime
description: 分類並 fail-closed 排查 Render 與 Lavalink 的 runtime、連線、授權和播放驗收問題。當服務未啟動、voice/WSS 連線不穩、Lavalink 回應異常或需要判定真實播放時使用。
---

# Render 與 Lavalink runtime 排查

先閱讀 [evidence contract](references/evidence-contract.md)。只處理已授權、已遮罩的診斷資料。

## 排查順序

1. 確認可檢查的範圍與資料來源；缺少授權、遮罩後的設定摘要或可辨識的失敗階段時，回報 `BLOCKED`。
2. 將問題分類為啟動、設定、授權、網路、voice gateway、Lavalink protocol、播放管線或客戶端輸出。不要把不同階段混成同一故障。
3. 先驗證最窄的前置條件，再記錄實際觀察到的結果與限制。服務可達或 WSS handshake 成功，最多證明控制平面或連線條件。
4. 僅在已核可的受控操作中驗證真實播放：需有客戶端媒體輸出與操作人員確認。沒有這兩項，絕不可標記為播放 `PASS`。
5. 將重現不穩、資料不足或只驗到部分階段的結果標記為 `PARTIAL` 或 `BLOCKED`；實際已執行而失敗的檢查標記為 `FAIL`。

## 安全限制

- 不要記錄或要求 token、登入資料、真實主機、帳號 ID、原始 runtime log、截圖或 production evidence。
- 不要把 WSS、ping、mock、simulator 或單元測試冒充為真實音訊播放。
- 不要因未知 response 重送命令；先停止、保留遮罩後的狀態摘要，並要求可安全關聯的識別資訊。

交付一份 contract 摘要，包含故障分類、已驗證邊界與下一個最窄的安全檢查。
