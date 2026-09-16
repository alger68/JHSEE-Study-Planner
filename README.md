# JHSEE Study Planner

國中會考智慧讀書計畫：把模考診斷、每日學習任務、弱點分析、錯題間隔複習與每週趨勢整理成一套可每天執行的讀書流程。

## 專案邊界

本專案只負責 **Study Planner**，不包含完整會考模擬引擎，也不包含英文遊戲化闖關。

- `JHSEE-Study-Planner`：讀書計畫、弱點追蹤、錯題複習與進度分析。
- `JHSEE-All-Subjects`：全科模擬考與正式作答流程，與本專案分離。
- `JHSEE-English-Adventure`：英文遊戲化闖關，與本專案分離。

三個專案不共用 router、UI shell、考試 session 或 LocalStorage key。若未來需要交換練習結果，只使用明確的 JSON 匯入／匯出格式。

## 資料隔離

本專案所有瀏覽器資料只使用以下 namespace：

```text
jhseePlanner.v1.*
```

禁止直接讀寫 `jhsee.v1.*` 或其他 JHSEE 專案的既有 key。

目前支援的資料交換 schema：

```text
jhsee-study-planner/v1
jhsee-practice-summary/v1
```

## V1 功能

- 五科模考診斷：A++／A+／A／B++／B+／B／C。
- 規則式科目 priority，僅用於讀書時間分配，不等同官方會考等級。
- 每日 20～180 分鐘自適應讀書計畫。
- 弱科優先，同時避免強科長期完全停止複習。
- 錯題 `+1 / +3 / +7 / +14 / +30` 間隔複習。
- Topic 至少累積 5 題後才正式判斷弱點。
- 每週 Mini Check 與至少兩週後的趨勢分析。
- 英文 Diagnose → Stabilize → Mixed → Timed → Maintain 學習路線。
- JSON 備份、還原與外部練習摘要匯入。

## 本機開發

```bash
npm install
npm test
python3 -m http.server 8000
```

瀏覽 `http://localhost:8000/`。

## GitHub Pages

`.github/workflows/pages.yml` 會先執行測試，再建立只含 `index.html`、`css/`、`js/` 與必要 assets 的 Pages artifact。部署只在 `main` 分支執行；功能分支與 Pull Request 只執行測試與建置驗證。

所有前端資源均使用相對路徑，以支援 `/JHSEE-Study-Planner/` 這類 GitHub Pages 專案子路徑。
