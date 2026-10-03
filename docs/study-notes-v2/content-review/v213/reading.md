# v213 閱讀原作與課文查核紀錄

查核日：2026-10-03。範圍為既有閱讀導引的 **74 個 sectionId：57 項國文、17 項臺語**，共70個不同題名。四組重複題名仍按各自學期、出版社分開記錄。

結果：**22 項指定學期課文已核、28 項公開原作／選文已核、24 項仍缺完整或可識別的課文來源**。每項都有獨立補充或查核清單；「74項已調查」不等於「74項原文已取得」。

新增資料是 `assets/study-notes/v120/modules/reading-support.json`。原74項自編閱讀材料、人物情節、概念及測驗均未改動；新增面板只說明已查到的真實作品，或具體缺什麼。原創練習不得被誤稱為同題課文。

## 判定方式

- `edition-verified`：校計畫列出的學期、年級、出版社及篇目，對上出版社明示114下或115上的公開入口，再開啟其課文連結並讀完整選文。這22項均為翰林：114下七年級12項、115上八年級10項。不是只從題名猜測，也不因入口網址含112就把網頁明示的新學期忽略。
- `original-verified`：讀到了可公開閱讀的原篇、古典原文、作者自刊作品或明示範圍的教學選文；未宣稱與學校那一版逐字相同。〈吃冰的滋味〉只核兩頁節選；〈我所知道的康橋〉等只核翰林選文；外文小說只核原作情節，不核康軒翻譯。
- `source-needed`：有目錄、書目、課程計畫、作者資料或詞義佐證，但缺正文、完整選則、作者／譯者識別或可讀來源。兩問均為明示等待證據的查核提示，沒有假裝知道原文答案。

已查官方出版社（翰林、康軒、長鴻、真平及原書出版社）、作者公開專藏／文章／歌曲頁、教育部與學校公開檔案；古典及公有領域作品另用可讀原文館藏。搜索引擎結果只用於定位，正文內容在開啟網頁或取得檔案後才用來寫分析。相關教案、同題作品及需教師登入的電子書頁沒有自動當成原文。未繞過登入或付費限制。

下載學校Drive課程計畫前先查metadata。重新取得並核讀了114下七年級國文、115上八年級國文、115上九年級國文、114下九年級國文、115上七／八年級臺語及114下八年級臺語；其餘校計畫來源識別沿用既有atlas，只用於課次定位。

教學和答案為本次依文本重新撰寫，不搬用出版社現成賞析，不提供受著作權保護的完整課文或長段引文。歌詞僅連結並評論，不重製歌詞。教育部附有不改作授權的朗讀文章也只連結、作獨立評論。

## 特別核對的版本與同題風險

- 〈情緒是生命的指引〉作者是留佩萱；不能換成蕭婷文等近似題文章。〈成功是失敗之母〉是黃永武，不能換成高希均同題文。
- 〈太平洋的風〉校計畫指向太魯閣相關內容，沒有套用胡德夫歌曲或其他同名散文。〈后羿射月〉是黃致凱現代劇本，沒有替換為后羿射日傳說。
- 〈四秀仔錢〉原文自己保留詞源疑問，未將四獸說寫成定論。〈舞蹈班的一片天〉雖有出版社公開正文，該頁沒有作者署名，因此作者保持null。
- 〈論語選〉、〈詞選〉、〈臺灣竹枝詞選〉尚缺確切選則／首句；可讀同一作者的其他篇不能解除整課缺口。
- 臺語朗讀競賽原篇能提供作品分析，卻不能證明長鴻／康軒／真平教科書的改字、拼音及刪節相同。康軒115JB3L1／L2公開朗讀已讀，因未對上紙本全部正文仍列original-verified。
- 〈夏夜〉學校全文PDF曾可由搜尋閱讀取得，收尾重新下載時回傳502；保留已讀範圍並如實標示連結可用性，不聲稱本機有其完整PDF。翰林111試閱只有開頭，沒有冒充全文。

## 74項逐列稽核

「依據／缺口」同時界定兩則教學與兩則問題的支持範圍；完整題文、答文及來源標題在JSON內。

