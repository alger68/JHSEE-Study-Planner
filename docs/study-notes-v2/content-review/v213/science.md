# V2.1.3 理化／自然歷史段考內容審核

審核日期：2026-10-03。範圍為八年級三份理化卷、九年級兩份自然卷；共 220 個原卷編號題，每題均有原創繁體中文兩步以上推理、易錯提醒、官方答案轉錄、PDF 實體頁及核對狀態。未重製完整題目、閱讀文章或整份試卷。這是指定五份歷史段考的題本覆蓋，不代表所有教材或課程已完成。

## 原檔與完整性

透過 Google Drive 原檔 metadata → fetch raw PDF → download 取得檔案。下列 SHA-256 直接計算原始 PDF 位元組，頁數以 `pdfinfo` 核對；兩者均與 source atlas 相同。`pdftotext -layout` 用於定位，`pdftoppm -scale-to 1600 -jpeg` 產生每個實體頁供人工目視；需要辨認細線、極性及磁場時另放大原頁。頁碼一律按 PDF 實體順序，不沿用題紙可能把解答頁排除的印刷頁數。

| 資料鍵 | Drive 原檔 ID | 原檔名 | 實體頁數 | SHA-256 |
| --- | --- | --- | ---: | --- |
| physical-8-r1 | `1I0GmSDOe_TyHFVivtQZpCBhSuQ94tFxy` | 114-2-1八年級理化科試題(公告).pdf | 5 | `f7103a3eff3067617b36d4c6296e92cc95073490ccc552366445c29f16fb5142` |
| physical-8-r2 | `11pbFThEcQkfUMRHrNxW2cfRMsLOQAO6k` | 114-2-2八年級理化科試題(公告).pdf | 6 | `430490c6f5141bdd62a4949e746613ff47ad1a25bc8c5ae9677ed27434875b4e` |
| physical-8-r3 | `1KTvqzTeca7LQxUJ51MGfCfuIZBbpFdbc` | 114-2-3 八年級理化科(公告).pdf | 7 | `e8e303fe14b4dd28dde5449dbbb9499a09c619c5a9b5d5395fbc471631e7e69b` |
| science-9-r1 | `1D1ZhbmzzuvkZ3UjID_F82WCjuf0SKkKg` | 114-2-1九年級理化科(公告).pdf | 6 | `29cef30538eb648a9cdac0bbdb88587460ad9c6dd24cc46511acdc5e9bcd4f20` |
| science-9-r2 | `1_F1cLTaFQsdt5kOiS3dGb5DSnPV590bP` | 114-2-2九年級理化科(公告).pdf | 5 | `3bea88a137919fdad58255d672e6f6d02c9eb04751aee46ab869c039f7e16ee5` |

## 先由原卷建立的題號清冊

以下清冊依原卷標題、連續題號和計分區間建立，再與輸出 JSON 比對；不是把 JSON 的項目數當成完整性證據。五卷均沒有需另拆的編號子題。

| 卷別 | 原卷分節／計分區間 | 獨立清點 | 實體題頁 | 答案來源頁 |
| --- | --- | ---: | --- | --- |
| physical-8-r1 | 單一選擇 1–45 | 45 | p1：1–16；p2：17–25；p3：26–37；p4：38–45 | p5 可見解答 |
| physical-8-r2 | 單一選擇；1–38 每題 2 分、39–46 每題 3 分 | 38＋8＝46 | p1：1–9；p2：10–22；p3：23–31；p4：32–40；p5：41–46 | p6 可見解答 |
| physical-8-r3 | 一、單選 1–38；二、閱讀 39–45；單選內 1–10 每題 3 分、11–38 每題 2 分 | 38＋7＝45 | p1：1–11；p2：12–18；p3：19–26；p4：27–34；p5：35–39；p6：40–45 | p7 可見解答 |
| science-9-r1 | 原卷連續單選 1–48；導覽另分 1–16、圖表題組 17–42、閱讀 43–48 | 16＋26＋6＝48 | p1：1–11；p2：12–18；p3：19–23；p4：24–33；p5：34–42；p6：43–48 | 各題同頁的白色文字層；沒有獨立可見解答頁 |
| science-9-r2 | 單一選擇；計分區間 1–14、15–22、23–36 | 14＋8＋14＝36 | p1：1–9；p2：10–19；p3：20–28；p4：29–36 | p5 可見解答 |

