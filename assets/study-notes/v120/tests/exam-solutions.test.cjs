'use strict';
const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source={sourceId:'sample-paper',sha256:'a'.repeat(64),title:'Sample historical paper',pdfPages:3,year:114,term:2,grade:7,round:1,subject:'math',subjectName:'數學',url:'https://drive.google.com/file/d/sample-paper/view'};
const item={id:'choice-1',section:'choice',label:'選擇1',sourcePages:[1],answerPage:3,topic:'方程式判斷',answer:'B',officialAnswer:'B',status:'verified',steps:['確認未知數的個數。','逐项比較等式中的次數。'],pitfall:'有代數式不一定有方程式。'};
const fixture=()=>({schema:1,sourceId:source.sourceId,sourceSha256:source.sha256,title:source.title,checked:'2026-10-02',coverageNote:'題號1；示範驗證資料。',sections:[{id:'choice',title:'選擇題'}],items:[structuredClone(item)]});
function api(){const file=path.join(__dirname,'../modules/exam-solutions.cjs');A.ok(fs.existsSync(file),'source-validated solution module is required');return require(file);}
test('solution enrichment preserves curriculum and derives honest issue counts',()=>{
 const D={units:[{id:'old',quiz:[{id:'q1',answer:'b'}]}],atlas:{exams:[source]}},before=structuredClone(D),p=fixture();
 p.items.push({...item,id:'choice-2',label:'選擇2',status:'disputed',note:'原題條件不足。'},{...item,id:'choice-3',label:'選擇3',status:'limited',note:'未取得音檔。'});
 const x=api().enrich(D,[p]);A.deepEqual(D,before);A.deepEqual(x.units,D.units);A.equal(x.examSolutions.totalItems,3);A.equal(x.examSolutions.verifiedItems,1);A.equal(x.examSolutions.disputedItems,1);A.equal(x.examSolutions.limitedItems,1);A.equal(x.examSolutions.papers[0].year,114);A.equal(x.examSolutions.papers[0].term,2);
});
test('mismatched official source identity, title and PDF hash are rejected',()=>{
 for(const change of [{sourceId:'unknown'},{sourceSha256:'b'.repeat(64)},{title:'wrong paper'}])A.throws(()=>api().enrich({units:[],atlas:{exams:[source]}},[{...fixture(),...change}]),/source/i);
});
test('duplicate papers or item labels cannot inflate coverage',()=>{
 const p=fixture();A.throws(()=>api().enrich({units:[],atlas:{exams:[source]}},[p,p]),/duplicate/i);
 for(const other of [{...item},{...item,id:'second'}]){const v=fixture();v.items.push(other);A.throws(()=>api().validatePaper(v,source),/duplicate/i);}
});
test('out-of-range pages and unknown sections cannot become evidence',()=>{
 for(const change of [{sourcePages:[0]},{sourcePages:[4]},{sourcePages:['1']},{sourcePages:[]},{answerPage:4},{section:'unknown'}]){const p=fixture();Object.assign(p.items[0],change);A.throws(()=>api().validatePaper(p,source),/page|section/i);}
});
test('each solution requires original steps, answer and explicit limitation reason',()=>{
 for(const change of [{steps:['one']},{steps:['a','']},{officialAnswer:''},{answer:''},{status:'unrecognized'},{status:'limited'},{status:'disputed'}]){const p=fixture();Object.assign(p.items[0],change);A.throws(()=>api().validatePaper(p,source),/solution|status|note/i);}
});
test('empty papers and unused or duplicate section definitions fail rather than showing complete coverage',()=>{
 for(const change of [{items:[]},{sections:[]},{sections:[{id:'choice',title:'選擇'},{id:'choice',title:'重複'}]},{sections:[{id:'choice',title:'選擇'},{id:'unused',title:'空白'}]}])A.throws(()=>api().validatePaper({...fixture(),...change},source),/section|solution/i);
});
test('published five-paper pack accounts for every independently inventoried subquestion and preserves source keys',()=>{
 const rows=require('../modules/atlas-sources.json').exams,exams=rows.map(r=>({sourceId:r[0],grade:r[1],round:r[2],subject:r[3],subjectName:r[4],pdfPages:r[5],sha256:r[6],title:r[7],year:114,term:2,url:'https://drive.google.com/file/d/'+r[0]+'/view'}));
 const oldPapers=['biology','chinese','english','math','social'].map(s=>require('../modules/exam-solutions/'+s+'.json'));
 const x=api().enrich({units:[],atlas:{exams}},oldPapers).examSolutions;
 A.deepEqual(x.papers.map(p=>[p.subject,p.totalItems]),[['biology',50],['chinese',67],['english',63],['math',31],['social',54]]);
 A.equal(x.totalItems,265);A.equal(x.verifiedItems,237);A.equal(x.disputedItems,7);A.equal(x.limitedItems,21);
 const english=x.papers.find(p=>p.subject==='english');A.ok(english.items.slice(0,20).every(q=>q.status==='limited'&&/音檔/.test(q.note)));
 const math=x.papers.find(p=>p.subject==='math');A.deepEqual(math.items.slice(0,22).map(q=>q.officialAnswer[0]),['B','D','A','C','C','C','A','C','C','A','B','D','B','D','A','B','A','D','B','A','B','C']);
 for(const p of x.papers)A.ok(p.grade===7&&p.round===1&&p.year===114&&p.term===2);
});

