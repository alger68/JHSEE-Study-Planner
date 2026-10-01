# 生活領域補充批次內容報告

已完成 22 個教學主題：七下健康 7 個、八下健康 8 個、九下健康 5 個、九下科技 2 個。共 66 個觀念、66 道原創四選一題；每主題 3 個觀念與 3 題，每個觀念均有對應題目。

## 定位與內容範圍

- 按 life-extra-input.json 的 sectionId、title 原序一一完成；全數使用 topic-guide。
- 已讀校方課程計畫文字：sources/114-2-7-health.txt、114-2-8-health.txt、114-2-9-health.txt、114-2-9-technology.txt，以確認教學主題範圍。這些來源是教學活動計畫，並非取得出版社課文全文，原 PDF 頁碼均未知。每項 note 已明示此界線。
- 原創內容涵蓋菸酒檳榔與物質使用、感染途徑、用藥與健保、食品追溯及衛生、慢性病、傷口照護與成人 CPR／AED、性健康及人際家庭、控制電路與未來科技。
- 健康內容採公共衛生與求助教育，沒有個人診斷、劑量、任意停藥建議或以成人血壓門檻要求青少年自行判讀。沒有複製課程表中過度簡化的毒品分類、免疫或法律免責說法。
- 〈安全百分百〉依校方主題定位寫傷口、出血與急救包；〈急救一瞬間〉限定成人急救辨識、119、胸外按壓分工及 AED 提示。教學練習只使用模型與訓練機，不在同學身上實作按壓或電擊。
- 性健康採尊重、自主、可撤回的同意與適齡求助，不要求學生揭露私人經驗，不以病名、性別或關係選擇貼標籤；不宣稱同意即代表所有年齡或情境均合法。
- 科技採紙上／模擬控制、元件角色與新科技評估；不提供市電或危險生物實驗操作。回收公告題使用明示虛構資料，並非現實品牌事件。

## 查證與自查

- 醫療、食品與緊急救護採國健署、疾管署、食藥署、健保署、消防署／臺北市消防局、衛福部、WHO、NHS、NIDDK 等官方來源；性教育參考 UNESCO、UNFPA；科技依 CMU 原課程、元件製造商、NHGRI、NNCO 與 NIST 原始資料。
- 另實際呼叫 repository 的 catalog-completion.cjs validateRow，22／22 列全部通過。
- JSON 可解析，22 個 sectionId／title 與輸入完全一致，無缺漏與重複。所有觀念欄位、來源及 note 非空；題目均有 1 正解、3 個相異幹擾項及具體解析。
- concept 索引僅 0、1、2，各主題全部覆蓋；66 個題幹彼此不重複，且不與原 life-output.json 的 219 題重複。
- 觀念 body 最短 70 個中文字；解析最短 31 個中文字，均通過最低長度門檻。
- 以 Python 重新驗算：300／200×6＝9 公克；1 AND (NOT 1)＝0；29、31、30 對「大於或等於30開」依序為關、開、開；50 奈米＝5×10^-8 公尺；回收題三條件交集恰有一個選項。
- 已通讀題目條件及解析，確認各題正解與對應觀念一致，並檢查否定題、等號邊界、傳播途徑與篩檢／確診區別。
- 已整理繁體用字，保留輸入原題名與識別碼，不用轉換程序修改來源 URL。

## 需主代理處理

本補充批次無阻塞，可整合。校方 PDF 頁碼未知仍保持未知；不應在網站標成出版社完整課文或完整教材。原73節輸出與報告在本補充批次未修改。

## 實際查閱的網路來源

共 40 個不同 URL；各條資料已附其使用來源。