跨頁題源另記：physical-8-r2 第 41、42 題的共同骨牌圖與設定在 p4，問題在 p5，故 `sourcePages: [4,5]`；physical-8-r3 第 40、41 題共用 p5 的香料閱讀，問題在 p6，故 `[5,6]`；science-9-r1 第 19 題要使用 p2 的家電標籤與 p3 的插座，故 `[2,3]`。其餘均依上表題號所在的實體頁。

## 另外轉錄的官方答案鍵

以下由可見解答頁獨立轉錄；唯一例外 science-9-r1 的來源邊界另述。逗號分隔同題多答案，不拆成兩題。完成後另以逐項比較確認 220 個 `officialAnswer` 相同、題號連續且無遺漏。

### physical-8-r1（p5）

| 題號 | 依序答案 |
| --- | --- |
| 1–10 | C B A B A A D D D D |
| 11–20 | B D C C B B B **A、C、D** D B |
| 21–30 | C B C C D D B C D B |
| 31–40 | B D D D A B D D C D |
| 41–45 | A D B B A |

### physical-8-r2（p6）

| 題號 | 依序答案 |
| --- | --- |
| 1–10 | A D D C B C D C D D |
| 11–20 | C A D C D B D C B C |
| 21–30 | D D A D B B B C A B |
| 31–40 | D B C B D B C **B、C** C C |
| 41–46 | D C D A B A |

### physical-8-r3（p7）

| 題號 | 依序答案 |
| --- | --- |
| 1–10 | A A B B D C C C A A |
| 11–20 | A C B B A D B C A C |
| 21–30 | A A A C B C D C C C |
| 31–40 | A D D B C A D B B D |
| 41–45 | D B B C A |

### science-9-r1（原檔白色文字）

| 題號 | 依序答案 |
| --- | --- |
| 1–10 | D C D B C D C A C A |
| 11–20 | C B A B D B A C D C |
| 21–30 | B C D C D C A A A D |
| 31–40 | A D A B B D B B B A |
| 41–48 | A A A D D C B B |

這份六頁原 PDF 的題目括號內含有 48 個白色單字母答案。以原始 PDF 的文字 span 檢查，答案顏色均為十進位 `16777215`（`#FFFFFF`）；渲染白底圖片時括號看來空白。各實體頁的單字母白色 span 數依次為 **11、7、5、10、9、6**，合計 48，依題序分別為：

| 實體頁 | 白色答案序列 |
| --- | --- |
| 1 | D C D B C D C A C A C |
| 2 | B A B D B A C |
| 3 | D C B C D |
| 4 | C D C A A A D A D A |
| 5 | B B D B B B A A A |
| 6 | A D D C B B |

接受這些字元作為 `officialAnswer` 的理由僅是：它們確實存在於 SHA-256 完全相符的原始 PDF，位置對應各題括號，並非 OCR 猜測或另找網路答案。然而，**原檔中有資料不等於官方已可見地發布答案鍵**。沒有獨立的可見答案頁，無法從該 PDF 確認這些白色字元的發布意圖。故 `coverageNote` 明述此限制，全部 48 題 `note` 都說明「白色文字可得、畫面未顯示、沒有獨立可見解答頁」；`answerPage` 只指含該字元的原始題頁。47 題即使獨立科學推理相符，仍為 `limited`；第 16 題因交流電量問題另為 `disputed`，同時保留白色答案來源限制。沒有宣稱已找到另張可見的官方解答，也沒有為了全數 `verified` 而忽略這個邊界。

### science-9-r2（p5）

| 題號 | 依序答案 |
| --- | --- |
| 1–10 | C A D C A D D B B A |
| 11–20 | C C B C A A B B A D |
| 21–30 | D B D C A C B D C D |
| 31–36 | A B B C B D |

## 29 頁逐頁目視紀錄

每頁均以渲染圖查看整頁，並對照文字定位。下列記錄具體影響解題的版面或圖形，不以「已看圖」代替檢查內容。

