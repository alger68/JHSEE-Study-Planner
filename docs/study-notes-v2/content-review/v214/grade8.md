# Grade 8 reading recovery audit — 2026-10-03

Result: all eight requested rows now contain verified, source-based teaching and answered reading checks. Five 真平 rows are `edition-verified`; three 康軒 rows are `original-verified`. The eight-row replacement array is `grade8-updates.json`. No repository files were changed by this agent.

## Source and classification methods

### 真平: exact 114 edition

The publisher's public materials page, https://jen-pin.com.tw/material.php , requests the public resource catalog at:

https://jp-resource.jen-pin.com.tw/api/dir?dir=data%2F%E5%9C%8B%E4%B8%AD%E9%96%A9%E5%8D%97%E8%AA%9E

The catalog's `[PPT]教學PPT` → `第4冊` entries were marked public. Its public `x-dir.js` describes the public download endpoint. The five PPTX files were downloaded through that endpoint without authentication, unpacked as OOXML, and their actual slide text read. Each file's first slide explicitly names the `(114)` version. The lesson title, author where applicable, textbook page numbers, and complete selected body/grammar table were read from subsequent slides. Root independently checked the version, title, author and selected content, including all grammar-II relations.

The exact school/term binding is the 永和國中114學年度八年級第二學期閩南語課程計畫, https://drive.google.com/file/d/1SlSYyVz6pPRmd_uzdRQZtzlxj1ZTDtby/view . The saved `completion-v213-work/reading-pdfs/course8tw2.pdf` first page identifies 114, grade 8, second semester; page 3 lists the matching sequence and all five titles. The plan alone was insufficient earlier. Combined with the newly retrieved publisher `(114)` B4 bodies it supports `edition-verified`.

### 康軒: official lesson bodies, exact paper edition not claimed

The public publisher page https://digitalmaster.knsh.com.tw/all/video/j/mandarin_page.html loads https://digitalmaster.knsh.com.tw/all/video/public/j_mandarin.xml . The downloaded official XML explicitly identifies `8下`, `L03` / `L08` / `L09`, the exact titles, the corresponding author-introduction names, and `課文動畫` links. Relevant XML entries were preserved in `grade8-source/knsh-course-provenance.json`.

Each publicly embedded animation was read through its publicly served Vimeo player configuration and HLS media. These are the actual public links embedded by the publisher, not a searched repost. No login, subscription, paywall, or private endpoint was bypassed. Frames were sampled at 1 fps, subtitle regions were OCRed with the official Tesseract traditional-Chinese model, and decisive body passages were visually verified against the images. OCR errors were not copied into the replacement rows. The companion `課文朗讀` videos have static title cards, so they were explicitly rejected as visual proof of the body; all new teaching uses the animations' visible subtitles.

The school plan https://drive.google.com/file/d/1KoGsZK-xIl3dKiGMpeuXmwzo4XejycGN/view binds these three titles to 114下 grade 8, but the public video directory does not explicitly label the animations 114 or reproduce the paper page layout. Therefore the three rows use `original-verified`, with clear paper-edition and page-number limits. They do not claim a complete published original book chapter or exact 114 paper collation.

## Eight outcomes

### 1. 114-2-8-chinese/第三課 — 情緒是生命的指引

- Status: `original-verified`. Author: 留佩萱.
- Evidence: Official video 1152123875; 400 seconds; body captions approximately 00:09–06:38.
- Verified scope and authored result: Read the opening emotional preference question, the eight-year-old child anecdote, the two-folder misconception, the body-feeling examples, school/friendship examples, and the closing sailing/weather analogy. New teaching and checks address the misconception, the source of useful signals, and the distinction between emotion arising and choosing a response. The school example is explicitly present in this publisher animation; no workplace example was substituted from a different original-book excerpt.
- Scratch review material: `grade8-source/emotion-verify-1.jpg`, `grade8-source/emotion-verify-2.jpg`.
- Direct primary source: https://player.vimeo.com/video/1152123875

### 2. 114-2-8-chinese/第八課 — 成功是失敗之母

- Status: `original-verified`. Author: 黃永武.
- Evidence: Official video 1152126414; 253 seconds; body captions approximately 00:07–04:10.
- Verified scope and authored result: Read the common maxim and its reversal, Qin and Tang examples, Tang Minghuang’s early governance versus later self-satisfaction, and the general warning to successful people. The final condition about preventing the harmful attitudes is visible and supplies the answer that failure is not inevitable. The row is 黃永武’s lesson; no 高希均 same-title text was used. The historical passages are described as the article’s examples, not independently re-established historical claims.
- Scratch review material: `grade8-source/success-verify-1.jpg`, `grade8-source/success-verify-2.jpg`, `grade8-source/success-verify-3.jpg`.
- Direct primary source: https://player.vimeo.com/video/1152126414

