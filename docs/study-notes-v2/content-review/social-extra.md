# 社會與輔導補充主題交付報告

完成 social-extra-input.json 的 10 個教學主題：輔導 6、童軍 4，共 30 個實質觀念、30 道原創四選一題。資料檔為 social-extra-output.json，與原 84 節資料分開保存。

## 課程定位與內容界線

已讀 sources/115-1-7-scouts.txt、sources/115-1-8-guidance.txt、sources/114-2-7-scouts.txt 的相關教學主題段落。這些資料是校方課程計畫文字擷取，並非出版社課文全文。全數使用 topic-guide；主題序號由本站整理，不宣稱是課本原課號，PDF 頁碼仍未知，不自行補造頁碼。每筆 note 均保留此界線。

攜手童行涵蓋小隊分工、觀察紀錄和資訊協作；地圖搜查線涵蓋方位／網格、比例尺與安全路線。情緒三主題分別著重辨認、日記紀錄、調整與求助，沒有把自我評分當診斷。生涯兩主題區分線索與家人期待整合，以及生涯故事、支持資源、未來想像查證；故事明示為虛構，不捏造名人傳記。

點燃服務之光保留校方 ORID 討論與需求評估方向，但校方所提火箭爐文獻全文未提供，因此不重建其內容，亦不提供生火或製作操作。有愛世界聚焦可執行服務計畫、能力界線與實際效果，維護受服務者意願與隱私。

## 查證與安全

比例尺概念參考 USGS 官方資料庫說明；情緒紀錄與求助條件參考 NIMH 官方說明，情緒調整參考 WHO 官方介紹與現行壓力問答。WHO 圖文手冊引用的是官方介紹頁，未宣稱已讀完整手冊。各頁僅支援相關基礎概念，場景、題目、數字和表達皆為原創。

校園定向不以最短距離取代現場封閉與帶隊安排；不鼓勵攀越或離開活動範圍。學生服務不代管金融密碼或交易；遇到超出能力的需求轉向適當成人或專業協助。情緒練習不保證療效，持續影響生活或安全時鼓勵及時取得支持。

## 自查結果

JSON 解析、10 個 sectionId/title 一一完全對應、3 觀念／3 題、整數 concept 0–2 覆蓋、全部必填文字、4 個互異選項均通過。每個觀念 body 至少 40 字、每題解析至少 25 字；全批及與原批合計 282 道題無完全重複題幹，282 個觀念正文亦無完全重複。

已逐題檢查唯一正解及條件完整，修正簡體混字，保留 ID 與課程標題原文。觀察題三種類別、4＋2＋1＝7 件；地圖網格 B2 向東再向北得到 C3；比例尺題 3.5 公分×2000＝7000 公分＝70 公尺，題目限定未縮放地圖與水平直線距離。

最終另呼叫 repository 的 catalog-completion.cjs validateRow 逐筆檢查。主代理可直接整合；PDF 版面頁碼尚待定位，但不阻擋以教學主題形式呈現。

## 實際查閱來源

- [校方課程計畫：115-1-7-scouts（已讀提供的文字擷取）](https://drive.google.com/file/d/1ULj2NDWMhDTc4vvYyIl3AkW5TaqNjfXm/view)
- [美國地質調查局：National Geologic Map Database—Map Scale 說明](https://ngmdb.usgs.gov/ngmdb/ngmdb_help_comp.html)
- [校方課程計畫：115-1-8-guidance（已讀提供的文字擷取）](https://drive.google.com/file/d/1BhZ-gP4R5NX7rGK3vQlJttEpZmwTmVWE/view)
- [美國國家心理衛生研究院：I’m So Stressed Out! Fact Sheet](https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet)
- [世界衛生組織：Doing What Matters in Times of Stress（官方介紹）](https://www.who.int/thailand/news/feature-stories/detail/doing-what-matters-in-times-of-stress)
- [世界衛生組織：Stress（2026年3月30日問答）](https://www.who.int/news-room/questions-and-answers/item/stress)
- [校方課程計畫：114-2-7-scouts（已讀提供的文字擷取）](https://drive.google.com/file/d/1X6aY6XyWbgZUh3pw0Ck4dZ8N6AGUfQ6C/view)
