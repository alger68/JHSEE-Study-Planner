# health 新增內容審查 — v2.1.0

審查日期：2026-10-02。結論：完成全部新增內容的逐列人工審查與一手來源核對，可交由主流程進行整合驗證。

## 範圍與覆蓋

- 審查 `assets/study-notes/v120/modules/all-subjects-content/health.json` 的全部 76 筆教學情境、152 個教學步驟與 228 題新增題。逐題檢視題幹、正答、三個干擾選項、解析及概念對應。
- 對照輸入的 76 個單元、概念 ID 與原有題數。49 筆為體育、27 筆為健康教育；每筆原有 3 題、新增 3 題，合計每單元 6 題、全科 456 題。
- 體育涵蓋體適能、籃球、羽球、桌球、排球、運動計畫各 6 筆，游泳 5 筆、接力 4 筆、拔河 2 筆，田徑與樂樂棒球各 1 筆。游泳接力另按課堂公告流程審查，沒有把課堂安排寫成正式游泳競賽規則。
- 健康教育涵蓋菸、酒、檳榔、物質使用、傳染病、用藥、健保、食物來源及食品安全、慢性疾病、中風、急救、性健康與同意、性傳染病、人際及家庭關係、人體、視力口腔、青春期及營養。
- 在 41 筆含醫療、安全或正式規則重點的資料加入 45 個不同的一手來源網址。來源用於相關概念核對，不表示整段原創情境或所有干擾選項都出自該資料。

## 本次修正

| 單元 ID | 修正 |
| --- | --- |
| `catalog-1c75f2ec6c8bc9f6`、`catalog-7839bcb2857e91fd`、`catalog-29efdd17977d555e`、`catalog-08fa5bc6b0dabe2d`、`catalog-118b0e92959cb76a`、`catalog-5eefe6a40f4d5dbf` | 將殘留的「必须、比较、没有、人数、只补上」改為繁體；「沒有」涉及兩處。 |
| `catalog-0c647409cb0adf3a` | 「冒然」改為「貿然」。 |
| `catalog-6b081fff1a51b07b` | 反覆暈眩題明確要求停止活動、告知師長並尋求醫護評估；不把時間上的先後直接當成病因。 |
| `catalog-0dd1a3d9cbc47c5f` | 投籃題以「輔助手／投籃手」取代容易混淆的「非持球手／主手」。 |
| `catalog-cd4e5bd1010e4294` | 入水題正答明寫等待教師入水指示，不能把救生員在場理解為已獲准自行下水。 |
| `catalog-62f28d8da00291a0` | 一般回球解析補明可以先觸球網組件，核心限制是不能先落在己方臺面，避免把「直接」誤讀成碰網必定違規。 |
| `catalog-9fada22dd887dd8f`、`catalog-933f55bd2ea28156` | 水中出現不適時，明寫立即向現場人員示意求助、在協助下安全停止練習，避免把「停止」理解成無人協助下突然停止所有動作。 |
| `catalog-8bc4e0fa66cfefc0` | 尼古丁題改寫「暫停使用時想再使用」，消除「不用含尼古丁產品」可能造成的語意歧義。 |
| `catalog-c29a5ee3aec191fe` | 原新增 c2 題在問漏服處理，與 c2「商品不同也可能重複」不直接對應；改為相同有效成分且自行錯開十分鐘的併用判斷，不提供補服或劑量指示。 |
| `catalog-a344dbec2b272c13` | 題幹補上呼喚及輕拍後仍無反應，使解析不再引入題幹未給的條件；AED 不建議電擊時，明寫依語音及 119 指導立即繼續 CPR。 |
| `catalog-3db3adc68e759c07` | 暴露後無症狀題明寫儘速詢問醫療人員，評估檢驗與適合處理，避免誤讀為先等待症狀。 |
| `catalog-6efcfa6f9cbdebf5` | 「牙痛前幾天才刷牙」改為「牙痛時才刷牙」；正答及解析同時區分規律預防與已出現牙痛時的牙醫評估。 |

