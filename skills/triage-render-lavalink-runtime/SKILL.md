---
name: triage-render-lavalink-runtime
description: 分類並 fail-closed 排查 Render 與 Lavalink 的 runtime、連線、授權和播放驗收問題。當服務未啟動、voice/WSS 連線不穩、Lavalink 回應異常或需要判定真實播放時使用。
---

# Render 與 Lavalink runtime 排查

先閱讀 [evidence contract](references/evidence-contract.md)。只處理已授權、已遮罩的診斷資料。

## 排查順序

1. 確認可檢查的範圍與資料來源；缺少授權、遮罩後的設定摘要或可辨識的失敗階段時，回報 `BLOCKED`。
2. 將每一筆現象分類為歷史 build failure 或 current live deployment。歷史失敗只可解釋當時失敗原因，不能推翻或替代新部署後的 live 驗收；current 結論必須來自重啟後的新觀察。
3. 將問題分類為啟動、設定、授權、網路、voice gateway、Lavalink protocol、來源解析、播放管線或客戶端輸出。不要把不同階段混成同一故障。
4. 對 YouTube source 僅允許 `TVHTML5_SIMPLY`。不要加入替代 client 或需要登入的 fallback；不要使用主 Google 帳號、OAuth、poToken、cookie、token、visitorData 或 refreshToken。
5. `AllClientsFailedException` 或 `requires login` 是來源存取失敗：保留遮罩後的分類、停止重送，並回報 `FAIL` 或 `BLOCKED`。不要以 OAuth、poToken、cookie 或其他帳號資料繞過。
6. 先驗證最窄的前置條件，再記錄實際觀察到的結果與限制。服務可達、WSS handshake、`loadtracks` 或 URL parse 最多證明連線或解析；它們都不等於播放。
7. 僅在已核可的受控操作中驗證真實播放。五個相異的受控測試輸入必須各自具有 actual `TrackStart`、可安全關聯的「正在播放」回覆、客戶端媒體輸出與操作人員確認；缺少其中任何一項，該輸入不可標記為播放 `PASS`。
8. 將重現不穩、資料不足或只驗到部分階段的結果標記為 `PARTIAL` 或 `BLOCKED`；實際已執行而失敗的檢查標記為 `FAIL`。

## 控制驗收與 blocker

將 queue、pause、resume、skip、stop 視為五個獨立的時間序列：每一項都需要已核可命令、可關聯回覆、預期 state transition 與操作人員確認。不要把已完成的播放 gate 延伸成 controls `PASS`。

控制驗收因 automation、Computer Use 核可或登入逾時而未執行時，在主專案的 `question.md` 新增以下遮罩格式後停止：

```text
status: BLOCKED
scope: <sanitized control acceptance>
attempted: <sanitized action and time order>
blocker: <approval, login, or automation timeout>
impact: <which control outcomes remain unverified>
required_authority: <smallest approval or operator action>
next_action: <one safe retry after authorization>
```

不要放入正式環境位置、帳號、guild、URL、secret、原始 log 或影片識別值。

## 安全限制

- 不要記錄或要求 token、登入資料、真實主機、帳號 ID、原始 runtime log、截圖、影片識別值或 production evidence。
- 不要把 WSS、ping、mock、simulator 或單元測試冒充為真實音訊播放。
- 不要因未知 response 重送命令；先停止、保留遮罩後的狀態摘要，並要求可安全關聯的識別資訊。

交付一份 contract 摘要，包含故障分類、已驗證邊界與下一個最窄的安全檢查。