| 卷別／實體頁 | 目視核對重點 |
| --- | --- |
| physical-8-r1 p1 | 混合沉澱裝置仍封閉；氮氣／臭氧天平用分子數換質量；兩蠟燭的開放系統；第 13 題 MnO₂ 在反應式兩側。 |
| physical-8-r1 p2 | 牛奶營養標示每 234 mL 含鈣 234 mg；黑白分子模型為黑二、白二、黑一白二；質量下降曲線及各選項反應。 |
| physical-8-r1 p3 | 氣調保存四組氣體曲線；第 30 題活性表互逆格均為叉；第 34 題 W、X、Y、Z 表格方向；鎂在 CO₂ 中燃燒圖。 |
| physical-8-r1 p4 | 銀針與硫化物閱讀、置換選項與觸媒反應，並核對 38–45 連續題號。 |
| physical-8-r1 p5 | 可見官方鍵 1–45；第 18 題明列 A、C、D，不自行改成 C。 |
| physical-8-r2 p1 | 稀釋圖 C 為酸加入水並攪拌；鎂與酸的氣球實驗；濃度及配製體積。 |
| physical-8-r2 p2 | 離子表正負電中性；滴定表樣品體積 200、300、400、500 mL 及耗鹼 40、69、72、110 mL。 |
| physical-8-r2 p3 | 指示劑顏色、酸雨歷年圖的 28 年區間、四杯無色液體識別表。 |
| physical-8-r2 p4 | 連續稀釋甲酸乙稀酸丙水；第 38 題甲向正極、乙向負極與 4：8 個數；第 39、40 題錯誤反應係數；骨牌共同圖在頁底。 |
| physical-8-r2 p5 | 骨牌第 41、42 題；硫混濁表 25、35、45、55°C 對應 50、40、20、5 秒；第 44 題 A 圖的下降曲線及凹凸；NO₂/N₂O₄ 條件選項。 |
| physical-8-r2 p6 | 可見官方鍵 1–46；第 38 題明列 B、C。 |
| physical-8-r3 p1 | 第 1 題 A 為未交聯長鏈；力、摩擦、單位各選項與 1–11 題完整。 |
| physical-8-r3 p2 | PET、POM、PP 在 50／70°C 圖，沒有玻璃對照；甘油三羥基；有機物分類圖甲小分子、乙天然聚合物、丙熱塑、丁熱固。 |
| physical-8-r3 p3 | 黑白分子為 CH₄、C₃H₈；甲醚／乙醇連結方式；酯化圖產物位於上層；漂浮題數值。 |
| physical-8-r3 p4 | 肥皂甲親水端乙碳鏈；彈簧表每增加 50 gw 伸長 3 cm；兩種氣壓裝置的同水平面；木塊左右力。 |
| physical-8-r3 p5 | 摩擦圖 AB 靜摩擦、CD 動摩擦；鉛球沒入兩液體但重力不變；香料共用閱讀及第 39 題。 |
| physical-8-r3 p6 | 40、41 題承前頁閱讀；液壓圖面積 A、2A 及 2、8 cm²；第 44 題文字以 kgw 誤稱壓力。 |
| physical-8-r3 p7 | 可見官方鍵 1–45，逐列轉錄。 |
| science-9-r1 p1 | AC 過零波形；電路旁路 A 燈；鍍銅銅正極／鑰匙負極；電解水氣量 2：1；圖中括號均無可見答案。 |
| science-9-r1 p2 | 甲銅正、乙銅負、丙石墨正、丁石墨負；冰箱每年 408 kWh；熱水壺 1000 W、電扇 95 W、暖風機及火鍋各 1200 W；音響 AC110／DC9 標示。 |
| science-9-r1 p3 | 插座 A 220 V、B 110 V 接地、C 110 V 無接地；銅銀電池 B 銀 C 銅與串接電解槽；五個氣體／電鍍裝置標示。 |
| science-9-r1 p4 | 製氣／電解圖續題；順向坡 A 岩層與地表同向右下；洋流 A 夏季、B 冬季；34 題前的連續題號定位。 |
| science-9-r1 p5 | 等壓線甲 H、乙 L、丙 H；臺北相對 A 壓力；眼與眼牆；鋒面 A 滯留、B 冷、C 暖。 |
| science-9-r1 p6 | 油電混合閱讀與六題；歷史溫室氣體表 CO₂ 350 ppm，分清每莫耳效能及濃度；整份無獨立可見答案頁。 |
| science-9-r2 p1 | 甲颱風、乙冷鋒、丙太平洋高壓、丁滯留鋒；2004 敏督利路徑；X 1044 高壓、Y 1008 低壓。 |
| science-9-r2 p2 | 放大圖三確認檢流計左負右正；第 13 題文字甲正乙負，圖四卻乙正甲負；鍍銅圖紅黑線與鑰匙位置；串聯燈泡；第 19 題電流、羅盤在導線上下位置。 |
| science-9-r2 p3 | 導線與下向磁場互垂；電鈴接點；地磁偶極模型；換向器／電刷；螺線管左 S 右 N；相對運動丁 2v。 |
| science-9-r2 p4 | 放大三組馬達電池與磁鐵極性，甲／丙同向；磁棒 B、C 為 S、D 為 N、釘 E 為 N；P 磁力線密、Q 切線 x；磁鐵切割、發電機、檢流計反向 B、互感。 |
| science-9-r2 p5 | 可見官方鍵 1–36，逐列轉錄。 |