除來源欄外，共修正 33 個文字欄位；不增刪單元或題目，不改原有 `unitId` 與概念 ID。

## 事實、規則與安全核對

| 主題 | 核對結果 |
| --- | --- |
| 排球 | FIVB 2025–2028 第 9.1、14.4.1 條：三擊為上限，合法攔網觸球不計入；第 7.6.2 條：接發球隊取得發球權時輪轉；第 12.4.3 條：站立發球看擊球瞬間腳位，跳躍發球另看起跳時刻。現有題幹已限定站立發球，沒有混用時刻。 |
| 桌球 | ITTF Statutes 2026 第 2.6.3、2.6.4、2.7.1 條：發球先落己方再落接球方、不得以身體遮球；一般回球與發球的落臺順序不同，可觸網組件後到對場。 |
| 拔河 | 已讀 TWIF 官方 2025 手冊第 11–13 條，核對不得打結、纏繞鎖繩及後位的專門持繩規範。教學維持一般隊員的安全原則，不教授自行纏繞身體；2026 手冊的檢索限制見下。 |
| 水域 | CDC 與 Red Cross 支持持續監督、泳池能力不能保證開放水域安全、岸上呼救與非受訓者不自行下水接觸救援。CDC 原始監測報告支持拒絕過度換氣與憋氣競賽；浮板沒有被寫成救生保證。 |
| 菸酒檳榔與物質使用 | CDC 支持尼古丁成癮及電子煙氣霧非無害水氣；NIAAA 支持酒精對判斷與協調的影響；WHO／IARC 支持檳榔子本身致癌。呼吸異常維持立即緊急求助，不由外包裝、氣味或試吃推斷物質。 |
| 傳染病 | 台灣疾管署核對登革熱容器刷洗與肺結核的空氣傳播；CDC 核對 A 型肝炎糞口途徑。沒有用外觀或咳嗽直接診斷，也沒有因共用杯子管理而忽略空氣途徑。 |
| 用藥、慢性疾病及健保 | 食藥署支持成分重複風險及個別用藥評估；NIDDK、WHO 支持血糖調節、腎臟與膀胱功能、多因素慢性疾病及降低風險不等於零風險。健保內容只涉及互助、轉診資訊及本人身分，沒有新增費率、給付、罰鍰或資格規則。 |
| 中風與急救 | 國健署 FAST 資料支持突發臉部、手臂或語言異常應記錄時間並撥 119；消防署與 Red Cross 核對無反應及不正常呼吸、AED 分析／電擊不接觸患者、不建議電擊仍須繼續 CPR。出血題明限無嵌入物且有校護指導，不延後大量或不止出血的求援。 |
| 性健康與性傳染病 | WHO 支持性健康的多面向及免於強迫；CDC 與 WHO 核對 HIV 不由一般共餐傳播、部分感染可無症狀、HPV 疫苗具有特定預防範圍。同意可改變、隱私與求助題未新增法律年齡門檻。 |
| 食品及營養 | WHO 五要點、USDA 與 FDA 支持生熟分開、連續溫控、再熱非萬用補救及過敏原判讀；農業部履歷查詢核對追溯與實品資訊；回收品名、容量、批號全部明標虛構。國健署核對地瓜屬全穀雜糧，計算題均依題示份量換算。 |
| 人體、牙齒、眼睛及青春期 | NIH 核對消化／吸收及肺與循環合作、牙菌斑產酸與頻率、含氟及牙縫清潔；國健署支持近距離用眼間隔；NICHD、NHS 支持青春期差異、夢遺及影響日常生活的生理期不適應評估。未加入自行診斷或治療劑量。 |

全題以題示條件判讀唯一正答；沒有發現第二個可成立的選項。數學情境另核算了時間相加、分鐘轉秒、步幅乘步頻、有效次數、比率分母及糖量份數。例如 35+40+36+39+9=159 秒，4.5 分鐘=270 秒，9/12=75%、14/20=70%，300/150×5=10 公克。

## 來源與適用範圍限制