test('all fifteen grade-seven historical papers have distinct source-specific explanations',()=>{
 const rows=require('../modules/atlas-sources.json').exams,exams=rows.map(r=>({sourceId:r[0],grade:r[1],round:r[2],subject:r[3],subjectName:r[4],pdfPages:r[5],sha256:r[6],title:r[7],year:114,term:2,url:'https://drive.google.com/file/d/'+r[0]+'/view'}));
 const gradeSeven=fs.readdirSync(path.join(__dirname,'../modules/exam-solutions')).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(__dirname,'../modules/exam-solutions',f),'utf8'))).filter(p=>exams.find(s=>s.sourceId===p.sourceId)?.grade===7);
 const x=api().enrich({units:[],atlas:{exams}},gradeSeven).examSolutions;
 A.equal(x.paperCount,15);A.equal(x.totalItems,798);
 A.deepEqual(Object.fromEntries(x.papers.filter(p=>p.round>1).map(p=>[p.subject+'-'+p.round,p.totalItems])),{'biology-2':50,'biology-3':50,'chinese-2':68,'chinese-3':65,'english-2':63,'english-3':63,'math-2':33,'math-3':33,'social-2':54,'social-3':54});
 A.deepEqual(x.papers.map(p=>p.sourceId).sort(),exams.filter(p=>p.grade===7).map(p=>p.sourceId).sort());
 for(const [round,key] of [[2,'CBCABBDBDBCCADCDCABADADAD'],[3,'BCDABCDBAABABCDCDDABCCDAB']]){const p=x.papers.find(p=>p.subject==='math'&&p.round===round);A.equal(p.items.slice(0,25).map(q=>q.officialAnswer[0]).join(''),key);}
 for(const round of [1,2,3])A.deepEqual(x.papers.filter(p=>p.round===round).map(p=>p.subject).sort(),['biology','chinese','english','math','social']);
 const ids=x.papers.flatMap(p=>p.items.map(q=>q.id));A.equal(new Set(ids).size,ids.length,'distinct IDs across all papers');
 for(const p of x.papers.filter(p=>p.subject==='english'))A.ok(p.items.filter(q=>/音檔/.test(q.note||'')).length>=20,'listening lacks source audio');
});

test('every available historical paper has exactly one guide across all three grades',()=>{
 const rows=require('../modules/atlas-sources.json').exams,exams=rows.map(r=>({sourceId:r[0],grade:r[1],round:r[2],subject:r[3],subjectName:r[4],pdfPages:r[5],sha256:r[6],title:r[7],year:114,term:2,url:'https://drive.google.com/file/d/'+r[0]+'/view'}));
 const x=api().enrich({units:[],atlas:{exams}}).examSolutions;
 A.equal(x.paperCount,40);
 A.deepEqual(x.papers.map(p=>p.sourceId).sort(),exams.map(p=>p.sourceId).sort());
 A.deepEqual([7,8,9].map(g=>x.papers.filter(p=>p.grade===g).length),[15,15,10]);
 const ids=x.papers.flatMap(p=>p.items.map(q=>q.id));A.equal(new Set(ids).size,ids.length);
});

