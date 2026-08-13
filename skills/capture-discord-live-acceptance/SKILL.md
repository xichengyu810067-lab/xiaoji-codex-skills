---
name: capture-discord-live-acceptance
description: 在受控 Discord live 場景中安全擷取 acceptance evidence。當需要核對命令、bot 回覆、voice 行為或真人驗收時使用；未知回覆、未授權資料或未證實播放一律 fail closed。
---

# Discord live acceptance 擷取

先閱讀 [evidence contract](references/evidence-contract.md)。這個 skill 不會保存正式 evidence；它只產生可安全分享的摘要。

## 流程

1. 確認測試範圍、操作人員、受控頻道、預期單一行為與停止條件。缺少任一項時回報 `BLOCKED`。
2. 在每次操作前建立不含真實 ID 的本地操作標籤與預期結果；不要收集 token、登入資料、真實主機、帳號 ID、原始訊息、log 或截圖。
3. 對 YouTube playback，先確認執行設定只允許 `TVHTML5_SIMPLY`。不要使用主 Google 帳號、OAuth、poToken、cookie、token、visitorData 或 refreshToken，也不要把登入需求當作可繞過的設定問題。
4. 對五個相異的受控測試輸入逐一執行一次已核可的操作。每一項播放 gate 都必須具備 actual `TrackStart`、可安全關聯的「已開始播放」與「正在播放」回覆、voice state、客戶端媒體輸出及操作人員確認；只可在五項各自完成時回報五項播放 `PASS`。
5. `loadtracks`、URL parse、WSS、mock 或 simulator 成功不是 live acceptance，也不是播放證據。`AllClientsFailedException` 或 `requires login` 是該項 `FAIL` 或 `BLOCKED`，不得以 OAuth、poToken、cookie 或任何帳號資料重試。
6. 回覆未知、重複、逾時或歧義時停止並回報 `BLOCKED` 或 `PARTIAL`；不得重送命令。

## 控制 timeline

queue、pause、resume、skip、stop 各自需要一條獨立時間序列：命令、可關聯 acknowledgement、預期 voice/player state transition、操作人員確認。播放五項已通過不代表 controls 已通過；未執行的控制項必須維持 `BLOCKED` 或 `PARTIAL`。

若 Discord Chrome automation 或 Computer Use 核可／登入逾時阻擋控制驗收，在主專案 `question.md` 使用以下格式，之後跳過，不要要求睡眠中的使用者立即處理：

```text
status: BLOCKED
scope: <sanitized control acceptance>
attempted: <sanitized action and time order>
blocker: <approval, login, or automation timeout>
impact: <which control outcomes remain unverified>
required_authority: <smallest approval or operator action>
next_action: <one safe retry after authorization>
```

不要記錄正式環境位置、帳號、guild、URL、secret、原始訊息、log、截圖或影片識別值。

## 交付

輸出 contract 摘要、各階段的實際結果與安全下一步。不要把歷史 build failure、模擬測試、連線成功或未關聯回覆描述為 current live acceptance。