- 一手來源以國際運動總會、台灣政府部門、WHO、CDC、NIH、FDA、USDA、NHS 及 Red Cross 為主。未以商業文章或搜尋摘要中的第三方評論訂正醫療或技術主張。
- TWIF 官方索引已列 2026 年 8 月手冊，但該 PDF 抓取回傳 429／不可存取，受限執行環境也無法另行讀取。本次只標示實際讀到的 **2025** 官方手冊，不宣稱已核對 2026 拔河競賽全文；兩筆內容限一般安全教學，校內實作仍按教師與場地指示。
- 國健署運動不適來源是疫情期間的衛教文章；只引用「暈眩等不適時停止活動」這項安全原則，沒有採用當年的口罩或防疫規定。
- 國外來源只用於所列基本生理、預防或急救概念，不把國外電話、疫苗時程、癌篩年齡或法規移入題目。緊急電話情境使用台灣的 119。
- 輸入快照中 `catalog-09c4b6ba4c205ef5` 原有 c3 標題為「呼吸與迴圈合作」；本次新增文字使用「循環」。原有內容不在本次兩檔修改範圍，已回報整合者另行核對。

## 驗證紀錄

Python 標準函式庫直接解析輸入與輸出，逐列檢查：

- 76 個 ID 與輸入集合完全相同且唯一；原題數 228、新增題數 228。
- 每筆新增題數嚴格等於 `6 - original.quiz.length`。
- teaching 欄位完整，概念 ID 有效；全部為 2 個步驟，符合 2–4 個的規定。
- 每題有 1 個正答及 3 個干擾選項，四選項經 Unicode 正規化後仍互異。
- 所有文字非空，解析最短 50 字；228 題難度均為「應用」，符合允許值。
- 新題幹彼此無完全重複，與同單元原題幹也無完全重複。
- 每個來源只有 `title` 與 `url`，均為非空標題及 HTTPS URL。
- 全文人工校讀，另掃描常見簡體字及被指出的「积、个、说、断、题、应、项」；輸出無殘留。

本次不執行整站建置、整合測試、提交或發佈；整合驗證由主流程進行。

## 逐單元覆蓋表

所有列均已人工閱覽；表中的來源編號對應文末一手資料。沒有外部來源編號的列是課堂技能、資料比較或一般溝通情境，仍已檢查題意與選項。

