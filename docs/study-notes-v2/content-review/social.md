# 社會與輔導教材交付報告

完成 84 節、252 個觀念、252 道原創四選一題。範圍為歷史 28 節、公民 34 節、輔導 22 節；每節 3 個實質觀念及 3 題，三個觀念各有一題。資料檔為 social-output.json。

全部使用 topic-guide。教材依校方課程標題自編，未取得出版社課文全文；不宣稱已逐頁講解課本，也不重製課文或第三方題庫。例子、情境與數字均為教學設計。穩定基礎概念未強加網路來源，sources 空陣列不表示經外部逐項審查。

## 查證與內容界線

- 法政內容以教育基礎概念為主，憲法及政府權責連同增修條文檢視；民事、刑事、行政救濟、少年事件及智慧財產已參照法務部、司法院與智慧財產局資料。不填入不必要的年齡、罰額、救濟日數或個案責任結論，並明示效力需看適用條件。
- 臺灣政治史區分二二八事件、戒嚴及民主化不同階段，1987 解嚴明確限定臺灣本島。外交史分開處理 1971 聯合國中國代表權與後續政治解釋，1979 正式外交變化與非官方往來；不將代表權決議擴寫為未經論證的主權結論。
- 歷史解說重視時序、權力與社會脈絡。中國官方歷史文件用於政策名稱及歷史定位，另搭配其他官方歷史資料檢視政治迫害，不照搬政治評語。
- 部分舊頁僅讀到官方搜尋摘要或官方檔案鏡像：美國國務院 1900–1949 歷史頁直接開啟失敗，已在各節來源標題註明搜尋摘要；IWM 一戰資料使用可取得的檔案版本。未將這些頁面聲稱為全文查閱。
- 輔導不是心理診斷或正式測驗，使用具體任務、界線、回饋與求助情境。壓力照護參照 WHO 現行問答；學習的提取及分散練習參照 IES 指引。生涯例子的時程、路徑、費用皆為假設，現行招生要求應查當年度正式資訊。

## 自查結果

JSON 已成功解析，84 個 sectionId 與 title 依輸入逐項完全一致，無漏項或重複 ID。每節必填欄位、3 個觀念、3 道題、整數觀念索引 0–2 覆蓋、每題 4 個互異選項皆通過；全批題幹與觀念正文無完全重複。所有正文至少 61 字，所有解析至少 34 字，超過 brief 的最低要求。

已逐節檢視觀念、題幹、正解與干擾選項，將與學習目標無關的干擾項改為相關概念混淆。數值驗算：機會成本題選球賽時放棄的最佳替代選項為社團 70 分，而非 120 分總和；比較利益題甲每張卡成本 0.5 盒餅、乙為 1 盒，交換率 0.75 位於其間。數值均為題幹假設。

文字已校對繁體及轉字造成的錯字，包括制度、干預、干擾、強制、觀念與行政單位的里；輸入標題與 ID 保持原樣。校正時一度使整數 concept 欄位變成 null，已恢復並重新驗證。最終另直接呼叫 repository 的 catalog-completion.cjs validateRow，84 列全部通過。

教材定位為國中基礎概念與情境判讀，不是正式法律意見、臨床建議或升學保證。主代理可直接整合；無阻塞問題。

## 實際查閱的參考資料

以下為各節已記錄的去重來源；個別資料僅支援相關概念，並非各節全部內容的逐字來源。

