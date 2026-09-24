'use strict';
// Compile the approved home/catalog separation into the existing single router.
function replace(s,a,b){if(!s.includes(a))throw Error('Navigation integration anchor missing: '+a.slice(0,70));return s.replace(a,b);}
function academy(s){
 const a=s.indexOf(' function home(subject,params){'),b=s.indexOf(' function versions()',a);
 if(a<0||b<0)throw Error('Legacy catalog renderer missing');
 s=s.slice(0,a)+` const browsing=window.LibraryNavigation.create({D,C,unitCard,getLegacy,getPractice:()=>state});
 function home(){return browsing.home();}
 function library(params){return browsing.library(params);}
`+s.slice(b);
 s=replace(s,"navigate('#/home?'+p);return;","navigate('#/library?'+p);return;");
 s=replace(s,"   case 'new':fresh();break;",`   case 'home-wrong':{
    const qs=state.mistakes.slice(-20).map(x=>x.q);if(!qs.length){toast('目前沒有已存錯題。');break;}
    const p=new URLSearchParams({unit:qs[0].unitId,n:8,seed:'home-wrong-'+Date.now()});
    const signature=JSON.stringify(configuration(p));
    sessions.set(signature,{deck:{questions:qs,seed:'錯題原題快照',requested:qs.length,limited:false},selections:{},submitted:false,retry:true});
    liveSig='';navigate('#/practice?'+p);break;
   }
   case 'new':fresh();break;`);
 s=replace(s,'return{home,versions,practice,examPage,backupPanel,click,change};','return{home,library,visitUnit:browsing.visitUnit,unitBreadcrumb:browsing.unitBreadcrumb,versions,practice,examPage,backupPanel,click,change};');
 return s;
}
function app(s){
 s=replace(s,'  function home(subject) { return window.CourseChaptersUI.banner(D,C)+academy.home(subject,route.params); }','  function home(subject) { return subject?academy.library(new URLSearchParams({s:subject.id})):academy.home(); }');
 s=replace(s,'    return result;','    return window.LibraryNavigation.normalizeRoute(result);');
 s=replace(s,'    route=routeFromHash(); navigation();',`    route=routeFromHash();
    if(route.canonicalHash&&location.hash!==route.canonicalHash){try{history.replaceState(null,'',route.canonicalHash);}catch(_){}}
    navigation();`);
 s=replace(s,"    else if(route.view==='unit'&&u) main.innerHTML=unitPage(u);","    else if(route.view==='unit'&&u) {academy.visitUnit(u,route.tab);main.innerHTML=unitPage(u);}\n    else if(route.view==='library') main.innerHTML=academy.library(route.params);");
 s=replace(s,'<a class="back-link" href="#/subject/${E(u.subject)}">← 回到${E(subjectName(u))}學習目錄</a>','${academy.unitBreadcrumb(u)}');
 s=replace(s,'學習首頁</a>','學習首頁</a><a class="nav-item${active(\'library\')}" href="#/library"><span class="nav-icon">▦</span>教材目錄</a>');
 s=replace(s,"(route.view === 'unit' || route.view === 'subject') && (getUnit()?.subject === s.id || route.id === s.id)","(route.view === 'unit' || route.view === 'library') && (getUnit()?.subject === s.id || route.params.get('s') === s.id)");
 s=replace(s,"[['home','⌂','首頁'],['practice','✎','練習'],['review','☆','複習'],['search','⌕','搜尋'],['help','☷','備份']]","[['home','⌂','首頁'],['library','▦','目錄'],['practice','✎','練習'],['review','☆','複習'],['help','☷','備份']]");
 s=replace(s,'const labels = {chapters:',"const labels = {library:'教材目錄',chapters:");
 return s;
}
module.exports={academy,app};