| 單元 ID | 主題 | 新增題 | 來源 |
| --- | --- | ---: | --- |
| `catalog-24f5fdb31fd1ffdf` | 體適能 | 3 | H01 |
| `catalog-ef1d9a26d911b028` | 籃球 | 3 | — |
| `catalog-f241a94ac7b6039e` | 羽球 | 3 | — |
| `catalog-0c647409cb0adf3a` | 游泳 | 3 | H02、H03 |
| `catalog-7e042d8c9e92be86` | 桌球 | 3 | — |
| `catalog-1c75f2ec6c8bc9f6` | 排球 | 3 | H04 |
| `catalog-6b081fff1a51b07b` | 運動計畫 | 3 | H05 |
| `catalog-7d06fbaa92bd6848` | 桌球 | 3 | — |
| `catalog-dd736205ce5dfcc8` | 排球 | 3 | H04 |
| `catalog-6a81991f9f7e5bf0` | 運動計畫 | 3 | — |
| `catalog-7839bcb2857e91fd` | 體適能 | 3 | — |
| `catalog-0aac69d090d61259` | 籃球 | 3 | — |
| `catalog-69bb0dc7200eac2d` | 羽球 | 3 | — |
| `catalog-1c6d2652214ae2c2` | 游泳 | 3 | H02、H03 |
| `catalog-20092914be707ae6` | 桌球 | 3 | — |
| `catalog-2b366851b862d274` | 排球 | 3 | H04 |
| `catalog-ca3ff7af2a3803a9` | 拔河 | 3 | H06 |
| `catalog-d3ed882da3a0319a` | 接力 | 3 | H02 |
| `catalog-19b7777594cf7e6e` | 運動計畫 | 3 | — |
| `catalog-043252e7dd2b642c` | 體適能 | 3 | — |
| `catalog-0dd1a3d9cbc47c5f` | 籃球 | 3 | — |
| `catalog-e2638a372028578a` | 羽球 | 3 | — |
| `catalog-cd4e5bd1010e4294` | 游泳 | 3 | H02、H07 |
| `catalog-12a59149579880bc` | 田徑 | 3 | — |
| `catalog-62f28d8da00291a0` | 桌球 | 3 | H08 |
| `catalog-1c1cdd2b78087912` | 排球 | 3 | — |
| `catalog-805602fb258fb653` | 樂樂棒球 | 3 | — |
| `catalog-27cb8c9f75ffa69f` | 接力 | 3 | — |
| `catalog-4b397a14693b6207` | 運動計畫 | 3 | — |
| `catalog-a48c62a6251b8b85` | 體適能 | 3 | — |
| `catalog-9e9ab721391830bf` | 籃球 | 3 | — |
| `catalog-0709ad56a685958c` | 羽球 | 3 | — |
| `catalog-eb8c2ba87d63b384` | 桌球 | 3 | H08 |
| `catalog-40707be0a6685377` | 排球 | 3 | H04 |
| `catalog-9c42e522e25f593b` | 拔河 | 3 | H06 |
| `catalog-29efdd17977d555e` | 接力 | 3 | — |
| `catalog-5805670c8ecd339c` | 運動計畫 | 3 | — |
| `catalog-a53f388180be09c4` | 體適能 | 3 | — |
| `catalog-08fa5bc6b0dabe2d` | 籃球 | 3 | — |
| `catalog-5a3396137e8c7338` | 羽球 | 3 | — |
| `catalog-9fada22dd887dd8f` | 游泳 | 3 | H02 |
| `catalog-1e2ff43aeae09e8c` | 桌球 | 3 | — |
| `catalog-7081a887593e65a2` | 排球 | 3 | H04 |
| `catalog-100ae410378db1a8` | 接力 | 3 | — |
| `catalog-c83091c270be32bc` | 運動計畫 | 3 | — |
| `catalog-118b0e92959cb76a` | 體適能 | 3 | — |
| `catalog-9281b87fa743ee36` | 籃球 | 3 | — |
| `catalog-f9db75998d7172d3` | 羽球 | 3 | — |
| `catalog-933f55bd2ea28156` | 游泳 | 3 | H02、H03 |
| `catalog-8bc4e0fa66cfefc0` | 拒菸我最行 | 3 | H09、H10 |
| `catalog-c04570deb57b3c86` | 酒、檳榔的世界 | 3 | H11、H12 |
| `catalog-acf72a5efb21f368` | 無毒人生 | 3 | H13、H14 |
| `catalog-8aa8a3df7f94a4e7` | 新興傳染病 | 3 | H15 |
| `catalog-85386be12d3323c3` | 常見傳染病放大鏡 | 3 | H16、H17、H18 |
| `catalog-c29a5ee3aec191fe` | 用藥安全 | 3 | H19 |
| `catalog-8b2f531351e0ec19` | 我愛健保 | 3 | H20、H21 |
| `catalog-5eefe6a40f4d5dbf` | 飲食源頭探索趣 | 3 | H22、H15 |
| `catalog-8ccd1d0500791368` | 安全衛生飲食樂 | 3 | H15 |
| `catalog-425438bbfde3145f` | 食品安全行動派 | 3 | H23 |
| `catalog-d6d87eb613f5653e` | 健康人生，少「糖」少「癌」 | 3 | H24、H25 |
| `catalog-0ebff06d8aeb60af` | 小心謹「腎」，「慢」不經「心」 | 3 | H26、H27、H19 |
| `catalog-f30f4e9638984207` | 「漫」「慢」長路不孤單 | 3 | H28 |
| `catalog-1943521e1e927584` | 安全百分百 | 3 | H29 |
| `catalog-a344dbec2b272c13` | 急救一瞬間 | 3 | H14、H30 |
| `catalog-faa327cbd3e990ae` | 揭開「性」的真實面紗 | 3 | H31 |
| `catalog-bac297fff8c2a651` | 真愛要等待 | 3 | H31、H32 |
| `catalog-3db3adc68e759c07` | 性病知多少 | 3 | H33、H34、H35 |
| `catalog-7a4876d721df9257` | 拉近彼此距離 | 3 | — |
| `catalog-913d37e2c2d7ed67` | 和諧的家人關係 | 3 | H32 |
| `catalog-a901b66ca47d7ca7` | 全能健康王 | 3 | — |
| `catalog-09c4b6ba4c205ef5` | 人體奇航 | 3 | H36、H37 |
| `catalog-6efcfa6f9cbdebf5` | 愛眼護齒保健康 | 3 | H38、H39 |
| `catalog-fd144ee973d21e55` | 這一站，青春 | 3 | H40、H41、H42 |
| `catalog-005715a264e5dd20` | 青春誰人知 | 3 | — |
| `catalog-395737625139bfed` | 吃出好「食」力 | 3 | H43 |
| `catalog-06505a9372757fe2` | 「食」在安心 | 3 | H15、H44、H45 |