- [國立臺灣史前文化博物館：臺灣史前史廳](https://www.nmp.gov.tw/cp.aspx?n=1982)
- [臺灣史前文化雲：新石器時代早、中期](https://icloud.nmp.gov.tw/Museum/PermanentContent?a=215)
- [國立臺灣歷史博物館：跨・1624：世界島臺灣國際特展](https://www.nmth.gov.tw/News_Content_Due.aspx?n=4106&s=199594)
- [臺史博：帝國相接之界](https://taiwanoverseas.nmth.gov.tw/archives/162edcfd-5112-4e45-b26e-10422b518a6d?keywords=%E5%A4%A7%E5%93%A1)
- [原住民族文獻：從新港文書看16－19世紀的平埔族](https://ihc.cip.gov.tw/EJournal/EJournalCat/46)
- [臺史博：跨・1624：世界島臺灣](https://www.nmth.gov.tw/News_Publish_Content.aspx?n=4164&s=200849&sms=13776)
- [原住民族文獻：牡丹社事件的地圖史料與空間探索（上）](https://ihc.cip.gov.tw/EJournal/EJournalCat/99)
- [臺史博常設展：商業市鎮](https://the.nmth.gov.tw/nmth/zh-TW/Location/fc8096a5-41a5-461d-bda6-f186da375a5a)
- [臺史博常設展：開港通商](https://the.nmth.gov.tw/nmth/zh-tw/Location/62bb43cd-e9e8-4ea7-9096-3fe47c21b880)
- [臺灣宗教文化地圖：鹿港南靖宮](https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=303)
- [臺史博：古城・新都・神仙府：臺南府城歷史特展](https://www.nmth.gov.tw/News_Content_Due.aspx?n=4106&s=139834)
- [The Metropolitan Museum of Art：Art of the First Cities](https://www.metmuseum.org/exhibitions/listings/2003/art-of-the-first-cities)
- [The Met：Cuneiform tablet, administrative account](https://www.metmuseum.org/art/collection/search/327385?pg=2)
- [The Met：Buddhism along the Silk Road](https://www.metmuseum.org/exhibitions/listings/2012/buddhism)
- [The Met：Byzantium and Islam](https://www.metmuseum.org/exhibitions/listings/2012/byzantium-and-islam)
- [Library of Congress：Renaissance Era: A Resource Guide](https://guides.loc.gov/renaissance-era-resources)
- [Library of Congress：The Gutenberg Bible](https://loc.gov/exhibits/bibles/interactives/gutenberg/index.html)
- [Library of Congress：The Vatican Library](https://www.loc.gov/exhibits/vatican/vatican.html)
- [Library of Congress：Mathematics](https://www.loc.gov/exhibits/vatican/math.html)
- [National Archives：Declaration of Independence (1776)](https://www.archives.gov/milestone-documents/declaration-of-independence)
- [Élysée：The Declaration of the Rights of Man and of the Citizen](https://www.elysee.fr/en/french-presidency/the-declaration-of-the-rights-of-man-and-of-the-citizen)
- [全國法規資料庫：中華民國憲法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0000001)
- [社家署：兒童權利公約兒童版](https://crc.sfaa.gov.tw/Child/Home/CRC2?AspxAutoDetectCookieSupport=1)
- [原住民族委員會：諮商取得原住民族部落同意參與辦法](https://law.cip.gov.tw/LawContent.aspx?id=GL000225&media=print)
- [全國法規資料庫：中華民國憲法增修條文](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0000002)
- [全國法規資料庫：地方制度法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0040003)
- [中央銀行兒童網：什麼是貨幣？](https://knowledge.cbc.gov.tw/child/money01.html)
- [金管會：金融商品及消費者權益相關法律知識訊息—銀行篇](https://www.fsc.gov.tw/uploaddowndoc?file=publicizeinfo%2F202109241416010.pdf&filedisplay=%E9%8A%80%E8%A1%8C%E7%AF%87.pdf&flag=doc)
- [勞動部：勞動基準法權益簡介](https://www.mol.gov.tw/1607/28162/28166/28168/28170/28989/)
- [勞動部勞動法令查詢系統：勞動基準法第2條](https://laws.mol.gov.tw/FLAW/PrintFLAWDOC01.aspx?flno=2&id=FL014930)
- [衛生福利部：關懷e起來—社會安全網](https://ecare.mohw.gov.tw/)
- [OHCHR：What are Human Rights?](https://bangkok.ohchr.org/what-are-human-rights)
- [法務部：民法第153條等契約條文](https://mojlaw.moj.gov.tw/LawContent.aspx?LSID=FL001351&TypeSort=2&lawNumber=153)
- [臺灣臺南地方檢察署：契約成立，並非均須書面](https://www.tnc.moj.gov.tw/media/129001/312151730401.pdf)
- [法務部：刑法第1條（現行及歷史法條）](https://mojlaw.moj.gov.tw/LawContentExtentHistory.aspx?LSID=fl001424&LawNo=1)
- [司法院：刑事程序](https://www.judicial.gov.tw/tw/cp-81-57046-5ef7d-1.html)
- [司法院：民事調解](https://www.judicial.gov.tw/tw/cp-1448-56928-185b3-1.html)
- [法務部：行政程序法](https://mojlaw.moj.gov.tw/LawContent.aspx?LSID=fl000632&TypeSort=2&lawNumber=1)
- [司法院：行政訴訟](https://www.judicial.gov.tw/tw/cp-85-349539-37538-1.html)
- [司法院：少年事件處理法特色](https://www.judicial.gov.tw/tw/cp-96-58176-56f63-1.html)
- [智慧財產局：認識專利](https://www.tipo.gov.tw/public/Attachment/7128851674.pdf)
- [智慧財產局：電子郵件1140804](https://www.tipo.gov.tw/tw/copyright/692-57499.html)
- [智慧財產局：電子郵件950502](https://www1.tipo.gov.tw/copyright-tw/cp-407-851753-96c12-301.html)
- [United Nations：The 17 Goals](https://sdgs.un.org/goals)
- [UN Sustainable Development Group：How we work](https://unsdg.un.org/about/how-we-work)
- [臺史博典藏網：臺南警察署相片](https://collections.nmth.gov.tw/CollectionContent.aspx?a=132&rno=2017.015.0120.0069)
- [立法院民主議政園區：臺灣議會設置請願運動1921－1934年](https://daap.ly.gov.tw/tw/daap/125-3993.html)
- [臺史博典藏網：臺灣製糖廠原料採取區域圖](https://collections.nmth.gov.tw/CollectionContent.aspx?a=132&rno=2004.028.1324)
- [臺史博：從甜味看歷史](https://the.nmth.gov.tw/nmth/zh-TW/Resource/Detail/dd70e3f6-6abd-46ef-b861-cb93c699df60)
- [臺史博典藏網：公學校高等科地理書卷一](https://collections.nmth.gov.tw/CollectionContent.aspx?RNO=2012.003.0006&a=132)
- [臺史博典藏網：陳麟瘧疾防制作業表彰功勞獎狀](https://collections.nmth.gov.tw/CollectionContent.aspx?RNO=2016.013.0018&a=132)
- [臺灣音聲100年：文化協會的歌聲](https://audio.nmth.gov.tw/research/%E6%97%A5%E6%B2%BB%E6%99%82%E6%9C%9F%E7%A4%BE%E6%9C%83%E6%AD%8C%E7%9A%84%E5%86%8D%E7%8F%BE%EF%BC%9A%E3%80%8C%E6%96%87%E5%8C%96%E5%8D%94%E6%9C%83%E7%9A%84%E6%AD%8C%E8%81%B2%E3%80%8D%E5%90%88%E5%94%B1/)
- [國家人權記憶庫：二二八事件空間資料](https://memory.nhrm.gov.tw/TopicExploration/LocationSpace/Detail/105?viewType=indexByList)
- [國家人權記憶庫：戒嚴體制](https://memory.nhrm.gov.tw/NormalNode/Detail/33?MenuNode=13)
- [總統府：總統直選30週年系列活動](https://www.president.gov.tw/News/40029)
- [Office of the Historian：The Taiwan Straits Crises](https://history.state.gov/milestones/1953-1960/taiwan-strait-crises)
- [United Nations：1971 UN Yearbook](https://digitallibrary.un.org/record/859579/files/1122290-EN.pdf)
- [Office of the Historian：China Policy, 1977–1980](https://history.state.gov//milestones/1977-1980/china-policy)
- [行政院珍貴史料：耕者有其田政策](https://history.ey.gov.tw/Items/%E9%99%B3%E8%AA%A0%E9%99%A2%E9%95%B7%E6%8E%A5%E5%8F%97%E6%B0%91%E7%9C%BE%E7%8D%BB%E6%97%97%E6%84%9F%E8%AC%9D%E3%80%8C%E8%80%95%E8%80%85%E6%9C%89%E5%85%B6%E7%94%B0%E3%80%8D%E6%94%BF%E7%AD%96/)
- [檔案支援教學網：民國34年至70年臺灣經濟發展](https://art.archives.gov.tw/tw/art/370.html)
- [Office of the Historian：The Chinese Revolution of 1911](https://history.state.gov//milestones/1899-1913/chinese-rev)
- [U.S. Department of State：United States Relations with China, 1900–1949（歷史頁搜尋摘要）](https://2001-2009.state.gov/r/pa/ho/pubs/fs/90689.htm)
- [國家科學及技術委員會人文沙龍：五四與新文化相關介紹](https://web.nstc.gov.tw/Humanitiessalon/2021/2019-2.htm)
- [Office of the Historian：The Chinese Revolution of 1949](https://history.state.gov//milestones/1945-1952/chinese-rev)
- [Smithsonian National Postal Museum：Pacific Exchange Resources](https://postalmuseum.si.edu/exhibition/pacific-exchange-china-and-us-mail/resources)
- [中國政府網：關於建國以來黨的若干歷史問題的決議](https://big5.www.gov.cn/gate/big5/www.gov.cn/test/2008-06/23/content_1024934_3.htm)
- [中國教育部：中共中央關於黨的百年奮鬥重大成就和歷史經驗的決議](https://www.moe.gov.cn/jyb_xwfb/s6052/moe_838/202111/t20211116_580248.html)
- [Office of the Historian：Tiananmen Square, 1989](https://history.state.gov/milestones/1989-1992/tiananmen-square)
- [Office of the Historian：Decolonization of Asia and Africa, 1945–1960](https://history.state.gov/milestones/1945-1952/asia-and-africa)
- [ASEAN：History—The Founding of ASEAN](https://asean.org/the-founding-of-asean/)
- [Library of Congress：Germany Country Profile](https://tile.loc.gov/storage-services/master/frd/copr/Germany.pdf)
- [UK Parliament：The Reform Act 1832](https://www.parliament.uk/about/living-heritage/evolutionofparliament/houseofcommons/reformacts/overview/reformact1832/)
- [Imperial War Museums：The outbreak of the First World War（英國網頁典藏版）](https://tnaqa.mirrorweb.com/ukgwa/20260803133323mp_/https%3A/www.iwm.org.uk/history/first-world-war/outbreak)
- [United States Holocaust Memorial Museum：Great Depression](https://encyclopedia.ushmm.org/content/en/article/the-great-depression)
- [United States Holocaust Memorial Museum：What conditions, ideologies, and ideas made the Holocaust possible?](https://encyclopedia.ushmm.org/content/en/question/what-conditions-and-ideas-made-the-holocaust-possible)
- [United Nations：History of the United Nations](https://www.un.org/en/about-us/history-of-the-un)
- [教育部：特殊教育法修法之推動歷程](https://history.moe.gov.tw/Policy/Detail/f6f2343d-6735-4847-ad97-33e152670bb7)
- [教育部：特殊教育課程教材教法及評量實施辦法](https://edu.law.moe.gov.tw/LawContent.aspx?id=FL009140&media=print)
- [世界衛生組織：Stress（2026年3月30日問答）](https://www.who.int/news-room/questions-and-answers/item/stress)
- [美國教育科學研究院：Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/wwc/PracticeGuide/1)