### 3. 114-2-8-chinese/第九課 — 罐頭由來

- Status: `original-verified`. Author: 周惠民.
- Evidence: Official video 1147919285; 317 seconds; body captions approximately 00:04–05:17.
- Verified scope and authored result: Read convenience/food-trade opening, military provision rationale, literary and historical illustrations, 阿佩特’s glass-container preservation, 杜蘭’s metal-container development, opening difficulties and 業慈’s tool, and later materials/uses. New notes track need → preservation → container → usability and distinguish literary example from technological explanation. The row does not import the Pasteur/lead-poisoning material found in other circulating versions, because that material is not in this checked animation. No food-preservation procedure is republished.
- Scratch review material: `grade8-source/cans-verify-1.jpg`, `grade8-source/cans-verify-2.jpg`, `grade8-source/cans-verify-3.jpg`.
- Direct primary source: https://player.vimeo.com/video/1147919285

### 4. 114-2-8-taiwanese/第一課 — 人生逐位會開花

- Status: `edition-verified`. Author: 路寒袖.
- Evidence: 真平 PPT `(114)20260312`; author slide 8; complete four-stanza body slides 11–14, textbook pp. 8–9.
- Verified scope and authored result: 路寒袖 attribution and full selected poem verified. Teaching addresses the light/dawn sequence, hyperbolic evaluation of life without ideals, and the movement from natural images to life experience. Three answered checks point to the relevant stanza pages. The poem itself is not reproduced.
- Scratch review material: `grade8-source/B4-1.pptx`, `grade8-source/B4-1.json`.
- Direct primary source: https://jp-resource.jen-pin.com.tw/api/download?path=data%2F%E5%9C%8B%E4%B8%AD%E9%96%A9%E5%8D%97%E8%AA%9E%2F%5BPPT%5D%E6%95%99%E5%AD%B8PPT%2F%E7%AC%AC4%E5%86%8A%2F%E5%9C%8B%E4%B8%AD%E9%96%A9%E5%8D%97%E8%AA%9EB4%E7%AC%AC1%E8%AA%B2.pptx

### 5. 114-2-8-taiwanese/第二課 — 固定心態，沿路阻礙；成長心態，一生無礙

- Status: `edition-verified`. Author: 楊斯棓.
- Evidence: 真平 PPT `(114)20260121`; author 楊斯棓 slide 4; complete body slides 7–21, textbook pp. 20–23.
- Verified scope and authored result: Author and lesson body verified. Read school history and examination-performance framing, challenge to score-determines-life reasoning, fixed/growth mindset comparison, and entrepreneur example including social contribution. Teaching explicitly distinguishes an illustrative personal example from an inevitable causal rule.
- Scratch review material: `grade8-source/B4-2.pptx`, `grade8-source/B4-2.json`.
- Direct primary source: https://jp-resource.jen-pin.com.tw/api/download?path=data%2F%E5%9C%8B%E4%B8%AD%E9%96%A9%E5%8D%97%E8%AA%9E%2F%5BPPT%5D%E6%95%99%E5%AD%B8PPT%2F%E7%AC%AC4%E5%86%8A%2F%E5%9C%8B%E4%B8%AD%E9%96%A9%E5%8D%97%E8%AA%9EB4%E7%AC%AC2%E8%AA%B2.pptx

### 6. 114-2-8-taiwanese/語文天地一 — 連接詞(一)

- Status: `edition-verified`. Author: not attributed (grammar unit).
- Evidence: 真平 PPT `(114)20251210`; definition slide 4; entire six-expression grammar table slides 5–6, textbook p. 32.
- Verified scope and authored result: All four relations covered: 並列 (佮; 那…那…), 選擇 (抑是), 因果 (因為; 就按呢), 先後 (紲落去). Four teaching entries and four answered checks cover all four relations. The short 臺語 examples are newly authored, clearly labeled, and use the publisher-verified connector spelling and function; they are not presented as textbook quotations.
- Scratch review material: `grade8-source/B4-5.pptx`, `grade8-source/B4-5.json`.
- Direct primary source: https://jp-resource.jen-pin.com.tw/api/download?path=data%2F%E5%9C%8B%E4%B8%AD%E9%96%A9%E5%8D%97%E8%AA%9E%2F%5BPPT%5D%E6%95%99%E5%AD%B8PPT%2F%E7%AC%AC4%E5%86%8A%2F%E5%9C%8B%E4%B8%AD%E9%96%A9%E5%8D%97%E8%AA%9EB4%E8%AA%9E%E6%96%87%E5%A4%A9%E5%9C%B0%28%E4%B8%80%29.pptx