## 一手來源索引

以下網址於 2026-10-02 經官方頁面、官方 PDF 或官方網頁索引內容核對；用途及版本限制如上。

- H01：[ CDC：How to Measure Physical Activity Intensity ](https://www.cdc.gov/physical-activity-basics/measuring/index.html)
- H02：[ CDC：Preventing Drowning ](https://www.cdc.gov/drowning/prevention/index.html)
- H03：[ American Red Cross：Water Safety ](https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/water-safety.html)
- H04：[ FIVB：Official Volleyball Rules 2025–2028（7.6.2、9.1、12.4.3、14.4.1） ](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf)
- H05：[ 國民健康署：降級不降警；戶外運動戴口罩的5大重點（不適時停止活動） ](https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=4306&pid=14355)
- H06：[ TWIF：Rules Manual 2025（持繩、鎖繩與後位規範） ](https://tugofwar-twif.org/wp-content/uploads/2025/08/TWIF-Rules-Manual-2025-final-edition-II-1.pdf)
- H07：[ CDC：Fatal and Nonfatal Drowning Outcomes Related to Dangerous Underwater Breath-Holding Behaviors ](https://www.cdc.gov/mmwr/preview/mmwrhtml/mm6419a3.htm)
- H08：[ ITTF：Statutes 2026（桌球規則2.6.3、2.6.4、2.7.1） ](https://documents.ittf.sport/sites/default/files/public/2026-02/2026_Statutes_v1_consolidated_clean.pdf)
- H09：[ CDC：About E-Cigarettes (Vapes) ](https://www.cdc.gov/tobacco/e-cigarettes/about.html)
- H10：[ CDC：Health Effects of Vaping ](https://www.cdc.gov/tobacco/e-cigarettes/health-effects.html)
- H11：[ NIAAA：Alcohol and the Brain: An Overview ](https://www.niaaa.nih.gov/publications/alcohol-and-brain-overview)
- H12：[ WHO／IARC：Betel-quid and areca-nut chewing carcinogenic to humans ](https://www.who.int/news/item/07-08-2003-iarc-monographs-programme-finds-betel-quid-and-areca-nut-chewing-carcinogenic-to-humans)
- H13：[ NIDA：Heads Up — Opioid misuse and overdose response ](https://nida.nih.gov/sites/default/files/NIDA_YR18_INS2_downloadall_508.pdf)
- H14：[ 消防署：大家不可不會的CPR—民眾版成人心肺復甦術 ](https://www.nfa.gov.tw/pro/index.php?article_id=905&code=list&flag=detail&ids=113)
- H15：[ WHO：Five keys to safer food manual ](https://www.who.int/publications/i/item/9789241594639)
- H16：[ 疾病管制署：預防登革熱有一套—防蚊措施、巡倒清刷不可少 ](https://www.cdc.gov.tw/Bulletin/Detail/drKkYC9lsvKwJErCP1Wl5g?typeid=9)
- H17：[ 疾病管制署：結核病 ](https://www.cdc.gov.tw/Disease/SubIndex/j5_xY8JbRq3IzXAqxbnAvQ)
- H18：[ CDC：Clinical Overview of Hepatitis A ](https://www.cdc.gov/hepatitis-a/hcp/clinical-overview/index.html)
- H19：[ 食品藥物管理署：過年不舒服別亂吃藥！「好心分享」小心變健康地雷 ](https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t624125)
- H20：[ 中央健康保險署：全民健保社會互助與共同分擔風險說明 ](https://www.nhi.gov.tw/ch/dl-31146-ed198a878c414b7988bf750fcd93b348-1.pdf)
- H21：[ 中央健康保險署：健保卡不可交給他人冒用 ](https://www.nhi.gov.tw/ch/cp-7503-53b35-3255-1.html)
- H22：[ 農業部：產銷履歷農產品資訊網履歷查詢 ](https://taft.moa.gov.tw/sp-resume-list-1.html?Today=Today)
- H23：[ FDA：2017 RRT Best Practices Manual — Food Recalls ](https://www.fda.gov/files/newsroom/published/2017-RRT-Best-Practices-Manual-REDUCED.pdf)
- H24：[ NIDDK：What Is Diabetes? ](https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes)
- H25：[ WHO：Cancer ](https://www.who.int/en/news-room/fact-sheets/detail/cancer)
- H26：[ NIDDK：Your Kidneys & How They Work ](https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work)
- H27：[ 國民健康署：天氣忽冷忽熱 注意身旁有「心」人（FAST與119） ](https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=4306&pid=13904)
- H28：[ WHO：Noncommunicable diseases ](https://www.who.int/news-room/fact-sheets/detail/noncommunicable-diseases)
- H29：[ American Red Cross：Bleeding (Life-Threatening External) ](https://www.redcross.org/take-a-class/resources/learn-first-aid/bleeding-life-threatening-external)
- H30：[ American Red Cross：AED Steps ](https://www.redcross.org/take-a-class/aed/using-an-aed/aed-steps)
- H31：[ WHO：Sexual health ](https://www.who.int/health-topics/sexual-health)
- H32：[ 衛生福利部保護服務司：113保護專線介紹 ](https://dep.mohw.gov.tw/DOPS/cp-1183-6499-105.html)
- H33：[ WHO：Guidelines for the management of asymptomatic sexually transmitted infections ](https://www.who.int/publications/i/item/9789240104907)
- H34：[ CDC：How HIV Spreads ](https://www.cdc.gov/hiv/causes/index.html)
- H35：[ CDC：About Genital HPV Infection ](https://www.cdc.gov/sti/about/about-genital-hpv-infection.html)
- H36：[ NIDDK：Your Digestive System & How it Works ](https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works)
- H37：[ NHLBI：How the Lungs Work — What Breathing Does for the Body ](https://www.nhlbi.nih.gov/health/lungs/breathing-benefits)
- H38：[ 國民健康署：護眼運動從幼扎根 擁有好視野 ](https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=4809&pid=17921)
- H39：[ NIDCR：Tooth Decay ](https://www.nidcr.nih.gov/health-info/tooth-decay)
- H40：[ NICHD：Puberty ](https://www.nichd.nih.gov/health/topics/factsheets/puberty)
- H41：[ NHS Greater Glasgow and Clyde：Wet dreams ](https://www.rightdecisions.scot.nhs.uk/ggc-sexual-health-young-people/a-z/w/wet-dreams/)
- H42：[ NHS：Period pain ](https://www.nhs.uk/symptoms/period-pain/)
- H43：[ 國民健康署：全穀及未精製雜糧有哪些？ ](https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=4560&pid=16717&sid=16718)
- H44：[ USDA FSIS：How Temperatures Affect Food ](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/how-temperatures-affect-food)
- H45：[ FDA：Food Allergies ](https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies)

## 檔案指紋

- 輸入 SHA-256：`05178a41cc7063076d0d4a6450102db7ada37d520de4bdda868a9f706577a0fb`
- 審查後 JSON SHA-256：`08de2def40274dddf782c8e056ad01cbe54c75953f30a533867c3c1b2ede5217`
