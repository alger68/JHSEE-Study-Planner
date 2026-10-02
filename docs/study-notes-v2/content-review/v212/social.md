# V2.1.2 社會科原創解答內容審查

查核日期：2026-10-02。範圍：114 學年度第二學期七年級社會科第二、三次段考。只新增本次指定的兩份題解及本審查記錄；未修改第一輪社會題解。

## 完成清單與計數

| 卷別 | 地理 | 歷史 | 公民 | 全部題目 | verified | disputed | limited |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 第 2 次 | 18 | 18 | 18 | 54 | 53 | 1 | 0 |
| 第 3 次 | 18 | 18 | 18 | 54 | 51 | 3 | 0 |
| 合計 | 36 | 36 | 36 | 108 | 104 | 4 | 0 |

- 兩卷均逐題涵蓋第 1–54 題，沒有另外編號的小題或非選題。每一題均有原創繁體中文推理（至少兩步）與常見誤解，沒有重刊整段題文、詩歌、報導或圖像。
- 每個官方答案均獨立保留在 `officialAnswer`，不因來源疑義而改寫。
- 所有新題目 ID 分別使用 `social-r2-`、`social-r3-` 前綴，已檢查與既有 `social.json` 及另一新卷沒有碰撞。
- 沒有不可讀頁面、缺漏圖表或仍需取得的媒體，因此沒有以 `limited` 代替爭議題。
- 新聞中的政策日期、補助條件、法規效果及個案敘述，僅作歷史試題的概念辨識；不將原卷敘述重新發布為查核日的政策、法律或即時新聞。

## 來源身分與頁碼

| 卷別 | atlas sourceId | SHA-256 | 實體頁數 |
| --- | --- | --- | ---: |
| 第 2 次 | `1rrQS-GBG9hbXxC9YrNdUMbrBfCFA68vU` | `ad3741e49bfa1e3d39fbbb4d27ff2ffdafbbf73cde213fa8378469595cf538b5` | 7 |
| 第 3 次 | `1-nBB_Jfvt8vdTap6V3VN1yua-vaPZQJ6` | `fe1ac8b9566a86e95f9ca24188eb1e41d2b1870c3cbfb391d90c58b0ce1f671b` | 7 |

- 第 2 次原始名稱：`114-2-2七年級社會科試題(公告).pdf`。
- 第 3 次原始名稱：`114-2七年級社會科試題(公告).pdf`。
- SHA-256 已對提供的兩份 PDF 實際計算，與 `atlas-sources.json` 完全一致。
- 所有 `answerPage` 均為實體 PDF 第 7 頁。第三卷第 7 頁上半部尚有第 52–54 題，答案在下半部；不能依頁尾「共六頁」誤認總頁數。

## 逐頁視讀紀錄

已透過 `view_image` 逐張檢視全部 14 張原卷渲染圖，並和抽取文字交叉核對，非僅使用 OCR 或文字擷取。

| 卷別／實體頁 | 視讀項目與題號 |
| --- | --- |
| r2 p1 | 第 1–9 題；三級產業圓餅圖、成本紋路圖例、臺灣洋流箭頭／a–d 位置、0／12／200 浬海域、等深線及 1–4 號位置。 |
| r2 p2 | 第 10–18 題；牛肉價格、加工區地圖、緯度與高差表、甲茶／乙稻／丙蔗分布。 |
| r2 p3 | 第 19–26 題；教育人數／比例表、日治人物事件及各選項。 |
| r2 p4 | 第 27–36 題；1935 年選舉材料、戒嚴臂章、民國 73–78 年報紙家數圖、民國 34–38 年米價漫畫。 |
| r2 p5 | 第 37–45 題；TFT 部門架構、陳情的畫線範圍、3–6 月甲乙丙支持度圖、媒體標題材料。 |
| r2 p6 | 第 46–54 題；煙火報導比例表（負面均為 0）、喜憨兒甲乙畫線、午餐與特色公園題組。 |
| r2 p7 | 第 1–54 題所有答案格；第 47 格確實印「B、D」。 |
| r3 p1 | 第 1–9 題及第 10 題前段；區域甲乙丙丁戊、185／115 與 60／20 人口圖、南竿與經緯線、國家公園位置、聚落比較表。 |
| r3 p2 | 第 10 題續文與選項、第 11–17 題；進出口表、平均每戶所得表、幸福巴士、四區就業圓餅圖。 |
| r3 p3 | 第 18–24 題；通勤車流及四個方向箭頭、一國兩制漫畫、交流利弊表、電影活動兩階段表。 |
| r3 p4 | 第 25–34 題與第 35–36 題材料甲；糖廠歌詞圖、護照比較表、經濟史時序、詩作情境、甲的口述。 |
| r3 p5 | 第 35–36 題材料乙丙及問句、第 37–43 題、第 44 題前段。 |
| r3 p6 | 第 44 題選項、第 45–51 題、第 52–54 題共用事故材料；1997–2017 幼老人口折線圖。 |
| r3 p7 | 第 52–54 題、53 雙底線急難關懷範圍、全部第 1–54 題答案。 |

