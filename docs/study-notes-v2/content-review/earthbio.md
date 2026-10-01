# earthbio 完成報告

- 完成：65/65 節，195 個觀念，195 道四選一原創題。
- 型別：地理32節、生物19節、九年級自然14節；全部為 topic-guide。
- 每節對應輸入 sectionId 與 title，沒有改動課程程式或 Git。

## 資料與內容界線

校方輸入提供的是課名與課程定位，不是出版社課文全文。本批依題名原創概念、例子與測驗，不宣稱逐字講解特定版本課本。人口、產量、流量、排放係數及多數數值案例皆明列為教學假設，沒有冒充現行統計。區域地理避免將整區或族群視為同質，也未加入即時戰爭、人口排名、國際組織成員數或現行法規細節。臺灣地名案例為假想研究，不捏造真實語源或族語讀音。

ABO、單基因與細胞分裂採明示模型；人類複雜性狀不硬套顯隱性，遺傳諮詢為資訊識讀而非個人診斷。傳統原核／原生分類另說明現代分群會修訂。能量傳遞10%只作題設，食安與防災採一般官方原則。

## 查閱來源

查閱日期：2026-10-01。NHGRI、NASA及中央氣象署的指定頁面已讀到正文；Georgia Tech與食藥署相關資訊讀到官方網站的檢索摘要。部分食藥署全文頁及UCMP舊頁擷取逾時，沒有將未讀到的全文當作查核成果，也未引用UCMP失敗頁。穩定基本原理以原創說明處理，sources為實際讀到並用於相應主題的補充來源。

- NASA Science — Causes：https://science.nasa.gov/climate-change/causes/
- NHGRI — Gene Environment Interaction：https://www.genome.gov/genetics-glossary/Gene-Environment-Interaction
- NHGRI — Mutation：https://www.genome.gov/genetics-glossary/Mutation
- NHGRI — Genetic Counseling：https://www.genome.gov/genetics-glossary/Genetic-Counseling
- Georgia Tech — Early Life on Earth & Prokaryotes: Bacteria & Archaea：https://organismalbio.biosci.gatech.edu/biodiversity/prokaryotes-bacteria-archaea-2/
- 中央氣象署 — 豪（大）雨特報：https://www.cwa.gov.tw/V8/C/P/Warning/W26.html
- 防災臺北 — 首頁防颱資訊：https://eoc.gov.taipei/
- 中央氣象署 — 聖嬰／反聖嬰：https://climate.cwa.gov.tw/ENSO?subpage=Intro
- 中央氣象署 — 地球發燒了！？—溫室氣體與全球暖化：https://edu.cwa.gov.tw/PopularScience/kids/wt/wt_3.html
- 食品藥物管理署 — 食品中毒常見問與答：https://www.fda.gov.tw/TC/sitecontent.aspx?sid=2572
- 衛生福利部 — 遵守五要原則，預防食品中毒：https://www.mohw.gov.tw/cp-3250-29716-1.html

## 自查

- JSON 可解析、65 個 sectionId 唯一且與輸入順序和標題完全一致。
- 每節恰3個觀念，每篇 body 至少40字；每節3題，concept索引0、1、2各有題。
- 每題正解及3個幹擾項皆非空、四選項互不重複；解析至少25字，195個題幹無完全重複。
- 使用繁體轉換後保留輸入標題原文；修正昆蟲與蜘蛛例句語病。
- 自查數值題的單位、模型和運算：比例尺、人口及地下水收支、能量傳遞、ABO機率、電功率耗能、效率、感應速率與排放量一致。
- 逐節檢視概念與題目對應，避免把相對位置等同座標、把有絲分裂當減數分裂、把海陸風當每日必然、把傳統文化視為停滯等誤解。

## 主代理整合事項

本批無阻塞。來源列表是補充查證，不是出版社全文授權；網站應繼續保留「原創導學」與各節 note。額外30節體育另存 earthbio-extra-output.json 與 earthbio-extra-report.md，不混入本65節。