## 計算與方向的獨立複核

用原題數值另做有理數算術，以下結果不由答案字母反推。方向題從原圖極性和向量重新判讀。

| 卷別／題號 | 計算或推導結果 |
| --- | --- |
| physical-8-r1 3、11 | C₂H₄O₂ 的 C/H/O 比為 24/60、4/60、32/60；1 mol N₂ 28 g，0.5 mol O₃ 24 g。 |
| physical-8-r1 16、18、21 | X＝(28＋6)/2＝17，原 A＝27×28/6＋12＝138 g；鈣差額 (1200−2×234)/1000/40＝0.0183 mol；產物 2×(14＋2×16)＝92 g。 |
| physical-8-r2 4、5、14 | 稀釋總體積 40 mL，加水 30 mL；NaOH＝0.4×0.5×40＝8 g；電中性 1＋2×2＝5。 |
| physical-8-r2 19、38 | 四組耗鹼／樣品比 0.20、0.23、0.18、0.22；最高為 B，僅證明可滴定酸度。甲陰 4 個、乙陽 8 個，須 |z甲|＝2|z乙|，不是 CaCl₂ 的陰：陽比。 |
| physical-8-r2 39、40 | 正確分子式係數 2K₂CrO₄＋H₂SO₄⇌K₂Cr₂O₇＋H₂O＋K₂SO₄，各元素 K4、Cr2、H2、S1、O12 守恆。原式 H₂SO₄ 前的 2 不守恆。 |
| physical-8-r3 16 | CO₂ 換得 C 4 mol、48 g；水換得 H 8 mol、8 g；原物氧 32 g＝2 mol，C:H:O＝4:8:2。 |
| physical-8-r3 25、26 | 木塊排液 12 cm³，液體密度 10/12，120 cm³ 液重 100 g；鐵塊 78 g，高密度液排液 78/11.7＝20/3 cm³，與水中 10 cm³ 比 3:2。 |
| physical-8-r3 29、31、33 | 兩彈簧斜率均 3/50 cm/gw，原長 17、16.5 cm；摩擦向右 1 kgw；杯底 10 cm²、半杯酒 180 g＝200 cm³、全杯 400 cm³。 |
| physical-8-r3 35、36、44 | (2.5−1)V＝300，V＝200 cm³、重 500 gw；μₛ＝20/10＝2，牆面所需 N≥10/2＝5 kgw；液壓輸出 10/2×8＝40 kgw。 |
| science-9-r1 5、6 | 12 V／6 Ω＝2 A、24 W，一小時 7200 C／86400 J；月 150 小時 3.6 kWh、10.8 元。三個電器各算 1 kWh。 |
| science-9-r1 15、16、18 | 408 kWh＝1,468,800,000 J；E/110＝146,880,000/11 C 只是固定電壓的等效算法，不能當交流實際電量；水吸熱 300000 J×0.24＝72000 cal，20＋72＝92°C。 |
| science-9-r1 48 | 題表乘積 350、51、49.6、5.46、6；僅在該歷史簡化比較中 CO₂ 最高。 |
| science-9-r2 15、18 | 電費換成 864/3.6＝240 kWh，2 kW 用 120 小時，平均每日 4 小時；1 L 水升 90°C 需 378000 J，除 420 W 得 900 s＝15 分鐘。 |
| science-9-r2 19 | 取東 x、北 y、上 z。乙向東電流／針在下方：x×(−z)＝y；丁向西／針在上方：(−x)×z＝y，均增強向北地磁，故不偏轉。甲向北／下方與丙向南／上方均得向西，兩者不是反向。 |
| science-9-r2 22、23、29 | 正電荷向下速度與向北場的叉積向東，電子反向向西；向南速度與向北場反平行，磁力零；馬達電流和磁場同時反轉，轉矩不變，甲、丙同向。 |