- [國民健康署：使用電子煙不會成癮？也不會影響大腦的發育嗎？](https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=127&pid=16362)
- [國民健康署：電子煙不是潮流 是健康陷阱！「三不一要」拒絕電子煙 共同營造健康環境](https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=5020&pid=20287)
- [WHO：Alcohol](https://www.who.int/news-room/fact-sheets/detail/alcohol)
- [國民健康署：檳榔自己種的，比較不會致癌？](https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=127&pid=14622)
- [食品藥物管理署：Q&A常見問題解答—濫用防制業務](https://www.fda.gov.tw/TC/sitecontent.aspx?sid=140)
- [疾病管制署：傳染病防治工作手冊](https://www.cdc.gov.tw/Category/MPage/mOqwmo-IyKx0ouTNWjuSgA)
- [疾病管制署：防範登革熱 梅雨季節期間請民眾加強清除積水容器 落實「巡、倒、清、刷」](https://www.cdc.gov.tw/Category/ListContent/Hh094B49-DRwe2RR4eFfrQ?uaId=fvUjKT2AhWh1ts4cYyK9mQ)
- [疾病管制署：結核病](https://www.cdc.gov.tw/Disease/SubIndex/j5_xY8JbRq3IzXAqxbnAvQ)
- [疾病管制署：A型肝炎Q&A](https://www.cdc.gov.tw/Category/QAPage/kn5iPOO8qInG0EEvoNOCEA)
- [食品藥物管理署：用藥相關安全知識](https://www.fda.gov.tw/TC/sitecontent.aspx?sid=1688)
- [中央健康保險署：全民健康保險簡介](https://www.nhi.gov.tw/ch/cp-3153-f49da-2456-1.html)
- [中央健康保險署：部分負擔專區](https://www.nhi.gov.tw/ch/np-3087-1.html)
- [中央健康保險署：全民健康保險民眾權益](https://media.nhi.gov.tw/md/dl-66516-25406b317a094e6c982104e9ce5c906c-3.pdf)
- [農業部：產銷履歷農產品驗證管理辦法](https://law.moa.gov.tw/LawContent.aspx?id=FL043477)
- [政府資料開放平臺：產銷履歷](https://data.gov.tw/dataset/7556)
- [食品藥物管理署：預防食品中毒五要二不原則](https://www.fda.gov.tw/Tc/PublishOtherEpaperContent.aspx?id=1592&r=913138443&tid=5416)
- [食品藥物管理署：食品中毒常見問與答](https://www.fda.gov.tw/TC/sitecontent.aspx?sid=2572)
- [食品藥物管理署：台灣雀巢預防性自主下架2批號啟賦幼兒(童)成長專用配方食品](https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t624010)
- [食品藥物管理署：1919全國食安專線 一通就夠](https://www.fda.gov.tw/TC/siteContent.aspx?sid=10672)
- [WHO：Diabetes](https://www.who.int/news-room/fact-sheets/detail/diabetes)
- [食品藥物管理署：包裝食品營養標示應遵行事項](https://foodlabel.fda.gov.tw/FdaFrontEndApp/OtherData/Edit?ClType=1&SystemId=ffecbbc0-eac3-4bb1-a91e-5ace76bbe31b)
- [WHO：Cancer](https://www.who.int/news-room/fact-sheets/detail/cancer)
- [NIDDK：Your Kidneys & How They Work](https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work)
- [WHO：Hypertension](https://www.who.int/news-room/fact-sheets/detail/hypertension)
- [NHS：Symptoms of a stroke](https://www.nhs.uk/conditions/stroke/symptoms/)
- [臺北市政府消防局：心肺停止急救處置](https://www.119.gov.taipei/cp.aspx?n=83DD6BE15583BEBF)
- [WHO：Noncommunicable diseases](https://www.who.int/news-room/fact-sheets/detail/noncommunicable-diseases)
- [WHO：Mental health of adolescents](https://www.who.int/news-room/fact-sheets/detail/adolescent-mental-health)
- [NHS：Cuts and grazes](https://www.nhs.uk/conditions/cuts-and-grazes/)
- [內政部消防署：【大家不可不會的CPR—民眾版成人心肺復甦術】](https://www.nfa.gov.tw/cht/index.php?article_id=905&code=list&flag=detail&ids=21)
- [UNESCO：Comprehensive sexuality education](https://www.unesco.org/en/health-education/cse)
- [UNFPA Sri Lanka：#VDay14](https://srilanka.unfpa.org/en/vday14)
- [衛生福利部保護服務司：113保護專線介紹](https://dep.mohw.gov.tw/DOPs/cp-1183-6499-105.html)
- [WHO：Sexually transmitted infections (STIs)](https://www.who.int/news-room/fact-sheets/detail/sexually-transmitted-infections-(stis))
- [疾病管制署：愛滋不會因一般日常生活行為造成感染，關懷愛滋不分國籍，別再將他/她視為異己](https://www.cdc.gov.tw/Bulletin/Detail/35tkGgygVd2n4N_3kC3l3Q?typeid=9)
- [Carnegie Mellon University 99-355：Using a ULN2803 transistor](https://courses.ideate.cmu.edu/99-355/f2021/tutorials/transistor)
- [Murata：Basics of Capacitors [Lesson 1] How do capacitors work?](https://article.murata.com/en-sg/article/basics-of-capacitors-1)
- [National Nanotechnology Coordination Office：About Nanotechnology](https://www.nano.gov/about-nanotechnology/)
- [NHGRI：Recombinant DNA Technology](https://www.genome.gov/genetics-glossary/Recombinant-DNA-Technology)
- [NIST：AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
