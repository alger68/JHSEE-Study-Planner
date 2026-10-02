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
 const x=api().enrich({units:[],atlas:{exams}}).examSolutions;
 A.equal(x.paperCount,15);A.equal(x.totalItems,798);
 A.deepEqual(Object.fromEntries(x.papers.filter(p=>p.round>1).map(p=>[p.subject+'-'+p.round,p.totalItems])),{'biology-2':50,'biology-3':50,'chinese-2':68,'chinese-3':65,'english-2':63,'english-3':63,'math-2':33,'math-3':33,'social-2':54,'social-3':54});
 A.deepEqual(x.papers.map(p=>p.sourceId).sort(),exams.filter(p=>p.grade===7).map(p=>p.sourceId).sort());
 for(const [round,key] of [[2,'CBCABBDBDBCCADCDCABADADAD'],[3,'BCDABCDBAABABCDCDDABCCDAB']]){const p=x.papers.find(p=>p.subject==='math'&&p.round===round);A.equal(p.items.slice(0,25).map(q=>q.officialAnswer[0]).join(''),key);}
 for(const round of [1,2,3])A.deepEqual(x.papers.filter(p=>p.round===round).map(p=>p.subject).sort(),['biology','chinese','english','math','social']);
 const ids=x.papers.flatMap(p=>p.items.map(q=>q.id));A.equal(new Set(ids).size,ids.length,'distinct IDs across all papers');
 for(const p of x.papers.filter(p=>p.subject==='english'))A.ok(p.items.filter(q=>/音檔/.test(q.note||'')).length>=20,'listening lacks source audio');
});