| sectionId／篇名 | 狀態與作者 | 已讀依據或仍缺資料 | 來源 |
|---|---|---|---|
| 115-1-7-chinese/第一課 · 夏夜 | original-verified；楊喚 | 景興國中公開學習單第3頁，全詩由歸返、夜空到入睡及夜間微動；出版社試閱第5頁僅節錄開頭。 | R001、R002、R003 |
| 115-1-7-chinese/第二課 · 生之歌選 | source-needed；杏林子 | 缺康軒115上第二課完整選文；須同時核〈一顆珍珠〉與〈手的故事〉的起訖、刪節及出處。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R005、R003 |
| 115-1-7-chinese/第三課 · 吃冰的滋味 | original-verified；古蒙仁 | 公開節選第1–2頁：今昔吃冰對照、刨冰感官描寫與販冰聲音。 | R006、R003 |
| 115-1-7-chinese/第四課 · 差不多先生傳 | original-verified；胡適 | 原文各次混淆、誤車、請錯醫者及身後評價段落。 | R007、R003 |
| 115-1-7-chinese/第五課 · 論語選 | source-needed；孔子及弟子言行；弟子及後學編纂 | 缺康軒115上第五課各則首句及完整章次；不同冊次、總複習書可能合併不同選則。 已找到出版社總複習試閱中的選則索引，但它跨版本彙整，不能直接證明本校115上課本的完整選則。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R005、R003 |
| 115-1-7-chinese/第六課 · 那默默的一群 | source-needed；張騰蛟 | 缺康軒115上第六課或張騰蛟原篇完整文本；作者介紹、課程目標與教案目錄不足以核情節。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R008、R003 |
| 115-1-7-chinese/第七課 · 兒時記趣 | original-verified；沈復 | 來源〈兒時記趣〉四段：細察、蚊鶴、草木土石及蝦蟆事件。 | R009、R003 |
| 115-1-7-chinese/第八課 · 紙船印象 | original-verified；洪醒夫 | 翰林公開課文投影片 11–22；見本節來源連結。 | R010、R003 |
| 115-1-7-chinese/第九課 · 下雨天，真好 | original-verified；琦君 | 翰林公開課文投影片 11–34；見本節來源連結。 | R011、R003 |
| 115-1-7-chinese/第十課 · 鬧元宵 | source-needed；朱天衣 | 缺康軒115上第十課／朱天衣原篇完整選文與收錄出處；一般元宵習俗介紹不是本文。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R003 |
| 115-1-8-chinese/1 · 田園之秋選 | edition-verified；陳冠學 | 翰林公開課文投影片 11–25；見本節來源連結。 | R012、R013、R014 |
| 115-1-8-chinese/2 · 古詩選 | edition-verified；佚名〈迢迢牽牛星〉；白居易〈慈烏夜啼〉 | 翰林公開課文投影片 11–15、28–30；見本節來源連結。 | R015、R013、R014 |
| 115-1-8-chinese/3 · 下雨天，真好 | edition-verified；琦君 | 翰林公開課文投影片 11–34；見本節來源連結。 | R011、R013、R014 |
| 115-1-8-chinese/4 · 愛蓮說 | edition-verified；周敦頤 | 翰林公開課文投影片 12–16；見本節來源連結。 | R016、R013、R014 |
| 115-1-8-chinese/5 · 生命中的碎珠 | edition-verified；陳幸蕙 | 翰林公開課文投影片 11–25；見本節來源連結。 | R017、R013、R014 |
| 115-1-8-chinese/6 · 鳥 | edition-verified；梁實秋 | 翰林公開課文投影片 12–27；見本節來源連結。 | R018、R013、R014 |
| 115-1-8-chinese/7 · 張釋之執法 | edition-verified；司馬遷 | 翰林公開課文投影片 13–22；見本節來源連結。 | R019、R013、R014 |
| 115-1-8-chinese/8 · 找尋失落的水源 | edition-verified；亞榮隆．撒可努 | 翰林公開課文投影片 11–31；見本節來源連結。 | R020、R013、R014 |
| 115-1-8-chinese/9 · 一棵開花的樹 | edition-verified；席慕蓉 | 翰林公開課文投影片 11–14；見本節來源連結。 | R021、R013、R014 |
| 115-1-8-chinese/10 · 畫的哀傷 | edition-verified；國木田獨步；翰林編輯群譯 | 翰林公開課文投影片 5–36；見本節來源連結。 | R022、R013、R014 |
| 115-1-9-chinese/第一課 · 戲李白 | original-verified；余光中 | 余光中數位文學館原詩：黃河由詩句流出、瀑布與酒壺、李白與蘇軾的結尾。 | R023、R024 |
| 115-1-9-chinese/第二課 · 詞選 | source-needed；李清照；辛棄疾 | 學校115上計畫確認李清照〈如夢令〉及辛棄疾〈南鄉子〉；仍缺各詞首句與康軒完整選文，不能只憑詞牌唯一識別作品。 已讀學校課程計畫第6頁並查出版社目錄；尚未取得本課逐句文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R025、R024 |
| 115-1-9-chinese/第三課 · 人間好時節 | source-needed；張曼娟 | 缺康軒115上第三課實際選段及完整原篇；同名書的導言與商品簡介不等於這篇課文。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R026、R024 |
| 115-1-9-chinese/第四課 · 生於憂患死於安樂 | original-verified；孟子及其弟子 | 《孟子·告子下》第15章：六人事例、個人改過及國家內外條件。 | R027、R024 |
| 115-1-9-chinese/第五課 · 以粥養生 | original-verified；韓良憶 | 原文從父母的稀飯與糜、病中餵食、荷蘭生活，到陸游食粥及末尾設問。 | R028、R024 |
| 115-1-9-chinese/第六課 · 獵人 | source-needed；瓦歷斯．諾幹 | 缺康軒115上第六課或作者同篇完整原文；相關人權教案搜尋線索未成功取得可核附錄。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R024 |
| 115-1-9-chinese/第七課 · 與宋元思書 | original-verified；吳均 | 公開原文：總寫山水、清水急湍、山林聲響及觀景者的心情。 | R029、R024 |
| 115-1-9-chinese/第八課 · 畫說湖心亭看雪 | source-needed；劉墉；涉及張岱〈湖心亭看雪〉 | 缺康軒115上第八課劉墉完整畫說文本與圖像；僅讀張岱古文不能涵蓋後人的解說、圖文安排及選段。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R030、R024 |
| 115-1-9-chinese/第九課 · 喂——出來！ | source-needed；星新一 | 缺康軒115上第九課的中文譯者、完整譯文及選文界線；日文題名與他人梗概不足以核課本用語。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R024 |
| 115-1-7-taiwanese/一 · 白糖粿 | source-needed；未見署名／待核 | 缺長鴻115上七年級第一課作者及全文；已讀校課程計畫，食譜、商家介紹與同題競賽文章不能直接視為同篇。 已查長鴻相關公開資源並閱讀學校課程計畫，仍只有課名和教學目標。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R031 |
| 115-1-7-taiwanese/二 · 來去屏東海生館蹛一暝 | original-verified；陳惠君 | 111年競賽原文單頁，從暑假邀約、選擇館區、參觀住宿到未來願望。 | R032、R033、R031 |
| 115-1-7-taiwanese/三 · 四秀仔錢 | original-verified；王秀容 | 閱讀閩客第54期單頁全文：詞源疑問、童年賺錢買字典及下一代零用錢安排。 | R034、R031 |
| 115-1-7-taiwanese/四 · 燒銀紙佮放炮仔 | original-verified；陳憲國 | 閱讀閩客第64期單頁全文：習俗疑問、幽默對話及婚禮使用錄音的例子。 | R035、R031 |
| 115-1-8-taiwanese/第一課 · 泅過日月潭 | original-verified；蔡天享 | 康軒公開朗讀6段；競賽原篇第6頁，準備、深水恐懼、調整、他人鼓舞及完成。 | R036、R037、R038 |
| 115-1-8-taiwanese/第二課 · 舞蹈班的一片天 | original-verified；未見署名／待核 | 康軒公開朗讀8段：颱風後清理、受損教室、學生擦水與末尾的想像。 | R039、R038 |
| 115-1-8-taiwanese/第三課 · 拌拌咧 | original-verified；李竺芯（公開歌曲署名） | 官方歌曲頁歌詞區：心中自然空間、時間與機會的擬人、副歌重複及童年意象。 | R040、R038 |
| 114-2-7-chinese/1 · 聲音鐘 | edition-verified；陳黎 | 翰林公開課文投影片 11–34；見本節來源連結。 | R041、R042、R043 |
| 114-2-7-chinese/2 · 孩子的鐘塔 | edition-verified；李黎 | 翰林公開課文投影片 12–32；見本節來源連結。 | R044、R042、R043 |
| 114-2-7-chinese/3 · 紙船印象 | edition-verified；洪醒夫 | 翰林公開課文投影片 11–22；見本節來源連結。 | R010、R042、R043 |
| 114-2-7-chinese/4 · 小詩選 | edition-verified；艾青〈跳水〉；白靈〈風箏〉 | 翰林公開課文投影片 11–12、22–23；見本節來源連結。 | R045、R042、R043 |
| 114-2-7-chinese/5 · 近體詩選 | edition-verified；王之渙；杜甫；杜牧 | 翰林公開課文投影片 14–15、25–27、38–39；見本節來源連結。 | R046、R042、R043 |
| 114-2-7-chinese/6 · 石虎是我們的龍貓 | edition-verified；劉克襄 | 翰林公開課文投影片 11–29；見本節來源連結。 | R047、R042、R043 |
| 114-2-7-chinese/7 · 五柳先生傳 | edition-verified；陶淵明 | 翰林公開課文投影片 13–22；見本節來源連結。 | R048、R042、R043 |
| 114-2-7-chinese/8 · 摩登土產鳳梨酥 | edition-verified；洪愛珠 | 翰林公開課文投影片 11–28；見本節來源連結。 | R049、R042、R043 |
| 114-2-7-chinese/9 · 謝天 | edition-verified；陳之藩 | 翰林公開課文投影片 12–34；見本節來源連結。 | R050、R042、R043 |
| 114-2-7-chinese/10 · 貓的天堂 | edition-verified；左拉；翰林編輯群譯 | 翰林公開課文投影片 5–30；見本節來源連結。 | R051、R042、R043 |
| 114-2-7-chinese/自學1 · 搜神抓鬼趣──六朝志怪小說選 | edition-verified；翰林編輯群；改寫吳均、干寶及傳為曹丕的作品 | 翰林公開課文投影片 6–34；見本節來源連結。 | R052、R042、R043 |
| 114-2-7-chinese/自學2 · 放天燈是傳統，還是為山林製造更多垃圾？ | edition-verified；魯皓平 | 翰林公開課文投影片 6–21；見本節來源連結。 | R053、R042、R043 |
| 114-2-8-chinese/第一課 · 一棵開花的樹 | original-verified；席慕蓉 | 翰林公開課文投影片 11–14；見本節來源連結。 | R021、R054 |
| 114-2-8-chinese/第二課 · 樂府詩選——木蘭詩 | original-verified；佚名 | 翰林公開課文投影片 12–26；見本節來源連結。 | R055、R054 |
| 114-2-8-chinese/第三課 · 情緒是生命的指引 | source-needed；留佩萱 | 缺康軒114下第三課完整選段；需核《療癒，從感受情緒開始》對應篇章與課本刪節，不能換成別位作者的近似題文。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R056、R054 |
| 114-2-8-chinese/第四課 · 張釋之執法 | original-verified；司馬遷 | 翰林公開課文投影片 13–22；見本節來源連結。 | R019、R054 |
| 114-2-8-chinese/第五課 · 我所知道的康橋 | original-verified；徐志摩 | 翰林公開課文投影片 11–38；見本節來源連結。 | R057、R054 |
| 114-2-8-chinese/第六課 · 迷途羔羊——弗氏海豚 | original-verified；廖鴻基 | 附錄第23頁海面觀察與牧者比喻；第24頁深潛資訊、表象限制及末尾反問。 | R058、R054 |
| 114-2-8-chinese/第七課 · 陋室銘 | original-verified；劉禹錫 | 翰林公開課文投影片 12–19；見本節來源連結。 | R059、R054 |
| 114-2-8-chinese/第八課 · 成功是失敗之母 | source-needed；黃永武 | 缺康軒114下第八課／《山居功課》原篇的完整文本；高希均另有同題文章，不能互換作者與論證。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R054 |
| 114-2-8-chinese/第九課 · 罐頭由來 | source-needed；周惠民 | 缺康軒114下第九課完整原文，及《飲膳佳會：餐桌上的文化史》對應選段。商品目錄與食品常識不能證明作者用了哪些史料。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R060、R054 |
| 114-2-8-chinese/第十課 · 項鍊 | original-verified；居伊．德．莫泊桑 | La Parure：請帖與禮服對話、借項鍊、遺失與償債、末尾揭露原項鍊價值。 | R061、R054 |
| 114-2-9-chinese/第一課 · 臺灣竹枝詞選 | source-needed；郁永河 | 缺康軒114下第一課實際選詩首句與課本文字；原作者作品不只一首，不能由總題名推定選取範圍。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R062 |
| 114-2-9-chinese/第二課 · 曲選 | original-verified；馬致遠〈天淨沙·秋思〉；白樸〈沉醉東風·漁父詞〉 | 教育局兩份PDF第1頁原曲；校課程計畫第4–5頁及康軒曲選目錄。 | R063、R064、R065、R062 |
| 114-2-9-chinese/第三課 · 二十年後 | original-verified；歐．亨利 | 英文原篇從巡警走訪、火柴光、假友相迎、藥店燈光，到 Jimmy 紙條。 | R066、R062 |
| 114-2-9-chinese/第四課 · 火車與熱氣球 | source-needed；徐國能 | 缺康軒114下第四課或《寫在課本留白處》同篇完整文本；出版社書目只能確認篇目，不能代替正文。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R067、R062 |
| 114-2-9-chinese/第五課 · 憶高畑勳：螢火蟲之墓 | original-verified；藍祖蔚 | 原影評的炸彈、食物、歌謠三部分及末尾追憶。 | R068、R062 |
| 114-2-9-chinese/第六課 · 后羿射月 | source-needed；黃致凱 | 缺康軒114下第六課完整劇本及舞臺指示；這是現代創作，不能替換成后羿射日的古代神話。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R004、R069、R062 |
| 114-2-7-taiwanese/第一課 · ChatGPT敢會曉講閩南語？ | source-needed；未見署名／待核 | 缺康軒114下七年級第一課作者、刊載日期及完整臺語文章；題名不是對今日模型能力的查證結果。 已查出版社臺語教學資源與原题搜尋，尚未取得可公開閱讀的署名全文。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R070 |
| 114-2-7-taiwanese/第二課 · 收成 | source-needed；未見署名／待核 | 缺康軒114下七年級第二課署名與全文；同題作品眾多，插畫作品集線索不足以確認課文作者。 已查出版社與相關創作線索，但沒有可相互核對的完整選文。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R070 |
| 114-2-7-taiwanese/第三課 · 工作犬 | source-needed；未見署名／待核 | 缺康軒114下七年級第三課作者及完整選文；一般犬種或訓練百科不能確定本文寫的是哪種工作。 已查出版社、作者／教育公開資源，尚未取得能核對本課完整選文的公開文本。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R070 |
| 114-2-7-taiwanese/第四課 · 一擺上有意義的活動 | original-verified；柯淑慧 | 112年競賽文本第3頁：觀看介紹、害羞未開口、第一次招呼、募集結果及感想。 | R071、R070 |
| 114-2-8-taiwanese/第一課 · 人生逐位會開花 | source-needed；路寒袖 | 缺真平114下八年級第一課完整詩文、用字與音讀；出版社書目可核作者和同題作品，但尚未取得可核的完整原篇。 已查出版社收錄目錄及歌詞資料線索；全文來源本次未能取得可讀頁面，保留待核。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R072、R073 |
| 114-2-8-taiwanese/第二課 · 固定心態，沿路阻礙；成長心態，一生無礙 | source-needed；未見署名／待核 | 缺真平114下八年級第二課作者及全文；學校計畫只能核心態比較主題，不能證明原課舉例或學術歸屬。 已讀學校課程計畫並查出版社資源，未取得全文。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R073 |
| 114-2-8-taiwanese/語文天地一 · 連接詞(一) | source-needed；未見署名／待核 | 缺真平114下語文天地一完整詞表、例句及音讀；學校計畫第14頁可核並列、選擇、因果、先後四類。 已核教育部辭典兩詞與校課程範圍，但課本其餘選詞、句式未取得；此處僅是核查清單。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R074、R075、R073 |
| 114-2-8-taiwanese/第三課 · 思念火金蛄 | original-verified；張逸嫻 | 108年競賽文本PDF第5頁：回憶去年東勢賞螢、桐花、導覽、夜景及今年盼望。 | R076、R073 |
| 114-2-8-taiwanese/第四課 · 太平洋的風 | source-needed；未見署名／待核 | 缺真平114下八年級第四課作者及全文；學校計畫第25–26頁指向太魯閣文化脈絡，不能替換成胡德夫歌曲或其他同名散文。 已讀本校課程計畫並搜尋同題來源，排除作者、文類不符的結果後仍未取得正文。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R073 |
| 114-2-8-taiwanese/語文天地二 · 連接詞(二) | source-needed；未見署名／待核 | 缺真平114下語文天地二完整詞表、例句及音讀；學校計畫第28頁可核漸進、轉折、假設、條件四類。 已核教育部辭典兩詞與校課程範圍，尚未取得其餘教材句例；此處僅是核查清單。 本節原有自編閱讀練習保留，不能當作同名課文原文。 | R077、R078、R073 |