test('the fifteen published guides retain every existing answer and explanation byte-for-byte',()=>{
 const expected={"biology-7-r2.json": "fc749a316ab8f16c51002dab99a1ccd576786fab84fe8f060f833d715782506d", "biology-7-r3.json": "9aadc0df7fd5efb7cf16168077261f4002a1595edcf684365bb3e77af781d04c", "biology.json": "ccadfad71d3d445d59115603e356e1557864c7969a954988b9de69b7ecf721cd", "chinese-7-r2.json": "85af9b16e40fcc07272f86b356dbdef082aa78a283a779076b58ddcc1ebf9e95", "chinese-7-r3.json": "66f38fbf7b9970e55d1503c0f0633074b544e2c3bc6365a0fee13e6b808f6bac", "chinese.json": "f77314f3c372d62d37adba994efb352214e055eb570ad50c184d896f3de81025", "english-7-r2.json": "f493ff722a96d040e99aee5d045d0d0b6c0993d5ac5f750f27d44d6734a3a717", "english-7-r3.json": "8c5b6340b1a7e691f7d64e4fa9fb445e2ecad50104594a5515f8ec98062c8798", "english.json": "e6b8219dae69a50a47ce72ac02dc0e4d5ef9d4fc8398535c11a4476e1382b738", "math-7-r2.json": "472899d8aa27c4182c968b1bc39544f5e2665626e86f24f554d3624c30642ab8", "math-7-r3.json": "dc3980850adaf85f20d0383f1df27c963c7669181a0571f069dc0987bb9059e5", "math.json": "4e41734e8fa708dddfe017a4a200fe1d94620902125b53adfa04a6ae6e37f673", "social-7-r2.json": "aa53a44593f079f8f8e5d64c14b5e8710d2bc8e218073554ba9d84dd504e09e3", "social-7-r3.json": "085af0c06c2c0ac24d7520f93618e28ac57b6acc9d0952e9716a39d6914ab31b", "social.json": "51d26b94af92dc1b7a401e76120f62ce6eafa3b2ec26764e0b064507652a6c1d"};
 for(const [file,sha]of Object.entries(expected))A.equal(require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../modules/exam-solutions',file))).digest('hex'),sha,file);
});

test('source overview reports completed paper coverage separately from verification limitations',()=>{
 const p=fixture();p.items.push({...item,id:'issue',label:'選擇2',status:'limited',note:'未取得原始音檔。'});const x=api().enrich({units:[],atlas:{exams:[source],gaps:[{scope:'題解驗證',status:'舊說明'}]}},[p]);
 A.match(x.atlas.gaps[0].status,/1.*1.*份/);A.match(x.atlas.gaps[0].status,/1題核對一致/);A.match(x.atlas.gaps[0].status,/1題核對有限/);
});

// Independent numbered-subpart inventories transcribed from the original PDFs.
// Evidence and separately copied answer keys: docs/study-notes-v2/content-review/v213/.
test('the remaining twenty-five guides cover their independently inventoried question counts and official keys',()=>{
 const expected={
  'chinese-8-r1':70,'chinese-8-r2':68,'chinese-8-r3':68,'chinese-9-r1':50,'chinese-9-r2':36,
  'english-8-r1':69,'english-8-r2':67,'english-8-r3':67,'english-9-r1':62,'english-9-r2':50,
  'math-8-r1':28,'math-8-r2':28,'math-8-r3':30,'math-9-r1':30,'math-9-r2':25,
  'physical-8-r1':45,'physical-8-r2':46,'physical-8-r3':45,'science-9-r1':48,'science-9-r2':36,
  'social-8-r1':54,'social-8-r2':54,'social-8-r3':54,'social-9-r1':54,'social-9-r2':45
 };
 const paper=name=>JSON.parse(fs.readFileSync(path.join(__dirname,'../modules/exam-solutions',name+'.json'),'utf8'));
 for(const [name,n]of Object.entries(expected))A.equal(paper(name).items.length,n,name);
 A.equal(Object.values(expected).reduce((a,b)=>a+b,0),1229);
 const keys={
  'math-8-r1':'DBCABDCCCADD AAADBBB ADCCBB',
  'math-8-r2':'CAABCCBCDBABDDA DBCBDABADC',
  'math-8-r3':'DCADACBACB ADDDACBBAC CBB DCAB',
  'math-9-r1':'AABADBDDCA ACBDD CBBDC ABCC',
  'math-9-r2':'AADCB DABBC DCCD CABDDA ABCBD',
  'english-8-r1':'ACBAB BCBAA CBCCB BABAC BCBAA ACDBC DBDDB AACDC ABDC BDAC BAB ADD DDA CBB',
  'english-8-r2':'BCBAC CBBBC AABAC CCBBA DCDDB ABCAC BABDB ADDDC ADAD CAA BCA BCD BCA BDC',
  'english-8-r3':'BCABC CACAB ABACC BCBCB DBCDD BDABC BCCBC CDDDA AABBB CABDB BCCBA ADD ACD BCD BCA',
  'english-9-r1':'ACBBC ACACB ACABB CBCAA BADBC DADAC CBBAD ACDAB !DAAB CAB CABC CB CD CDB BCD',
  'english-9-r2':'DABBC DCADC BDCBD CDADB ACBDA CBCDA CBACD BACB DACA BDB AD CA',
  'chinese-8-r1':'DACBC AABDB ADBBC CBAAC CDCAC A DCDC ACDDB BDB',
  'chinese-8-r2':'BACCD DBADC DBBBD ADCBA DBDAC DAC CBBAD ABCAC',
  'chinese-8-r3':'ABDBD DACDA BCACD CCABC CBBDD CB DAACA ADBDBC',
  'chinese-9-r1':'ADDBBC DACA BBCDBB CCDC DACCA CBBCA BADCB AB DAD BADDB CACBA',
  'chinese-9-r2':'ADDBCB DCDC DBBAC DB DAC BBCD CABAAD BCAACA',
  'physical-8-r1':'CBABA ADDDD BDCCB BBADB CBCCD DBCDB BDDDA BDDCD ADBBA',
  'physical-8-r2':'ADDCB CDCDD CADCD BDCBC DDADB BBCAB DBCBD BCBCC DCDABA',
  'physical-8-r3':'AABBD CCCAA ACBBA DBCAC AAACB CDCCC ADDBC ADBBD DBBCA',
  'science-9-r1':'DCDBC DCACA CBABD BACDC BCDCD CAAAD ADABB DBBBA AAADDCBB',
  'science-9-r2':'CADCA DDBBA CCBCA ABBAD DBDCA CBDCD ABBCBD',
  'social-8-r1':'BBDCD CDAAB CAACDCBB AACCC DCDDB CABABDCD BCACA CBDCD DCBBCBCA',
  'social-8-r2':'CAABC DDBDC ADCCADBB D!BCC DABAB CABADCCD BBCAB DBCDC ACDDAABC',
  'social-8-r3':'DCBCA DBBAC BDDBAACC CDABD BCBAB CDDDBCAC DCCBB BBBDC CAADBCBD',
  'social-9-r1':'ABACC BBCAC DDDADBBD DBBAA DBDBD CCAADACC CADBC ADBAC CABDCADB',
  'social-9-r2':'CDCDA ADCBB ACBDA DCBDA CBACB ADBCD BACDC BCDAA ABDBC'
 };
 for(const [name,key]of Object.entries(keys)){const expectedKey=key.replace(/\s/g,''),items=paper(name).items,choice=name.startsWith('chinese-8')?items.slice(-expectedKey.length):items.slice(0,expectedKey.length);A.equal(choice.map(q=>q.officialAnswer==='送分'?'!':q.officialAnswer[0]).join(''),expectedKey,name);}
 A.equal(paper('physical-8-r1').items[17].officialAnswer.replace(/[^A-D]/g,''),'ACD');
 A.equal(paper('physical-8-r2').items[37].officialAnswer.replace(/[^A-D]/g,''),'BC');
 A.equal(paper('social-8-r3').items[45].officialAnswer.replace(/[^A-D]/g,''),'CD');
 for(const name of ['english-8-r1','english-8-r2','english-8-r3','english-9-r1'])for(const q of paper(name).items.slice(0,20)){A.equal(q.status,'limited');A.match(q.note,/音檔/);}
 A.ok(paper('science-9-r1').items.every(q=>q.status!=='verified'),'invisible PDF answer letters are not a visibly published answer sheet');
});