## 狀態及具體問題

| 卷別 | 總數 | verified | disputed | limited |
| --- | ---: | ---: | ---: | ---: |
| physical-8-r1 | 45 | 40 | 5 | 0 |
| physical-8-r2 | 46 | 39 | 4 | 3 |
| physical-8-r3 | 45 | 40 | 4 | 1 |
| science-9-r1 | 48 | 0 | 1 | 47 |
| science-9-r2 | 36 | 35 | 1 | 0 |
| 合計 | 220 | 154 | 15 | 51 |

`disputed` 不一定表示答案字母須改；也用於官方預期答案仍能解釋、但完整題幹包含科學錯誤或不能成立的唯一性。`limited` 用於可給出受條件約束的推理，卻缺乏來源或條件以完成全部驗證。每題保留原鍵而另列獨立結論。

| 題號 | 狀態 | 問題與處理 |
| --- | --- | --- |
| physical-8-r1 13 | disputed | 官方 C 將催化劑列於反應式兩側判錯；等量催化劑可消去，淨式仍守恆。區分課程的箭頭標記慣例與化學錯誤。 |
| physical-8-r1 18 | disputed | 官方接受 A、C、D；實算鈣差額 0.0183 mol 最接近 C，A、D 則超過所缺量。保留官方多鍵。 |
| physical-8-r1 28 | disputed | 官方 C 的 SO₂ 漂白可成立，但 B 的次氯酸鈉用於飲用水消毒也有 EPA 原始指引支持，單選不唯一。 |
| physical-8-r1 30 | disputed | B＋DO₂、D＋BO 都不反應，無法在題用的嚴格活性全序中自洽；不能只擷取部分表格來支持唯一錯項 B。 |
| physical-8-r1 39 | disputed | C 的砷解釋錯誤，但 A 稱硫化物必被還原也不成立；H₂S 中 S 已為 −2，轉為 Ag₂S 未必改變。 |
| physical-8-r2 10 | disputed | 官方 D 錯；A 卻把吸水潮解寫成遇 CO₂ 潮解，混淆吸水與碳酸化，亦非嚴格正確。 |
| physical-8-r2 19 | limited | 滴定的總酸量不能在未給酸種、解離度及緩衝成分時唯一決定初始 pH。保留 B 並限定為可滴定酸度最高。 |
| physical-8-r2 38 | disputed | 官方 B、C；圖的方向／數目符合 H₂SO₄ 簡化離子比，卻與「鹽類」用詞不符，CaCl₂ 的陰：陽數比則相反。 |
| physical-8-r2 39、40 | disputed | 同一鉻酸鹽／重鉻酸鹽反應多寫 H₂SO₄ 係數，物質不守恆；用正確式解釋，官方 C 均保留。 |
| physical-8-r2 44 | limited | 數據支持反應時間隨溫度升高下降，不能唯一證實圖 A 的精確曲率或函數形式。 |
| physical-8-r2 45 | limited | 加熱使 NO₂ 比例提高；壓縮後則先因濃度立即變深，隨後才有平衡變化。原題未定觀測時點及光程，不能無條件排除所有壓縮選項。 |
| physical-8-r3 12 | limited | 圖僅測三種塑膠，未測玻璃；PP 變化較小也不能直接等同長期相容性或食品安全證據。 |
| physical-8-r3 27 | disputed | D 為課程預期，但「合成清潔劑較不易生物分解」不能概括不同分子結構的所有合成界面活性劑。 |
| physical-8-r3 39 | disputed | B 的非聚合物分類成立；原閱讀將不同鄰苯二甲酸酯危害混作一類，C 的健康效應不能單憑酯類名稱推定。 |
| physical-8-r3 41 | disputed | 官方 D 保留；閱讀的天然香精較安全概括沒有充分根據。限定可支持的化學與過敏說明，不沿用未具體查核的醫療因果。 |
| physical-8-r3 44 | disputed | 正確是液壓等量傳遞壓力增量、依面積放大輸出力；題文稱「放大壓力」，又用 kgw 作壓力單位。計算仍得 C，40 kgw。 |
| science-9-r1 1–15、17–48 | limited | 47 題科學推理獨立核對，但答案只在原 PDF 白色文字層，無可見發布確認；逐題註明同一來源限制。 |
| science-9-r1 16 | disputed | 住家 110 V 為交流有效值，年度能量除有效電壓不能唯一得到有向或累積的實際電量；另保留白色鍵的發布限制。 |
| science-9-r2 13 | disputed | 題文甲正乙負，圖四卻乙正甲負，故官方 B 可成立之餘，依文字 A 的乙產氫也成立。 |