## 來源索引

索引中的校計畫只支持課次，出版社目錄只支持作者／篇目；正文證據以逐列標明的閱讀範圍為準。

- R001 — [景興國中108學年度寒假學習單〈夏夜〉全文，第3頁](<https://www.chhs.tp.edu.tw/uploads/1580384011740OXchFrlc.pdf>)
- R002 — [翰林111上公開試閱：作者與詩作開頭](<https://public.ehanlin.com.tw/web/handout/handout-url/111S1_國中國文一.pdf>)
- R003 — [永和國中115-1 7年級康軒課程計畫（確認課次，不是課文）](<https://drive.google.com/file/d/1hJzYl8cu1C3oCtI4SY8wVE_zAwOP2b3u/view>)
- R004 — [康軒國文作家介紹目錄（僅核作者，非課文全文）](<https://digitalmaster.knsh.com.tw/all/video/j/mandarin_page.html?l1=主題&l2=作家介紹>)
- R005 — [康軒第一冊互動資源目錄](<https://digitalmaster.knsh.com.tw/ju/chinese/interactivegamearea/B1.html>)
- R006 — [國立臺灣戲曲學院公開〈吃冰的滋味〉節選，2頁](<https://rb002.tcpa.edu.tw/var/file/5/1005/img/614590956.pdf>)
- R007 — [維基文庫：胡適〈差不多先生傳〉公有領域原文](<https://zh.wikisource.org/zh-hant/差不多先生傳>)
- R008 — [教育大市集相關教學資源（目錄）](<https://market.cloud.edu.tw/resources/web/1742671>)
- R009 — [臺南市教育班級網站：〈兒時記趣〉原文](<https://class.tn.edu.tw/modules/tad_web/news.php?CateID=21976&WebID=1478&g2p=4>)
- R010 — [翰林公開課文：紙船印象](<https://jch-repo.hle.com.tw/1下課文放大/L03紙船印象/00全部/index.html>)
- R011 — [翰林公開課文：下雨天，真好](<https://jch-repo.hle.com.tw/2上課文放大/L03下雨天真好/00全部%20(已發佈)/index.html>)
- R012 — [翰林公開課文：田園之秋選](<https://jch-repo.hle.com.tw/2上課文放大/L01田園之秋選/00全部%20(已發佈)/index.html>)
- R013 — [翰林官方115上八年級網頁課文入口（學期證據）](<https://sites.google.com/hanlin.com.tw/112chwebppt/2上>)
- R014 — [永和國中115-1 8年級翰林課程計畫（確認課次，不是課文）](<https://drive.google.com/file/d/19ue5jCk49cbklEQKTdWpvzibsQPydv5U/view>)
- R015 — [翰林公開課文：古詩選](<https://jch-repo.hle.com.tw/2上課文放大/L02古詩選/00全部%20(已發佈)/index.html>)
- R016 — [翰林公開課文：愛蓮說](<https://jch-repo.hle.com.tw/2上課文放大/L04愛蓮說/00全部%20(已發佈)/index.html>)
- R017 — [翰林公開課文：生命中的碎珠](<https://jch-repo.hle.com.tw/2上課文放大/L05生命中的碎珠/00全部%20(已發佈)/index.html>)
- R018 — [翰林公開課文：鳥](<https://jch-repo.hle.com.tw/2上課文放大/L06鳥/00全部%20(已發佈)/index.html>)
- R019 — [翰林公開課文：張釋之執法](<https://jch-repo.hle.com.tw/2上課文放大/L07張釋之執法/00全部%20(已發佈)/index.html>)
- R020 — [翰林公開課文：找尋失落的水源](<https://jch-repo.hle.com.tw/2上課文放大/L08找尋失落的水源/00全部%20(已發佈)/index.html>)
- R021 — [翰林公開課文：一棵開花的樹](<https://jch-repo.hle.com.tw/2上課文放大/L09一棵開花的樹/00全部%20(已發佈)/index.html>)
- R022 — [翰林公開課文：畫的哀傷](<https://jch-repo.hle.com.tw/2上課文放大/L10畫的哀傷/00全部%20(已發佈)/index.html>)
- R023 — [國立中山大學余光中數位文學館：〈戲李白〉原詩](<https://dayu.lis.nsysu.edu.tw/ProList.php?content=nsysu_yu_lit_poe_0466&t=taipei>)
- R024 — [永和國中115-1 9年級康軒課程計畫（確認課次，不是課文）](<https://drive.google.com/file/d/12P-2mCwOvJXwUzkJGx8S-iuOgRyblhgL/view>)
- R025 — [康軒九上第二課詞選目錄](<https://digitalmaster.knsh.com.tw/all/video/j/mandarin_page.html?l1=9上&l2=L02　詞選>)
- R026 — [城邦讀書花園：同名書資料（非課文全文）](<https://www.cite.com.tw/book?id=86072>)
- R027 — [維基文庫：《孟子·告子下》第15章原文](<https://zh.wikisource.org/zh-hant/生于忧患，死于安乐>)
- R028 — [NOW健康：韓良憶〈以粥養生〉，2007-09-11原文](<https://mail.healthmedia.com.tw/main_detail.php?id=33672>)
- R029 — [維基文庫：〈與朱元思書〉，頁面亦標〈與宋元思書〉](<https://zh.wikisource.org/wiki/與朱元思書>)
- R030 — [康軒九上第八課資源入口（非已取得全文）](<https://digitalmaster.knsh.com.tw/ju/chinese/nine/B5/B5L08/>)
- R031 — [永和國中115-1 7年級長鴻課程計畫（確認課次，不是課文）](<https://drive.google.com/file/d/11QkEhtPPbtKVP_5lo8irfZfFUQ6aGQOV/view>)
- R032 — [111年全國語文競賽閩南語朗讀原篇，學校公開檔案](<https://school.tc.edu.tw/open-message/064700/get-file/66daa1ccce92413b7059a00c>)
- R033 — [真平：111年朗讀篇目及作者授權資料](<https://jen-pin.com.tw/news_intro.php?id=229>)
- R034 — [教育部閱讀閩客第54期〈四秀仔錢〉原文](<https://language.moe.gov.tw/readminke/電子報_閱讀閩客054期(閩).pdf>)
- R035 — [教育部閱讀閩客第64期〈燒銀紙佮放炮仔〉原文](<https://language.moe.gov.tw/readminke/電子報_閱讀閩客064期(閩).pdf>)
- R036 — [康軒115八上臺語第一課公開朗讀文本](<https://aispeaking.knsh.com.tw/frontend/115JB3L1>)
- R037 — [111年全國語文競賽文本〈泅過日月潭〉，PDF第6頁](<https://language.hlc.edu.tw/file/文件下載/111年度/全國賽文本/讀者劇場競賽-閩南語/111年全國語文競賽試辦讀者劇場競賽-閩南語文本(高中組).pdf>)
- R038 — [永和國中115-1 8年級康軒課程計畫（確認課次，不是課文）](<https://drive.google.com/file/d/1wA2UUQ7eY4xgAnuw-vq_VYRFJ8GS7mfE/view>)
- R039 — [康軒115八上臺語第二課公開朗讀文本](<https://aispeaking.knsh.com.tw/frontend/115JB3L2>)
- R040 — [李竺芯官方StreetVoice歌曲頁：〈拌拌咧〉](<https://streetvoice.com/SiriSimranKaur/songs/796888/>)
- R041 — [翰林公開課文：聲音鐘](<https://jch-repo.hle.com.tw/1下課文放大/L01聲音鐘/00全部/index.html>)
- R042 — [翰林官方114下七年級網頁課文入口（學期證據）](<https://sites.google.com/hanlin.com.tw/112chwebppt/1下>)
- R043 — [永和國中114-2 7年級翰林課程計畫（確認課次，不是課文）](<https://drive.google.com/file/d/10aIXR6OE3Z1j6r3pBHokYYgBOJ2tREEv/view>)
- R044 — [翰林公開課文：孩子的鐘塔](<https://jch-repo.hle.com.tw/1下課文放大/L02孩子的鐘塔/00全部/index.html>)
- R045 — [翰林公開課文：小詩選](<https://jch-repo.hle.com.tw/1下課文放大/L04小詩選/00全部/index.html>)
- R046 — [翰林公開課文：近體詩選](<https://jch-repo.hle.com.tw/1下課文放大/L05近體詩選/00全部/index.html>)
- R047 — [翰林公開課文：石虎是我們的龍貓](<https://jch-repo.hle.com.tw/1下課文放大/L06石虎是我們的龍貓/00全部/index.html>)
- R048 — [翰林公開課文：五柳先生傳](<https://jch-repo.hle.com.tw/1下課文放大/L07五柳先生傳/00全部/index.html>)
- R049 — [翰林公開課文：摩登土產鳳梨酥](<https://jch-repo.hle.com.tw/1下課文放大/L08摩登土產鳳梨酥/00全部/index.html>)
- R050 — [翰林公開課文：謝天](<https://jch-repo.hle.com.tw/1下課文放大/L09謝天/00全部/index.html>)
- R051 — [翰林公開課文：貓的天堂](<https://jch-repo.hle.com.tw/1下課文放大/L10貓的天堂/00全部/index.html>)
- R052 — [翰林公開課文：搜神抓鬼趣──六朝志怪小說選](<https://jch-repo.hle.com.tw/1下課文放大/自學1六朝志怪小說選/00全部/index.html>)
- R053 — [翰林公開課文：放天燈是傳統，還是為山林製造更多垃圾？](<https://jch-repo.hle.com.tw/1下課文放大/自學2放天燈/00全部/index.html>)
- R054 — [永和國中114-2 8年級康軒課程計畫（確認課次，不是課文）](<https://drive.google.com/file/d/1KoGsZK-xIl3dKiGMpeuXmwzo4XejycGN/view>)
- R055 — [翰林公開課文：樂府詩選——木蘭詩](<https://jch-repo.hle.com.tw/2下課文放大/L02木蘭詩/00全部%20(已發佈)/index.html>)
- R056 — [康軒第四冊互動資源目錄](<https://digitalmaster.knsh.com.tw/ju/chinese/interactivegamearea/B4.html>)
- R057 — [翰林公開課文：我所知道的康橋](<https://jch-repo.hle.com.tw/2下課文放大/L04我所知道的康橋/00全部%20(已發佈)/index.html>)
- R058 — [海洋大學海洋教育教案附錄〈鯨生鯨世選〉，PDF第23–24頁](<https://tmec.ntou.edu.tw/var/file/16/1016/attach/80/pta_35097_6662330_96314.pdf>)
- R059 — [翰林公開課文：陋室銘](<https://jch-repo.hle.com.tw/2下課文放大/L05陋室銘/00全部%20(已發佈)/index.html>)
- R060 — [國教署學習扶助：〈罐頭由來〉教學案例（非原文）](<https://aade.project.edu.tw/example/1244>)
- R061 — [Wikisource：1885年法文版 La Parure 全文](<https://fr.wikisource.org/wiki/Contes_du_jour_et_de_la_nuit_(éd._Flammarion,_1885)/La_Parure>)
- R062 — [永和國中114-2 9年級康軒課程計畫（確認課次，不是課文）](<https://drive.google.com/file/d/1nnZ2xW1VH-7sbR-G0MMDYkHD351WwIKf/view>)
- R063 — [香港教育局：〈天淨沙·秋思〉原文，第1頁](<https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/KS3_19.pdf>)
- R064 — [香港教育局：〈沉醉東風·漁父詞〉原文，第1頁](<https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/KS4_18b.pdf>)
- R065 — [康軒課程影音：九下第二課曲選篇目](<https://digitalmaster.knsh.com.tw/all/video/j/mandarin_page.html?l1=9下&l2=L02　曲選>)
- R066 — [Project Gutenberg：The Four Million，After Twenty Years 原文](<https://www.gutenberg.org/files/2776/2776-h/2776-h.htm>)
- R067 — [九歌出版社：《寫在課本留白處》書目](<https://www.chiuko.com.tw/product/寫在課本留白處/>)
- R068 — [藍祖蔚：〈憶高畑勳：螢火蟲之墓〉原文，2018-04-23](<https://app2.atmovies.com.tw/eweekly/XB1804239903/>)
- R069 — [康軒：黃致凱與國文戲劇教材介紹](<https://www.knsh.com.tw/about/news_detail?ID=535>)
- R070 — [永和國中114-2 7年級康軒課程計畫（確認課次，不是課文）](<https://drive.google.com/file/d/1fcaYKCAl9zxcw2UcGVRMoWY5OhUHhDvD/view>)
- R071 — [112年閩南語朗讀國小初賽篇目，PDF第3頁](<https://nyes.chc.edu.tw/storage/074708/posts/2160/files/03-1%20112年初賽閩朗國小組篇目(4篇).pdf>)
- R072 — [晨星出版社：《向玉山：路寒袖台語詩集》書目](<https://www.morningstar.com.tw/m/bookinfo.aspx?bookno=0101078>)
- R073 — [永和國中114-2 8年級真平課程計畫（確認課次，不是課文）](<https://drive.google.com/file/d/1SlSYyVz6pPRmd_uzdRQZtzlxj1ZTDtby/view>)
- R074 — [教育部臺語常用詞辭典：佮（已讀多個詞義）](<https://sutian.moe.edu.tw/zh-hant/su/3524/>)
- R075 — [教育部臺語常用詞辭典：因為（已讀釋義與用例）](<https://sutian.moe.edu.tw/zh-hant/su/2195/>)
- R076 — [臺中市108年閩南語朗讀國小組文本，第5篇／PDF第5頁](<https://dxes.tc.edu.tw/var/file/180/1180/img/1198/edu_e_4_108read.pdf>)
- R077 — [教育部臺語常用詞辭典：若是（已讀釋義與用例）](<https://sutian.moe.edu.tw/zh-hant/su/5468/>)
- R078 — [教育部臺語常用詞辭典：毋過（已讀釋義與用例）](<https://sutian.moe.edu.tw/zh-hant/su/1114/>)

## 指定學期證據與檔案核驗

校課程計畫逐列選文表：114下七年級第3頁，115上八年級第2頁。出版社對應入口明示114下、115上；各課直接正文連結均包含在JSON及上列索引中。逐列表的投影片編號由公開網頁PPT自身的頁序取得。原文與投影片上的教學註記分開讀取，分析只以正文為內容依據。

| 證據檔／範圍 | SHA-256 |
|---|---|
| course7ch2.pdf | `8399b23a21366ea53f6ee00b3371ddc51598e91e9d777daa042318e2c7a9bd5f` |
| course8ch1.pdf | `e332b8c85aaae14288d097d504407a01678889432024d7ab5e3904c11a78d6c0` |
| course9ch.pdf | `f2ed35bdc51ad4d451f1652f5e70b112f8708ba3bddf08dfde91f354a4d1520f` |
| course9ch2.pdf | `6c4f9c8867fc856482b79ba58ae3633263b02f55c346c9042f20c3ca824689f8` |
| course7tw.pdf | `c337fadd5790cf6dd04e2bf36f8185e178d3f7391734a6669282d4b1b503b3e3` |
| course8tw.pdf | `c9be9d3426022002aff36ebf9f592da254dff8b36bde8008a64fb6a79e8832c1` |
| course8tw2.pdf | `921e5b88fff187cdebac3f3204743a94115b52730750406fddb24ecc05f8d58a` |
| ice.pdf | `67c2dc88d39183bb1fd43f9282385550cdfecd8555524c275ebfd1cde89acf01` |
| dolphin.pdf | `43f7659ebd412bd1e92498488e2517d49a75d42dcfd952c2f70701fb5ae1c5dd` |
| money.pdf | `4530de7b69756996fbbd1f10a505e856e43cdabb65c2e5577ae2df1451bcd306` |
| paper.pdf | `5a8732924b9a1023947533d74e7e58319138b7c5f43e5151457de4eab15f8ab0` |
| activity.pdf | `e1879a0356b98445f6d569b99d43a3483845ad603682a63f3649b560700455d0` |
| swim.pdf | `0d6b605ed6614b5d7233003c62936d56e0061d1abd0835ec608993bfbc283eed` |
| aquarium.pdf | `565af8fc76ea8aebb06053e985ed1b07bd6b1045a7bda4d2807a7cf3205c04d3` |
| firefly.pdf | `d39184c029961b02e817dcf0ff1a79eb8f27e4b50c0e6fb106811ff09adddb0c` |
| curve.pdf | `4e3665cc755ced40839d139025182110563fc6fd4b1e352d6f5c2da301500ad8` |
| 翰林公開PPT：聲音鐘（HTML） | `f5be18248daa024e377eb90711f2171b5cf7efc851043128a82d7a531e547191` |
| 翰林公開PPT：孩子的鐘塔（HTML） | `f257fd1b4e7c93c6c88873e405a8ad901a81eed697cfc30200438e6e3bb6d454` |
| 翰林公開PPT：紙船印象（HTML） | `6c4ca10445e4d290aa5be5db3cac212a5b9ef6ba80701e740cb83210cdb4359a` |
| 翰林公開PPT：小詩選（HTML） | `b37f82f8c6e120280c95c72136b77b433f295539a95134f0c16dd2f31af20591` |
| 翰林公開PPT：近體詩選（HTML） | `3070071e69163387660d8d36839be56b868941116dbcd7334d8bf7aa1bf7dafc` |
| 翰林公開PPT：石虎是我們的龍貓（HTML） | `dee8bc227a7fcf2022e88fb8b37d5f7c26b908d163d6c11cf000e85d0ee53b6a` |
| 翰林公開PPT：五柳先生傳（HTML） | `70729bf2bf91d9e64cd7876e7928a60a20d00eec2bc1c753f5b1b617162f7648` |
| 翰林公開PPT：摩登土產鳳梨酥（HTML） | `2ca04b996dadc52e6c44ebebf782d4653ae4d5bc997d257ca6e770ec5f6318fe` |
| 翰林公開PPT：謝天（HTML） | `6eaa64175737b89de502af8a087b7f29f05452a073dcea70d394babef661df68` |
| 翰林公開PPT：貓的天堂（HTML） | `cb6ba7d87b4f377e3407e2b987b45c1e9a377637bf5a4fcdc7ac1507104af8bb` |
| 翰林公開PPT：搜神抓鬼趣──六朝志怪小說選（HTML） | `79e0972f8d8a9f154551da1aedc855a878496688534cc63ed1e3664a7c1285dc` |
| 翰林公開PPT：放天燈是傳統，還是為山林製造更多垃圾？（HTML） | `3897c3a62b5eab7b777afff58a2a8ee36b53a340e3009e5185559b4d602c5266` |
| 翰林公開PPT：田園之秋選（HTML） | `e9aadd37fbb7194326e13047b26bf441930e7680282e9f0248712da534589596` |
| 翰林公開PPT：古詩選（HTML） | `ae9e55a75b781b91ae8ed2d14efab34f994504a75e16a7a0b898ef8211029a08` |
| 翰林公開PPT：下雨天，真好（HTML） | `56eab9a584c34cf2ed03a2e5e813d1c4144c48f7143f94ec1f2ada2a5cab028c` |
| 翰林公開PPT：愛蓮說（HTML） | `ef1effa51f62890cb0c0286406bef159f0ce497dc81ef29fd70f0408d8bd38a8` |
| 翰林公開PPT：生命中的碎珠（HTML） | `b8f67451d60d87821d998bfd95d56a1fc900c43b64dabbb89615ee5cb0b0d5e1` |
| 翰林公開PPT：鳥（HTML） | `6389d26e6d1fe898ac60f37010db6f75002af07b4b75a139770f65b0d9578c32` |
| 翰林公開PPT：張釋之執法（HTML） | `7b491bcdba8daa6bf30bba649762ba37f7c6caf053b462ab02dcab95bf279001` |
| 翰林公開PPT：找尋失落的水源（HTML） | `60a203cc55aeb2c25cdb040718d0f9cef24db61259c6df594568ec3a055f2439` |
| 翰林公開PPT：一棵開花的樹（HTML） | `3e7d3e7a116785de2a8360f56e89b891095a71afbe7f88dc4acce6237ce4e30c` |
| 翰林公開PPT：畫的哀傷（HTML） | `27774a636331b6b21342b539b00d23c200763799a6af7ad7044965fac2660424` |
| 翰林公開PPT：樂府詩選——木蘭詩（HTML） | `5b2d909705b77446379bfe458ff6818088edd9c55a166bd6494fb0a1b6ca045a` |
| 翰林公開PPT：我所知道的康橋（HTML） | `0a2d3c33bd39102d9972554758fab25390b8c3e293acadd46b77d9beef009b82` |
| 翰林公開PPT：陋室銘（HTML） | `a749a600b232680b01df80b24eef2556b754b71806b29cd94c7d5d2af4faf524` |

這些雜湊用於記錄本次查核的下載版本，公開原文檔案保留在工作區，不隨產品重新散布。PDF正文已以文字擷取閱讀；海豚、吃冰、四秀仔錢、燒銀紙、競賽臺語原篇等亦核看頁面，以確認作者署名、雙欄順序、頁碼與段落。

## 檢核結果

- 74個sectionId與輸入清單完全一致，無遺漏、重複或新增無關篇目。
- 每列都有checked、status、author（可null）、scopeNote、來源、兩則教學及兩則有basis的問題。
- 22／28／24的分類由資料重算；只有兩个有明確學期入口及校計畫配對的課程組能取得edition-verified。
- source-needed的問題答案明示等待原文；每列寫明作者、版本、選則或原篇範圍等具體缺口。
- 重複篇目依其學期獨立判定；康軒列沒有因為讀到翰林選文就升成edition-verified。
- 原有catalog-content與quiz不在本次修改範圍；沒有改動原創練習或任何選項、答案。