### 7. 114-2-8-taiwanese/第四課 — 太平洋的風

- Status: `edition-verified`. Author: 周蘇宗.
- Evidence: 真平 PPT `(114)20260519`; author 周蘇宗 slide 4; complete six-stanza body slides 7–12, textbook pp. 54–57.
- Verified scope and authored result: Verified landscape route and domestic sensory images, personification and recurring wind perspective, and final sense of belonging. The original publisher 香海文化 also publicly provides the whole matching poem in its book preview at https://gandhabooks.com/?product=hong-tshue . This is 周蘇宗’s Taroko-context poem, not 胡德夫’s song. No full poem or song lyrics are reproduced.
- Scratch review material: `grade8-source/B4-4.pptx`, `grade8-source/B4-4.json`.
- Direct primary source: https://jp-resource.jen-pin.com.tw/api/download?path=data%2F%E5%9C%8B%E4%B8%AD%E9%96%A9%E5%8D%97%E8%AA%9E%2F%5BPPT%5D%E6%95%99%E5%AD%B8PPT%2F%E7%AC%AC4%E5%86%8A%2F%E5%9C%8B%E4%B8%AD%E9%96%A9%E5%8D%97%E8%AA%9EB4%E7%AC%AC4%E8%AA%B2.pptx

### 8. 114-2-8-taiwanese/語文天地二 — 連接詞(二)

- Status: `edition-verified`. Author: not attributed (grammar unit).
- Evidence: 真平 PPT `(114)20251202`; definition slide 4; entire eight-expression grammar table slides 5–8, textbook p. 68.
- Verified scope and authored result: All four relations covered: 漸進 (愈; 毋但), 轉折 (毋過; 猶是), 假設 (假使; 準做), 條件 (毋才; 毋管). Four teaching entries and four answered checks cover all four relations. The row says 本課條件類 where relevant: 毋才 is preserved within the publisher’s classification rather than silently reclassified. Original examples distinguish its specific antecedent from 毋管’s unrestricted condition.
- Scratch review material: `grade8-source/B4-6.pptx`, `grade8-source/B4-6.json`.
- Direct primary source: https://jp-resource.jen-pin.com.tw/api/download?path=data%2F%E5%9C%8B%E4%B8%AD%E9%96%A9%E5%8D%97%E8%AA%9E%2F%5BPPT%5D%E6%95%99%E5%AD%B8PPT%2F%E7%AC%AC4%E5%86%8A%2F%E5%9C%8B%E4%B8%AD%E9%96%A9%E5%8D%97%E8%AA%9EB4%E8%AA%9E%E6%96%87%E5%A4%A9%E5%9C%B0%28%E4%BA%8C%29.pptx

## Verification and delivery limits

- Exactly the eight input section IDs are retained, with no additions or removals.
- Every row has at least three teaching entries and three answered reading checks; the two grammar units each have four of each. Total: 26 teaching entries and 26 checks.
- Every check has a prompt, concrete answer, and a locatable source basis (slide/textbook page or approximate animation timestamp). The approximate video times correspond to 1-fps visual samples and are not frame-accurate timecodes.
- All requested grammar relations are covered. Grammar terminology and connector forms come from the actual publisher tables, so dictionary-only fallback was not needed.
- Source-needed placeholders have been replaced. The five exact edition rows carry explicit publisher `(114)` evidence. The three official-body rows retain the precise edition limitation in `scopeNote`.
- Traditional Chinese copyediting includes removal of isolated simplified 課 forms. No full source text, poem, lyrics, transcript, PPTX, or media has been added to the application; the app gets only original explanations, checks, and source links.
- Large source files, OCR, and visual sheets remain scratch-only review inputs and should not be copied into the repository. The only integration deliverables are the eight-row JSON and this audit.

## Download checksums

PPTX SHA-256 values identify the exact publisher versions examined:


- `B4-1.pptx`: `cb7a9a6e10dc13a6ad4e5bfebd95d52e672139ab63df9c64ea3a4fea45ac38ec` (75,035,184 bytes).

- `B4-2.pptx`: `553cda6a80e040065f225677aacc22ac46229ebec377cad19b7c5b194e7ecd6b` (57,317,126 bytes).

- `B4-4.pptx`: `1e37c20d83aaf3890c20aebc6cf800fce361f991fa5c0b1a32be3d8295e7c85b` (67,754,387 bytes).

- `B4-5.pptx`: `ec8d6502aac4b48309989b2fe97fbb57be7bb943b051afc0bb1ad3f05a1c0a20` (18,589,902 bytes).

- `B4-6.pptx`: `2aaaeefe0f5b214eac732adb5f3bf4cf7808c1cc3d964b0f02253cf0a06d2a19` (18,691,242 bytes).