另在相應題目註記題設模型：燈絲電阻近似固定、理想電熱換算、液壓與浮力忽略損失、國中以亞硫酸表示 SO₂ 水溶液、歷史 CO₂ 350 ppm 不代表現況、按莫耳的題表效能不當成現行按質量定義的 GWP、混合動力模式因車型而異。這些註記沒有把可解的課程近似一律誤判成錯題。

## 用於釐清疑義的第一方資料

針對不確定或容易誤教的科學／健康敘述，查官方機構或原始專業教育資料，不以題庫轉載的答案代替推理。以下資料只支持所列界限；沒有把歷史教材敘述擴張為今日的醫療或工程建議。

- IUPAC Gold Book，Catalyst：<https://goldbook.iupac.org/terms/view/C00876>。官方檢索摘要的定義說明催化劑既參與反應又被再生，用於 physical-8-r1 13 的書寫邊界；直接頁面受存取限制，未宣稱完整讀取其受阻頁面。
- US EPA，Alternative Disinfectants and Oxidants Guidance Manual：<https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=2000229L.TXT>。讀取飲用水消毒中 sodium hypochlorite 的應用，用於 physical-8-r1 28。
- Canadian Conservation Institute，Understanding how silver objects tarnish：<https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/metal-objects/understanding-silver-tarnish.html>。銀與含硫氣體形成硫化物的說明，用於 physical-8-r1 39；氧化數結論另由化學式推導。
- Royal Society of Chemistry，The effect of pressure and temperature on equilibrium／Le Chatelier's principle：<https://edu.rsc.org/experiments/the-effect-of-pressure-and-temperature-on-equilibrium-le-chateliers-principle/1739.article>。公開檢索內容明述壓縮 NO₂／N₂O₄ 後先深後淺的觀察，用於 physical-8-r2 45 的時間限制；直接抓取正文受阻，沒有宣稱完整讀過無法取得的頁面。
- US EPA，Safer Choice Criteria for Surfactants：<https://www.epa.gov/saferchoice/safer-choice-criteria-surfactants>。不同結構的生物分解與水生毒性差異，用於 physical-8-r3 27。
- US FDA，Phthalates in Cosmetics：<https://www.fda.gov/cosmetics/cosmetic-ingredients/phthalates-cosmetics>；Fragrances in Cosmetics：<https://www.fda.gov/cosmetics/cosmetic-ingredients/fragrances-cosmetics>。DEP 的特定評估、香料個別過敏及植物來源仍須安全評估，用於 physical-8-r3 39、41，不據此宣稱所有酯類安全或有害。
- NOAA，What is ocean acidification?：<https://oceanservice.noaa.gov/facts/acidification.html>。CO₂ 吸收、酸化與碳酸根供應的機制，用於 science-9-r2 8、10。
- 國科會科技大觀園，董東璟、蔡政翰（國立臺灣海洋大學），黑潮相關專文，《科學發展》471 期（2012）：<https://scitechvista.nat.gov.tw/Article/C000008/detail?ID=faa9833a-88ca-46a3-a6d4-f68855aef006>。臺灣東側北向黑潮及可達約 1000 m 的深度，用於 science-9-r2 9；不把舊文能源開發進度當現況。

## 最終資料驗證

以專案 `source-atlas.cjs.load().exams` 的標準來源物件呼叫 `exam-solutions.cjs.validatePaper`，五份均通過來源 ID、標題、SHA、實體頁範圍、分節、唯一題號、兩步以上推理、官方鍵及狀態註記檢查。另以獨立轉錄鍵比對 220 個官方答案，清冊數與所有連續標籤完全相符。舊有受 Git 追蹤的 15 份解析逐位元組與 `HEAD` 比較一致。本工作只新增以上五份 JSON 及本審核檔，沒有修改已發布解析或固定練習題。前端與全站發布驗證由整合工作另行記錄。