## 爭議與解讀界線

| 題目 | 原卷官方答案 | 獨立核對結果 | 狀態處理 |
| --- | --- | --- | --- |
| r2 第 47 題 | `B、D` | 公民題區宣告單選，答案表卻明列雙答案。報導比例可引導檢查宣傳與監督兩種問題，不能由表格唯一選定其一。 | `disputed`；原樣保留 `B、D`，說明比例不能證明收費廣告、內容不實或政府必有弊端。 |
| r3 第 32 題 | `C` | 「開始設立科學工業園區」的具體年份是 1980／民國 69 年，落在 B 民國六十年代末；C 可作資訊產業擴張的概括階段，卻不能改變開始設園年份。 | `disputed`；分列確切事件日期與官方課程分期，沒有將 C 假造為成立日期。 |
| r3 第 34 題 | `D` | 開放探親發生於 1987 年，四選項沒有 1980 年代後期。D 是唯一晚於 1987 的選項，但「要到 1990 年代初期才緩解」不是精確政策起點。 | `disputed`；答案指出缺少精確選項，保留 D。 |
| r3 第 37 題 | `C` | 世襲的先賦地位分類正確；但題幹將今日日本天皇概括為享絕對統治權，與日本憲法第 1、4 條不符。 | `disputed`；C 保留並直接更正來源前提，防止把錯誤公民制度知識教給學生。 |

另有不阻礙概念選答、但須限制解讀的地方，均以 `note` 或步驟／pitfall 清楚處理：

- r2 第 7 題採原圖海域示意，不用圖作真實海域邊界判定；第 19 題區分國民學校改名與實質教育不平等，學生比例也不是就學率。
- r2 第 22 題區分材料未提供薪資證據與歷史上可能存在不平等待遇；第 29 題依發文者立場辨認歷史國籍公文，不延伸現行主權或個人國籍結論。
- r2 第 32 題區分 1987 解嚴與 1988 解報禁；第 38 題「涉嫌移送」不等於定罪；第 46 題 NCC 權限須依媒體類型及法律要件，並非所有媒體均可同樣裁罰。
- r2 第 40、48、50、54 題避免將來源的刑期／假釋、運動員資格、能源審查或交通日期當成更新後事實。
- r3 第 4 題的都市化／發展關係是概括推論，第 11 題出超不是利潤，第 12 題家庭所得不是個人月薪且表格不能單獨證明因果。
- r3 第 9 題環境比較是教材的一般型態，不將城鄉空氣品質作絕對判斷；第 15 題使用全區就業結構，不以新竹單城代替北部。
- r3 第 20、22、23、24、29 題分辨歷史分期、法規來源、漫畫立場及非邦交往來，不加入當代主權定論、軍事保證或現行免簽建議。
- r3 第 26 題小說的私人慰問金不是政府間美援款；第 36 題美國為題設主要勢力不等於韓戰聯合國軍只有一國。
- r3 第 39、40、44、46、49 題只解釋題設；未採認完整即時禁令、免費房屋條件、補助生效條件或國民年金已陷破產等未提供證據的敘述。
- r3 第 43 題為虛構借名情境，不當真實傳記或醫學結論；第 52 題只比較保險機制，未將責任險直接改稱社會保險，並排除「每年」涵蓋所有車種的錯誤概括；第 54 題區分個別能力評估與一律按年齡排除。

## 官方外部補充核對

以下用於釐清來源疑義或精確年代，不替換原卷官方答案；均在 2026-10-02 查閱。

