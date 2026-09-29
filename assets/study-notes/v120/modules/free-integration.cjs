'use strict';
// Additive content integration: the original unit objects and question IDs stay unchanged.
// External resources have their own coverage state; they never create local quiz completion.
const clone=o=>JSON.parse(JSON.stringify(o));
const MARK='free-20260930';
function enrich(D){
 if(D.freeResources?.integrationBatch===MARK)return D;
 const history=clone(require('./history114-supplement.json'));
 const health=clone(require('./health114-lessons.json'));
 const metadata=clone(require('./adopted114-courses.json'));
 for(const u of history.units){
  u.legacySupplementId=u.id;u.id=u.id.toLowerCase();u.domain='歷史';
  u.integrationBatch=MARK;u.historicalAdoption=true;u.atlasCourseId='114-1-8-history';
  u.version='1.9.0';u.updated='2026-09-30';
  u.reviewNote='114上學期原課名與來源保留；出版社原計畫未直接標明，不推測。六課精選解說、例題與檢測為本站自編，已整合至本版，不等於課本全文或全部考點。';
 }
 // Balance display positions only for the newly imported history lessons. Option IDs,
 // correct-answer IDs, wording and explanations remain intact.
 history.units.forEach((u,unitIndex)=>u.quiz.forEach((q,questionIndex)=>{
  const position=(unitIndex+questionIndex*3)%q.options.length;
  const correct=q.options.find(o=>o.id===q.answer);
  const distractors=q.options.filter(o=>o.id!==q.answer);
  distractors.splice(position,0,correct);q.options=distractors;
 }));
 for(const u of health)u.domain='健康教育';
 const added=[...history.units,...health];
 const ids=new Set(D.units.map(u=>u.id));
 for(const u of added){if(ids.has(u.id))throw Error('Duplicate unit: '+u.id);ids.add(u.id);}
 D.units.push(...added);
 const sourceIds=new Set(D.sources.map(s=>s.id));
 for(const source of [...history.sources,...clone(require('./integration-support-sources.json'))]){
  if(sourceIds.has(source.id))continue;
  D.sources.push({...source,checked:source.checked||'2026-09-30'});sourceIds.add(source.id);
 }
 for(const c of metadata){
  if(D.atlas.courses.some(old=>old.id===c.id))throw Error('Duplicate course: '+c.id);
  c.sections=added.filter(u=>u.atlasCourseId===c.id).map((u,i)=>({id:c.id+'/'+u.chapter,label:u.chapter,title:u.title,page:2,order:i+1,evidence:[],unitId:u.id,noteStatus:'core-ready',fixedQuestions:u.quiz.length,quality:'精選重點；原創固定題；不是全课本或歷屆原題'.replace('课','課')}));
  c.readySections=c.sections.length;D.atlas.courses.push(c);
 }
 D.atlas.periods.push({id:'114-1',label:'114 上學期（舊年教學補充）'});
 D.atlas.adoptionPolicy={...D.atlas.adoptionPolicy,approved:true,unrestrictedYear:true,requiresContentMatch:true,preserveOriginalMetadata:true,currentYearReplacement:false,note:'舊年可採用，但對應須看篇名、作者／節選或實際概念，不自動宣稱全文相同。'};
 D.atlas.statistics={...D.atlas.statistics,sourceCount:D.atlas.courses.length+D.atlas.exams.length,courseCount:D.atlas.courses.length,examCount:D.atlas.exams.length,locatedCourses:D.atlas.courses.filter(c=>c.sections.length).length,locatedSections:D.atlas.courses.reduce((n,c)=>n+c.sections.length,0)};
 D.atlas.gaps.push({scope:'本次舊年度補充，不代表115新年度來源已找齊',status:'114八上歷史、八上健教、九上健教已有來源與精選教材。115對應文件缺口仍保留；可由年級科目下的舊年補充連結進入，不偷偷改標年份。'});
 D.atlas.notes.push('V1.9新增的免費平台連結獨立計數；頁面文字已查不代表影片已播放，也不代表全部題解已核對。');
 const R=clone(require('./free-resources.json'));
 R.integrationBatch=MARK;R.unitMap={};R.sectionMap={};R.mappingEvidence=[];
 R.status='已整合至本版；外部頁面／課程連結不計本地教材完成';
 R.linkPolicy='僅提供原頁連結，不搬運影片、課本或第三方題庫。不預先載入第三方媒體。需登入／付費或授權例外時以原平台提示為準。';
 const rechecked=new Set(['j-lotus-overview','j-lotus-paragraph','j-lotus-summary','l-night-walk','m-photo','m-transport','m-guard-cells','m-photosynthesis-food','m-colour','m-balance','l-chan-yuan','l-jingkang','l-southern-song','l-exam-system']);
 const junyiLogin=new Set(['j-lotus-overview','j-lotus-paragraph','j-lotus-summary']);
 for(const r of R.resources){
  r.localTeachingComplete=false;r.localTestComplete=false;r.mediaPlaybackTested=false;r.questionAnswersVerified=false;
  r.integrationMode='external-link-only';r.checkedOn='2026-09-30';
  r.verificationStatus=rechecked.has(r.id)?'本輪已讀頁面標題／描述，未播放影片':'沿用先前索引；本輪未逐頁重查';
  r.accessNote=junyiLogin.has(r.id)?'本輪頁面顯示「登入觀看」；免費課程不代表免登入。':(R.platforms.find(p=>p.id===r.platform)?.access||'依原平台提示；部分內容可能需登入。');
  if(r.id==='m-online-safety'){r.verificationStatus='先前索引有此頁；本輪讀取未成功，需重新確認';r.accessNote='保留原頁連結，不宣稱目前影片可播放。';}
  if(r.platform==='phet'){r.licenseReview='本輪授權頁為動態內容，未重新讀得授權全文；僅連結原平台，不重製。';}
 }
 const availableIds=new Set(R.resources.map(r=>r.id));
 function match(courseId,label,expectedTitle,resourceIds,basis){
  const c=D.atlas.courses.find(c=>c.id===courseId),s=c?.sections.find(s=>s.label===label);
  if(!s||s.title!==expectedTitle)throw Error('Resource mapping anchor mismatch: '+courseId+'/'+label);
  for(const id of resourceIds)if(!availableIds.has(id))throw Error('Unknown resource: '+id);
  s.externalResources=[...new Set([...(s.externalResources||[]),...resourceIds])];
  R.sectionMap[s.id]=s.externalResources;
  if(s.unitId)R.unitMap[s.unitId]=[...new Set([...(R.unitMap[s.unitId]||[]),...resourceIds])];
  R.mappingEvidence.push({sectionId:s.id,courseId,title:s.title,resourceIds,basis,matchLevel:'明確篇名或主題補充；未宣稱全文／全部考點相同',checkedOn:'2026-09-30'});
 }
 match('115-1-8-chinese','4','愛蓮說',['j-lotus-overview','j-lotus-paragraph','j-lotus-summary'],'官方課名與影片標題均為愛蓮說；未以影片標題認定現行課本節選逐字相同。');
 match('115-1-7-biology','3-3','植物如何製造養分',['m-photo','m-guard-cells','m-photosynthesis-food'],'平台描述與光合作用、葉片及保衛細胞相關；屬本節主題補充。');
 match('115-1-7-biology','4-1','植物的運輸構造',['m-transport'],'以平台運輸構造描述配對；未依其不完全一致的課綱標籤自動判定。');
 match('115-1-7-biology','4-2','植物體內物質的運輸',['m-transport'],'平台描述含水、養分運輸及蒸散作用；不表示覆蓋整節。');
 match('115-1-9-science','4-1','靜電',['j-static-electricity'],'均一頁面靜電主題候選；本輪未逐支播放。');
 match('115-1-9-science','4-2','電壓',['p-circuit'],'電路互動探究候選，可操作觀察；不把模擬當成已完成本節講義。');
 match('115-1-9-science','4-3','電流',['p-circuit'],'電路互動探究候選，可操作觀察；參數、模型限制依原平台。');
 match('115-1-9-science','4-4','電阻',['p-ohm','p-circuit'],'歐姆定律與電路互動主題；授權與支援條件另看原平台。');
 match('114-2-8-physical','3-2','常見的酸與鹼',['j-acid-base'],'均一酸鹼單元為概念補充；不是南一版逐頁同步。');
 match('114-2-8-physical','4-3','可逆反應與平衡',['j-equilibrium'],'均一可逆反應／平衡主題候選；不代替本節全部教學。');
 match('115-1-7-visual','第3課','色彩百變Show',['m-colour'],'色彩三要素影片可補色彩概念；依本筆授權僅連結原作。');
 match('114-1-8-history','L3','宋元時期的民族互動',['l-chan-yuan','l-jingkang','l-southern-song','l-exam-system'],'原課程包含澶淵之盟、靖康之禍與宋元互動；科舉影片作宋代背景延伸，不錯配到商周至隋唐。');
 for(const [label,title] of [['1-1','飛揚青春擁抱愛'],['1-2','青春愛的練習曲'],['1-3','青春變奏曲']])match('114-1-8-health',label,title,['m-online-safety'],'交友安全為補充候選；此頁本輪讀取失敗，介面保留需再確認提示。');
 R.statistics={platformCount:R.platforms.length,resourceCount:R.resources.length,linkedSectionCount:Object.keys(R.sectionMap).length,linkedLocalUnitCount:Object.keys(R.unitMap).length,recheckedMetadataCount:rechecked.size,mediaPlaybackTested:0};
 D.freeResources=R;D.appVersion='1.9.0';D.updated='2026-09-30';
 D.sourceNotice='146份校方課程／題本來源與29筆免費平台連結分開統計。新增整合六課歷史與16節健康教育；169份本地講義、988道固定題。舊年度保留來源，外部連結不算講義完成；三年全科仍有缺口。';
 D.releaseMeta={version:'1.9.0',integrationBatch:MARK,baseCommit:'ac82a086df0dfbf0045e79681e7529a9dac43f79',baseVersion:'1.8.0',addedLocalUnits:22,addedFixedQuestions:132,previouslyDeliveredHistoryUnits:6,newlyAuthoredHealthUnits:16,deployment:'prepared-not-published'};
 return D;
}
module.exports={enrich};
