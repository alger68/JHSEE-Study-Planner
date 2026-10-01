# 國文與本土語原創教材完成報告

完成 83 節、249 個觀念、249 題四選一題。每節均有 3 個觀念，且觀念索引 0、1、2 各有 1 題。閱讀導讀 74 節，語文主題教學 9 節。輸出依輸入順序排列，sectionId 與 title 完全保留。

## 內容處理

- 未取得現代課文全文的篇目，採用與課名相關的原創短文和閱讀能力練習；均標明「原創閱讀練習；未核對課文全文」。自編人物、事件、詩句、分鏡與對話不宣稱為原作者作品。
- 古典公版篇章以實際核對的原典作背景，自行撰寫解說與練習，仍不宣稱已核對校方採用的課本版本。〈畫說湖心亭看雪〉僅核對張岱古文，不推定現代圖文改編內容；〈與宋元思書〉保留輸入課名並說明題名異文的限制。
- 本土語以華語輔助主題理解；只使用已核對的教育部辭典詞義，不杜撰台語全文、羅馬字或音讀。辭典引用限於詞義，不將辭典中自然科學描述擴充為科學教材。
- 4 個同課名跨學期項目共用相同原創內容，仍各自保留獨立的 sectionId。沒有假造不同版本的課文差異。
- 〈以粥養生〉處理敘事與證據界線，不提供食療處方；動物、環境和科技題以文本證據判讀為核心，不由課名補造物種知識、環境統計或技術規格。
- 完稿後調整 44 組干擾選項，改善與題幹的關聯；修正〈一棵開花的樹〉第 2 題拆分成 6 個干擾項的問題，現為 3 組配對干擾項。

## 已查閱並用於內容的來源

以下為來源去重清單；各節 sources 僅列該節確實使用的來源。沒有外部來源的純自編短文，sources 保持空陣列。

- [教育部《國語辭典簡編本》：曲牌](https://dict.concised.moe.edu.tw/dictView.jsp?ID=25917&la=0&powerMode=0)
- [教育部《國語辭典簡編本》：對聯](https://dict.concised.moe.edu.tw/dictView.jsp?ID=9526&la=0&powerMode=0)
- [教育部《重編國語辭典修訂本》：形聲](https://dict.revised.moe.edu.tw/dictView.jsp?ID=110679&la=0&powerMode=0)
- [教育部《重編國語辭典修訂本》：竹枝詞](https://dict.revised.moe.edu.tw/dictView.jsp?ID=118214&la=0&powerMode=0)
- [教育部《重編國語辭典修訂本》：詞牌](https://dict.revised.moe.edu.tw/dictView.jsp?ID=140475&la=0&powerMode=0)
- [教育部《重編國語辭典修訂本》：近體詩](https://dict.revised.moe.edu.tw/dictView.jsp?ID=94639&la=0&powerMode=0)
- [教育部《重訂標點符號手冊》修訂版：引號](https://language.moe.gov.tw/001/Upload/FILES/SITE_CONTENT/M0001/HAU/h6.htm)
- [教育部《重訂標點符號手冊》修訂版：逗號](https://language.moe.gov.tw/001/upload/files/site_content/m0001/hau/h2.htm)
- [國立故宮博物院南部院區：展覽回顧之書法介紹](https://south.npm.gov.tw/ExhibitionsDetailC003110.aspx?Cond=b78dae9a-ec85-41e8-b9ef-67bbdb306c03&appname=Exhibition3112)
- [教育部臺灣臺語常用詞辭典：毋過](https://sutian.moe.edu.tw/zh-hant/su/1114/)
- [教育部臺灣臺語常用詞辭典：火金蛄](https://sutian.moe.edu.tw/zh-hant/su/1247/)
- [教育部臺灣臺語常用詞辭典：蹛](https://sutian.moe.edu.tw/zh-hant/su/12616/)
- [教育部臺灣臺語常用詞辭典：四秀仔](https://sutian.moe.edu.tw/zh-hant/su/1474/)
- [教育部臺灣臺語常用詞辭典：因為](https://sutian.moe.edu.tw/zh-hant/su/2195/)
- [教育部臺灣臺語常用詞辭典：佮](https://sutian.moe.edu.tw/zh-hant/su/3524/)
- [教育部臺灣臺語常用詞辭典：拌](https://sutian.moe.edu.tw/zh-hant/su/3955/)
- [教育部臺灣臺語常用詞辭典：泅水](https://sutian.moe.edu.tw/zh-hant/su/4266/)
- [教育部臺灣臺語常用詞辭典：若是](https://sutian.moe.edu.tw/zh-hant/su/5468/)
- [陶淵明〈五柳先生傳〉公開古文](https://zh.wikisource.org/zh-hant/五柳先生傳)
- [司馬遷《史記》卷一百零二：張釋之馮唐列傳](https://zh.wikisource.org/zh-hant/史記/卷102)
- [《孟子・告子下》第十五章公開古文](https://zh.wikisource.org/zh-hant/孟子/告子下)
- [周敦頤〈愛蓮說〉公開古文](https://zh.wikisource.org/zh-hant/愛蓮說)
- [〈木蘭詩〉公開古文](https://zh.wikisource.org/zh-hant/木蘭詩)
- [張岱〈湖心亭看雪〉公開古文](https://zh.wikisource.org/zh-hant/湖心亭看雪)
- [吳均〈與宋元思書〉公開古文](https://zh.wikisource.org/zh-hant/與宋元思書)
- [劉禹錫〈陋室銘〉公開古文](https://zh.wikisource.org/zh-hant/陋室銘)

## 自查結果

- Python 解析、繁體字整理、原創／原文界線檢查已完成。
- Node 實際呼叫 `JHSEE-Study-Planner/assets/study-notes/v120/modules/catalog-completion.cjs` 的 `validateRow`：83 / 83 通過。
- sectionId 無重複，與輸入 83 筆逐筆對應；title 逐筆完全相同。
- 每節 3 個觀念，body 皆至少 40 字；每題 explanation 至少 25 字。
- 所有 249 題皆有唯一正解欄位、3 個非空且互異的干擾項；單節題幹不重複，3 個觀念均有測驗。
- sources 共 26 個去重 HTTPS 來源；未查得或未讀取的來源未列為查證依據。

## 交接限制

目前是可獨立學習的原創導讀與語文知識，並非現代課文全文的逐段講解。若未來取得合法完整課文，可在保留來源界線的前提下另行補上版本對照；現有資料不需要等待該步驟才能整合。新增體育 12 節另存 chinese-extra-output.json 與 chinese-extra-report.md，不混入本檔。