| 對應題 | 官方或原始研究來源 | 核對用途 |
| --- | --- | --- |
| r2 12；r3 31 | [檔案管理局：設立加工出口區](https://art.archives.gov.tw/tw/art/1261.html)；[經濟部園區簡介](https://www.bip.gov.tw/page.aspx?pageid=8f9795d57955f5db) | 民國 55／1966 年設立加工出口區。 |
| r2 19 | [國家文化記憶庫：廳下小公學校也將改稱為國民學校](https://tcmb.culture.tw/zh-tw/detail?id=516701&indexCode=Culture_Object)；[中研院原始研究：日治末期臺灣的教育政策](https://www.ith.sinica.edu.tw/quarterly_download.php?filename=136659477112.pdf&name=04-1230%E8%A8%B1%E4%BD%A9%E8%B3%A2.pdf) | 1941 年國民學校改稱、1943 年義務教育；並未將改稱當成取消一切差別。 |
| r2 38 | [法務部：組織犯罪防制條例](https://mojlaw.moj.gov.tw/LawContent.aspx?LSID=FL001439) | 第 2 條犯罪組織要件；只作法律類型辨認。 |
| r2 45 | [總統府：憲法本文](https://www.president.gov.tw/Page/94) | 第 14 條集會與結社自由。 |
| r2 46 | [NCC 問答](https://www.ncc.gov.tw/chncc/app/artwebsite?id=353&module=artwebsite&serno=null) | Q4 說明平面、網路新聞的主管權責並非概括均由 NCC 管理；頁面以搜尋可見官方問答核對，直接開頁沒有可抽取文字。 |
| r3 22 | [AIT：Taiwan Relations Act](https://www.ait.org.tw/policy-history/taiwan-relations-act/) | 官方搜尋文字顯示防禦性武器及抵抗強制手段之條文；直接開頁為 403，未據此添加未讀取的法律細節。 |
| r3 31 | [檔案管理局：鐵路與軌道運輸](https://art.archives.gov.tw/tw/art/1135.html) | 民國 68／1979 年西部縱貫線電氣化完成。 |
| r3 31、32 | [經濟部產業園區管理局：新竹科學園區](https://land.bip.gov.tw/supply/Environ/More?id=322)；[竹科管理局二十週年專刊](https://www.sipa.gov.tw/home.jsp?contlink=content%2F20years_10.jsp&menudata=chinesemenu&mserno=201001210118&serno=201002250007) | 1980-12-15 首座園區設立；1979 年籌備處已成立，不能寫成民國七十年代才開始設園。 |
| r3 34 | [檔案管理局：開放探親](https://art.archives.gov.tw/tw/art/1608.html)；[海基會：開放交流二十年](https://www.sef.org.tw/article-1-15-1366) | 1987 年開放探親及 11 月 2 日受理登記。 |
| r3 37 | [日本眾議院公布：The Constitution of Japan](https://www.shugiin.go.jp/internet/itdb_english.nsf/html/statics/english/constitution_e.htm) | 第 1 條象徵地位、第 4 條沒有國政權能。 |
| r3 52 | [金管會：強制汽車責任保險保險期間](https://law.fsc.gov.tw/LawContent.aspx?id=GL003863) | 保險期間因車種不同；機車可一至二年，不能一律概括必須每年投保。 |

## 官方答案逐段轉錄

以下字串逐格對照兩份 PDF 第 7 頁，不以推理答案覆蓋。

### 第 2 次

- 1–18：`B A C B A C D A A C B B D A B B C C`
- 19–36：`A C B A C D B C D B B A A B D C B C`
- 37–54：`D D D B C C C A B B B、D A A D D C A B`

### 第 3 次

- 1–18：`C B C B D D A C D A A A B C C D D A`
- 19–36：`B C D C B B C B A A D D C C A D D A`
- 37–54：`C C B D A D A D A C C B B B D A B C`

## 逐題清單

`來源頁` 使用實體 PDF 頁碼；兩頁並列表示需連同前頁題組或下一頁續文／選項閱讀。每題答案頁均為 7。

### 第 2 次：54 題

| 題號 | item.id | 原創主題 | 來源頁 | 官方答案 | status |
| ---: | --- | --- | --- | --- | --- |
| 1 | `social-r2-geography-01` | 三級產業就業結構 | 1 | `B` | `verified` |
| 2 | `social-r2-geography-02` | 工業轉型與技術投入 | 1 | `A` | `verified` |
| 3 | `social-r2-geography-03` | 稻田輪作與集約經營 | 1 | `C` | `verified` |
| 4 | `social-r2-geography-04` | 作物需求與平原農業 | 1 | `B` | `verified` |
| 5 | `social-r2-geography-05` | 品質提升與單一作物經營 | 1 | `A` | `verified` |
| 6 | `social-r2-geography-06` | 原料成本與工業區位 | 1 | `C` | `verified` |
| 7 | `social-r2-geography-07` | 冬季洋流與經濟海域 | 1 | `D` | `verified` |
| 8 | `social-r2-geography-08` | 養殖漁業與地下水 | 1 | `A` | `verified` |
| 9 | `social-r2-geography-09` | 等深線與大陸棚 | 1 | `A` | `verified` |
| 10 | `social-r2-geography-10` | 乳源與加工廠區位 | 2 | `C` | `verified` |
| 11 | `social-r2-geography-11` | 土地限制與畜牧成本 | 2 | `B` | `verified` |
| 12 | `social-r2-geography-12` | 加工出口區的年代 | 2 | `B` | `verified` |
| 13 | `social-r2-geography-13` | 早期外銷工業的工作 | 2 | `D` | `verified` |
| 14 | `social-r2-geography-14` | 政策與交通吸引設廠 | 2 | `A` | `verified` |
| 15 | `social-r2-geography-15` | 緯度與垂直氣候帶 | 2 | `B` | `verified` |
| 16 | `social-r2-geography-16` | 茶葉分布與產業分類 | 2 | `B` | `verified` |
| 17 | `social-r2-geography-17` | 甘蔗與糖廠區位 | 2 | `C` | `verified` |
| 18 | `social-r2-geography-18` | 重工業的資本需求 | 2 | `C` | `verified` |
| 19 | `social-r2-history-19` | 日治末期教育制度 | 3 | `A` | `verified` |
| 20 | `social-r2-history-20` | 林獻堂活動的先後 | 3 | `C` | `verified` |
| 21 | `social-r2-history-21` | 服飾與殖民社會地位 | 3 | `B` | `verified` |
| 22 | `social-r2-history-22` | 工廠生產與時間紀律 | 3 | `A` | `verified` |
| 23 | `social-r2-history-23` | 文化協會的社會啟蒙 | 3 | `C` | `verified` |
| 24 | `social-r2-history-24` | 民報與權利倡議 | 3 | `D` | `verified` |
| 25 | `social-r2-history-25` | 日治政黨與勞工運動 | 3 | `B` | `verified` |
| 26 | `social-r2-history-26` | 戰後政黨發展辨識 | 3 | `C` | `verified` |
| 27 | `social-r2-history-27` | 1935 年地方選舉 | 4 | `D` | `verified` |
| 28 | `social-r2-history-28` | 戰時動員與政治空間 | 4 | `B` | `verified` |
| 29 | `social-r2-history-29` | 戰後公文與統治轉換 | 4 | `B` | `verified` |
| 30 | `social-r2-history-30` | 戰後初期行政體制 | 4 | `A` | `verified` |
| 31 | `social-r2-history-31` | 戒嚴體制的歷史背景 | 4 | `A` | `verified` |
| 32 | `social-r2-history-32` | 解嚴與報禁解除 | 4 | `B` | `verified` |
| 33 | `social-r2-history-33` | 戰後物價上漲的圖像 | 4 | `D` | `verified` |
| 34 | `social-r2-history-34` | 政治改革訴求與二二八 | 4 | `C` | `verified` |
| 35 | `social-r2-history-35` | 行政長官與二二八背景 | 4 | `B` | `verified` |
| 36 | `social-r2-history-36` | 威權統治與白色恐怖 | 4 | `C` | `verified` |
| 37 | `social-r2-civics-37` | 民間團體的部門分工 | 5 | `D` | `verified` |
| 38 | `social-r2-civics-38` | 犯罪組織與法律名稱 | 5 | `D` | `verified` |
| 39 | `social-r2-civics-39` | 公益團體推動公共政策 | 5 | `D` | `verified` |
| 40 | `social-r2-civics-40` | 自主倡議與結社特徵 | 5 | `B` | `verified` |
| 41 | `social-r2-civics-41` | 訊息查證與媒體識讀 | 5 | `C` | `verified` |
| 42 | `social-r2-civics-42` | 工會向主管機關陳情 | 5 | `C` | `verified` |
| 43 | `social-r2-civics-43` | 公共意見隨事件改變 | 5 | `C` | `verified` |
| 44 | `social-r2-civics-44` | 標題框架與媒體責任 | 5 | `A` | `verified` |
| 45 | `social-r2-civics-45` | 結社自由與民間組織 | 5 | `B` | `verified` |
| 46 | `social-r2-civics-46` | 報導速度與查證責任 | 6 | `B` | `verified` |
| 47 | `social-r2-civics-47` | 報導比例與媒體監督 | 6 | `B、D` | `disputed` |
| 48 | `social-r2-civics-48` | 議題進入公開討論 | 6 | `A` | `verified` |
| 49 | `social-r2-civics-49` | 民間成立與盈餘用途 | 6 | `A` | `verified` |
| 50 | `social-r2-civics-50` | 公共議題焦點的轉移 | 6 | `D` | `verified` |
| 51 | `social-r2-civics-51` | 透過團體表達公共意見 | 6 | `D` | `verified` |
| 52 | `social-r2-civics-52` | 不同團體的政策評價 | 6 | `C` | `verified` |
| 53 | `social-r2-civics-53` | 社群協作與公民倡議 | 6 | `A` | `verified` |
| 54 | `social-r2-civics-54` | 公共倡議影響設施規畫 | 6 | `B` | `verified` |

### 第 3 次：54 題

| 題號 | item.id | 原創主題 | 來源頁 | 官方答案 | status |
| ---: | --- | --- | --- | --- | --- |
| 1 | `social-r3-geography-01` | 澎湖地景與區域畫分 | 1 | `C` | `verified` |
| 2 | `social-r3-geography-02` | 中部地區的產業特色 | 1 | `B` | `verified` |
| 3 | `social-r3-geography-03` | 通勤時間與都市範圍 | 1 | `C` | `verified` |
| 4 | `social-r3-geography-04` | 都市化程度的分母 | 1 | `B` | `verified` |
| 5 | `social-r3-geography-05` | 環島運輸與區域差距 | 1 | `D` | `verified` |
| 6 | `social-r3-geography-06` | 馬祖位置辨識 | 1 | `D` | `verified` |
| 7 | `social-r3-geography-07` | 國家公園的火山地形 | 1 | `A` | `verified` |
| 8 | `social-r3-geography-08` | 沿海濕地與台江 | 1 | `C` | `verified` |
| 9 | `social-r3-geography-09` | 都市鄉村聚落比較 | 1 | `D` | `verified` |
| 10 | `social-r3-geography-10` | 鮮果跨國與末端配送 | 1, 2 | `A` | `verified` |
| 11 | `social-r3-geography-11` | 貿易出入超計算 | 2 | `A` | `verified` |
| 12 | `social-r3-geography-12` | 所得資料的區域比較 | 2 | `A` | `verified` |
| 13 | `social-r3-geography-13` | 偏鄉公共運輸的缺口 | 2 | `B` | `verified` |
| 14 | `social-r3-geography-14` | 公路運輸的機動性 | 2 | `C` | `verified` |
| 15 | `social-r3-geography-15` | 北部地區就業結構 | 2 | `C` | `verified` |
| 16 | `social-r3-geography-16` | 捷運與都市通勤 | 2 | `D` | `verified` |
| 17 | `social-r3-geography-17` | 海島型經濟的條件 | 2 | `D` | `verified` |
| 18 | `social-r3-geography-18` | 下班通勤的車流方向 | 3 | `A` | `verified` |
| 19 | `social-r3-history-19` | 海基會與兩岸民間事務 | 3 | `B` | `verified` |
| 20 | `social-r3-history-20` | 1971 年後的彈性外交 | 3 | `C` | `verified` |
| 21 | `social-r3-history-21` | 大三通與交流條件 | 3 | `D` | `verified` |
| 22 | `social-r3-history-22` | 臺灣關係法的背景與性質 | 3 | `C` | `verified` |
| 23 | `social-r3-history-23` | 政治漫畫中的一國兩制 | 3 | `B` | `verified` |
| 24 | `social-r3-history-24` | 影展轉型與兩岸交流 | 3 | `B` | `verified` |
| 25 | `social-r3-history-25` | 經濟國際化與國際組織 | 4 | `C` | `verified` |
| 26 | `social-r3-history-26` | 鄉土文學與城鄉勞動處境 | 4 | `B` | `verified` |
| 27 | `social-r3-history-27` | 解嚴與土地改革的年代 | 4 | `A` | `verified` |
| 28 | `social-r3-history-28` | 農業外銷支援工業 | 4 | `A` | `verified` |
| 29 | `social-r3-history-29` | 非邦交的實質國際往來 | 4 | `D` | `verified` |
| 30 | `social-r3-history-30` | 禁歌與思想文化管制 | 4 | `D` | `verified` |
| 31 | `social-r3-history-31` | 戰後經濟政策排序 | 4 | `C` | `verified` |
| 32 | `social-r3-history-32` | 竹科設立年份與產業分期 | 4 | `C` | `disputed` |
| 33 | `social-r3-history-33` | 十大建設的重化工業 | 4 | `A` | `verified` |
| 34 | `social-r3-history-34` | 隔海鄉愁與探親開放 | 4 | `D` | `disputed` |
| 35 | `social-r3-history-35` | 冷戰戰事與移民次序 | 4, 5 | `D` | `verified` |
| 36 | `social-r3-history-36` | 美國在冷戰東亞的角色 | 4, 5 | `A` | `verified` |
| 37 | `social-r3-civics-37` | 世襲地位與先賦地位 | 5 | `C` | `disputed` |
| 38 | `social-r3-civics-38` | 消除制度性歧視 | 5 | `C` | `verified` |
| 39 | `social-r3-civics-39` | 性別壓迫與自由限制 | 5 | `B` | `verified` |
| 40 | `social-r3-civics-40` | 鄉村人口外流與區域差距 | 5 | `D` | `verified` |
| 41 | `social-r3-civics-41` | 教育機會與身分限制 | 5 | `A` | `verified` |
| 42 | `social-r3-civics-42` | 資源不平等與社會流動 | 5 | `D` | `verified` |
| 43 | `social-r3-civics-43` | 無障礙環境與平等參與 | 5 | `A` | `verified` |
| 44 | `social-r3-civics-44` | 現金給付的福利分類 | 5, 6 | `D` | `verified` |
| 45 | `social-r3-civics-45` | 少子高齡化的政策回應 | 6 | `A` | `verified` |
| 46 | `social-r3-civics-46` | 社會保險的繳費責任 | 6 | `C` | `verified` |
| 47 | `social-r3-civics-47` | 托育與福利服務 | 6 | `C` | `verified` |
| 48 | `social-r3-civics-48` | 戒治與健康照護 | 6 | `B` | `verified` |
| 49 | `social-r3-civics-49` | 婚育家庭的居住支持 | 6 | `B` | `verified` |
| 50 | `social-r3-civics-50` | 種族歧視與參賽障礙 | 6 | `B` | `verified` |
| 51 | `social-r3-civics-51` | 制度肯定與社會認同 | 6 | `D` | `verified` |
| 52 | `social-r3-civics-52` | 強制保險與風險分擔 | 6, 7 | `A` | `verified` |
| 53 | `social-r3-civics-53` | 家庭急難與社會救助 | 6, 7 | `B` | `verified` |
| 54 | `social-r3-civics-54` | 年齡標籤與個別能力 | 6, 7 | `C` | `verified` |

## 驗證結果

2026-10-02 執行 Node 驗證，exit code 0：

- 使用實際 `exam-solutions.cjs.validatePaper`，對照解壓欄位後的 `atlas-sources.json`，兩份均通過。
- 核對 schema、標題、sourceId、hash、年級、輪次、科目、7 個實體頁碼與 checked 日期。
- 精確比較 54 個官方答案字串、54 個連續題號、18／18／18 分科數量。
- 精確比較每題來源頁陣列與答案頁；核對特別跨頁題及第 7 頁的題幹／答案混排。
- 兩份 PDF 實算 SHA-256 均與 atlas 相等。
- 新 item.id 前綴與格式逐項核對，並連同既有第一輪社會題解檢查跨卷唯一性。
- 狀態精確為 r2 53 verified／1 disputed／0 limited；r3 51 verified／3 disputed／0 limited，所有有爭議項目均有 note。
- 本子任務未修改共用程式、第一輪檔案或提交 commit；整體建置與發布由主代理負責。
