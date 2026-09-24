/* Seeded practice engine. Pure functions; no network, DOM, or eval. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PracticeV2=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION='1.3.1', APP='jh-study-practice';
const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const clean=x=>String(x).normalize('NFKC').trim();
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.codePointAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(36);};
function rng(seed){let x=parseInt(hash(seed),36)>>>0;return()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
function shuffle(xs,r){const a=xs.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const integer=(r,a,b)=>Math.floor(r()*(b-a+1))+a;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const lcm=(a,b)=>Math.abs(a*b)/gcd(a,b);
const fraction=(a,b)=>{if(b===0)throw Error('zero denominator');const d=gcd(a,b),sign=b<0?-1:1;return b/d===sign?String(sign*a/d):`${sign*a/d}/${sign*b/d}`;};
const fmt=n=>String(Object.is(n,-0)?0:n);
function numeric(question,answer,explanation,params,unit=''){
 if(!Number.isFinite(answer))throw Error('nonfinite');
 const correct=fmt(answer)+unit;
 return {question,correct,wrongs:[answer+1,answer-1,answer+2].map(x=>fmt(x)+unit),explanation,params};
}
const M={
 integer:r=>{const a=integer(r,-30,30),b=integer(r,-30,30);return numeric(`${a}＋（${b}）＝？`,a+b,`合併正負數：${a}＋（${b}）＝${a+b}。`,{a,b});},
 lcm:r=>{const a=integer(r,2,15),b=integer(r,2,15),v=lcm(a,b);return numeric(`${a}與${b}的最小公倍數是多少？`,v,`最小公倍數＝兩數乘積÷最大公因數＝${a*b}÷${gcd(a,b)}＝${v}。`,{a,b});},
 fraction:r=>{const a=integer(r,1,9),b=integer(r,2,12),c=integer(r,1,9);return{question:`${a}/${b}＋${c}/${b}＝？（選最簡表示）`,correct:fraction(a+c,b),wrongs:[fraction(a+c+1,b),fraction(a+c+2,b),fraction(a+c-1,b)],explanation:`同分母分數相加，分母不變，分子相加後約分得${fraction(a+c,b)}。`,params:{a,b,c}};},
 powers:r=>{const a=integer(r,2,6),b=integer(r,2,4);return numeric(`${a}的${b}次方是多少？`,a**b,`把${a}連乘${b}次，得到${a**b}。`,{a,b});},
 expression:r=>{const a=integer(r,-9,9),b=integer(r,1,9),c=integer(r,1,8);return numeric(`若x＝${c}，${a}x＋${b}的值是多少？`,a*c+b,`代入x＝${c}，計算${a}×${c}＋${b}＝${a*c+b}。`,{a,b,c});},
 linear:r=>{const a=integer(r,2,9),b=integer(r,1,15),x=integer(r,-10,10),c=a*x+b;return numeric(`解方程式${a}x＋${b}＝${c}，x＝？`,x,`兩邊減${b}，再除以${a}，x＝${x}。`,{a,b,c});},
 system:r=>{const x=integer(r,1,15),y=integer(r,1,15);return numeric(`若x＋y＝${x+y}，x−y＝${x-y}，則x＝？`,x,`兩式相加：2x＝${2*x}，所以x＝${x}。`,{sum:x+y,diff:x-y});},
 ratio:r=>{const a=integer(r,2,8),b=integer(r,2,8),n=integer(r,2,12);return numeric(`甲：乙＝${a}：${b}。甲為${a*n}，乙是多少？`,b*n,`同乘${n}：乙＝${b}×${n}＝${b*n}。`,{a,b,n});},
 inverse:r=>{const a=integer(r,2,12),b=integer(r,2,12),c=integer(r,2,5);return numeric(`x與y成反比。x＝${a}時y＝${b*c}；x＝${a*c}時y＝？`,b,`xy固定為${a*b*c}，所以y＝${a*b*c}÷${a*c}＝${b}。`,{a,b,c});},
 inequality:r=>{const a=integer(r,2,9),b=integer(r,1,9),x=integer(r,1,12);return{question:`${a}x＋${b}＜${a*x+b}，解為？`,correct:`x＜${x}`,wrongs:[`x＞${x}`,`x＜${x+1}`,`x＞${x+1}`],explanation:`減去${b}再除以正數${a}，不等號方向不變，得x＜${x}。`,params:{a,b,x}};},
 coordinate:r=>{const x=integer(r,1,15),y=integer(r,1,15);return numeric(`點P（${x}，−${y}）到x軸的距離是多少？`,y,`到x軸的距離為縱座標絕對值，等於${y}。`,{x,y});},
 mean:r=>{const a=integer(r,5,20),b=integer(r,1,4);return numeric(`${a-b}、${a}、${a+b}的平均數是多少？`,a,`總和${a*3}除以3，得到${a}。`,{a,b});},
 'square-coeff':r=>{const a=integer(r,2,15);return numeric(`展開（x＋${a}）²，x的一次項係數是多少？`,2*a,`（x＋a）²＝x²＋2ax＋a²，因此係數為${2*a}。`,{a});},
 'poly-constant':r=>{const a=integer(r,1,9),b=integer(r,1,12);return numeric(`（x＋${a}）（x＋${b}）展開後，常數項是多少？`,a*b,`常數項來自${a}×${b}＝${a*b}。`,{a,b});},
 radical:r=>{const a=integer(r,2,20);return numeric(`√${a*a}＝？（算術平方根）`,a,`${a}為非負數且${a}²＝${a*a}。`,{square:a*a});},
 pythagoras:r=>{const k=integer(r,1,12);return numeric(`直角三角形兩直角邊長${3*k}、${4*k}，斜邊多長？`,5*k,`依畢氏定理：√（${3*k}²＋${4*k}²）＝${5*k}。`,{a:3*k,b:4*k});},
 factor:r=>{const a=integer(r,1,12),b=integer(r,1,12);return numeric(`x²＋${a+b}x＋${a*b}＝（x＋${a}）（x＋k），k＝？`,b,`常數乘積${a}k＝${a*b}，且和為${a+b}，故k＝${b}。`,{a,b});},
 roots:r=>{const a=integer(r,1,15),b=a+integer(r,1,10);return{question:`（x−${a}）（x−${b}）＝0的完整解集合為何？`,correct:`{${a}, ${b}}`,wrongs:[`{${-b}, ${-a}}`,`{${a}, ${b+1}}`,`{${a+1}, ${b+1}}`],explanation:`零乘積性質：x−${a}＝0或x−${b}＝0，因此完整解為${a}、${b}。`,params:{a,b}};},
 sequence:r=>{const a=integer(r,1,15),d=integer(r,1,8),n=integer(r,3,12);return numeric(`等差數列首項${a}、公差${d}，第${n}項是多少？`,a+(n-1)*d,`aₙ＝a₁＋（n−1）d＝${a}＋${n-1}×${d}＝${a+(n-1)*d}。`,{a,d,n});},
 series:r=>{const a=integer(r,1,10),d=integer(r,1,6),n=integer(r,2,10),v=n*(2*a+(n-1)*d)/2;return numeric(`等差數列首項${a}、公差${d}，前${n}項和？`,v,`末項${a+(n-1)*d}，和＝項數×（首項＋末項）÷2＝${v}。`,{a,d,n});},
 function:r=>{const a=integer(r,1,8),b=integer(r,1,10),x=integer(r,-10,10);return numeric(`一次函數y＝${a}x＋${b}，x＝${x}時y＝？`,a*x+b,`代入計算：${a}×${x}＋${b}＝${a*x+b}。`,{a,b,x});},
 triangle:r=>{const a=integer(r,20,70),b=integer(r,20,70);return numeric(`三角形兩內角為${a}°、${b}°，第三內角？`,180-a-b,`三角形內角和180°，所以180−${a}−${b}＝${180-a-b}°。`,{a,b},'°');},
 parallelogram:r=>{const a=integer(r,35,140);return numeric(`平行四邊形一內角為${a}°，相鄰內角是多少？`,180-a,`相鄰內角互補，180−${a}＝${180-a}°。`,{a},'°');},
 similarity:r=>{const a=integer(r,2,9),b=integer(r,2,10);return numeric(`相似形長度放大${a}倍，原本長${b}cm的對應邊變成？`,a*b,`長度比為${a}，對應邊＝${b}×${a}＝${a*b}cm。`,{a,b},'cm');},
 'area-ratio':r=>{const k=integer(r,2,12);return numeric(`兩相似圖形的長度比為1：${k}，面積比為1：多少？`,k*k,`面積比為長度比的平方，所以1：${k*k}。`,{k});},
 circumference:r=>{const a=integer(r,2,20);return numeric(`圓半徑${a}cm，圓周長是kπ cm，k＝？`,2*a,`圓周長2πr＝${2*a}π cm，因此k＝${2*a}。`,{r:a});},
 inscribed:r=>{const a=integer(r,15,150);return numeric(`同弧所對圓心角${2*a}°，圓周角是多少？`,a,`同弧圓周角是圓心角一半，${2*a}÷2＝${a}°。`,{central:2*a},'°');},
 tangent:r=>{const k=integer(r,1,10);return numeric(`圓外點到圓心距離${5*k}，半徑${3*k}，切線段長？`,4*k,`切線垂直切點半徑，以畢氏定理√（${5*k}²−${3*k}²）＝${4*k}。`,{d:5*k,r:3*k});},
 vertex:r=>{const h=integer(r,-10,10),k=integer(r,-10,10);return numeric(`y＝（x−（${h}））²＋（${k}），頂點的x座標是？`,h,`頂點式y＝（x−h）²＋k的頂點為（h,k），故x座標${h}。`,{h,k});},
 'quadratic-min':r=>{const a=integer(r,1,6),h=integer(r,-8,8),k=integer(r,-15,15);return numeric(`y＝${a}（x−（${h}））²＋（${k}），最小值為何？`,k,`平方項非負且係數正，x＝${h}時平方項為0，因此最小值${k}。`,{a,h,k});},
 volume:r=>{const a=integer(r,2,12),b=integer(r,2,12),c=integer(r,2,12);return numeric(`長方體長${a}cm、寬${b}cm、高${c}cm，體積？`,a*b*c,`體積＝${a}×${b}×${c}＝${a*b*c}cm³。`,{a,b,c},'cm³');},
 surface:r=>{const a=integer(r,2,15);return numeric(`正方體邊長${a}cm，表面積是多少？`,6*a*a,`6個正方形面，每面${a*a}cm²，總面積${6*a*a}cm²。`,{a},'cm²');},
 probability:r=>{const a=integer(r,1,8),b=integer(r,2,9),n=a+b;return{question:`袋中${a}顆紅球、${b}顆藍球，每顆等機率取到。取1顆是紅球的機率？`,correct:fraction(a,n),wrongs:[fraction(a+1,n),fraction(a-1,n),fraction(a,n+1)],explanation:`有利結果${a}顆，全部${n}顆，機率${fraction(a,n)}。`,params:{a,b}};},
 median:r=>{const a=integer(r,5,40),d=integer(r,1,4);return numeric(`數據${a+2*d}、${a-d}、${a}、${a+d}、${a-2*d}的中位數？`,a,`由小到大排序後中間第3個數是${a}。`,{a,d});}
};
const S={
 microscope:r=>{const a=[5,10,15][integer(r,0,2)],b=[4,10,20,40][integer(r,0,3)];return numeric(`目鏡${a}倍、物鏡${b}倍，總放大倍率？`,a*b,`倍率相乘：${a}×${b}＝${a*b}倍。`,{a,b},'倍');},
 inheritance:r=>{const n=integer(r,5,25)*4;return numeric(`完全顯性單基因模型Aa×Aa，共${n}個子代，aa的理論期望數？（非保證實際數）`,n/4,`aa機率1/4，理論期望${n}×1/4＝${n/4}。`,{n},'個');},
 density:r=>{const v=integer(r,2,12),d=integer(r,1,9);return numeric(`物體質量${d*v}g、體積${v}cm³，密度？`,d,`密度＝${d*v}÷${v}＝${d}g/cm³。`,{mass:d*v,volume:v},'g/cm³');},
 atoms:r=>{const n=integer(r,2,30);return numeric(`${n}個H₂O分子共有多少個原子？`,3*n,`每個水分子3個原子，${n}×3＝${3*n}。`,{n},'個');},
 wave:r=>{const f=integer(r,2,20),w=integer(r,2,12);return numeric(`波頻率${f}Hz、波長${w}m，波速？`,f*w,`波速＝頻率×波長＝${f*w}m/s。`,{f,w},'m/s');},
 reflection:r=>{const a=integer(r,1,89);return numeric(`相對法線的入射角${a}°，反射角？`,a,`反射角等於相對法線的入射角${a}°。`,{a},'°');},
 heat:r=>{const m=integer(r,2,12),c=integer(r,1,5),d=integer(r,2,10);return numeric(`無相變化，比熱${c}J/(g·°C)、質量${m}g、升溫${d}°C，吸熱量？`,m*c*d,`Q＝mcΔT＝${m}×${c}×${d}＝${m*c*d}J。`,{m,c,d},'J');},
 mass:r=>{const a=integer(r,10,80),b=integer(r,10,80);return numeric(`封閉系統中${a}g與${b}g物質完全反應，全部產物總質量？`,a+b,`質量守恆：全部產物＝${a}＋${b}＝${a+b}g。`,{a,b},'g');},
 concentration:r=>{const c=integer(r,2,30),n=integer(r,1,8);return numeric(`${c*n}g溶質配成${100*n}g溶液，質量百分濃度？`,c,`溶質÷溶液×100%＝${c*n}÷${100*n}×100%＝${c}%。`,{solute:c*n,total:100*n},'%');},
 pressure:r=>{const a=integer(r,2,12),p=integer(r,2,40);return numeric(`垂直作用力${a*p}N作用在${a}m²，平均壓力？`,p,`P＝F/A＝${a*p}÷${a}＝${p}Pa。`,{f:a*p,a},'Pa');},
 speed:r=>{const t=integer(r,2,30),v=integer(r,2,20);return numeric(`總路程${t*v}m，總時間${t}s，平均速率？`,v,`總路程÷總時間＝${t*v}÷${t}＝${v}m/s。`,{d:t*v,t},'m/s');},
 newton:r=>{const m=integer(r,2,15),a=integer(r,1,12);return numeric(`固定質量${m}kg，受合力${m*a}N，加速度？`,a,`a＝F/m＝${m*a}÷${m}＝${a}m/s²。`,{m,f:m*a},'m/s²');},
 work:r=>{const f=integer(r,2,30),d=integer(r,2,20);return numeric(`力${f}N與位移${d}m同方向，作功？`,f*d,`W＝Fd＝${f}×${d}＝${f*d}J。`,{f,d},'J');},
 power:r=>{const t=integer(r,2,30),p=integer(r,2,50);return numeric(`${t}s內轉換${t*p}J能量，平均功率？`,p,`P＝能量/時間＝${t*p}/${t}＝${p}W。`,{t,w:t*p},'W');},
 ohm:r=>{const r0=integer(r,2,20),i=integer(r,1,10);return numeric(`歐姆電阻${r0}Ω，兩端電壓${r0*i}V，電流？`,i,`I＝V/R＝${r0*i}÷${r0}＝${i}A。`,{r:r0,v:r0*i},'A');},
 'electric-energy':r=>{const p=integer(r,1,8),t=integer(r,1,12);return numeric(`${p}kW電器使用${t}小時，消耗電能？`,p*t,`電能＝功率×時間＝${p}×${t}＝${p*t}kWh。`,{p,t},'kWh');}
};
function english(tag,r){
 const names=['Amy','Ben','Cindy','David','Emma','Frank','Grace','Henry','Ivy','Jack','Kelly','Leo','Mia','Nora','Owen','Peter'];
 const n=names[integer(r,0,names.length-1)],obj=['a notebook','a map','a storybook','an umbrella'][integer(r,0,3)];
 const cases={
 be:[`${n} ___ a student. 選正確be動詞。`,'is',['are','am','be'],'單數第三人稱搭配is。'],
 plural:[`There are two ___ on ${n}'s desk.`,'boxes',['box','boxs','a box'],'two後接複數，box的複數為boxes。'],
 possessive:[`${n} is a boy. This is ___ bag.`,'his',['he','him','himself'],'名詞bag前用所有格his。'],
 demonstrative:[`These ___ ${n}'s books.`,'are',['is','am','be'],'these是複數，搭配are。'],
 can:[`${n} can ___ very well.`,'swim',['swims','swimming','swam'],'助動詞can後接原形動詞。'],
 wh:[`「___ is ${n}?」答句：「In the library.」`,'Where',['Who','When','Why'],'答句提供地點，問詞用Where。'],
 do:[`___ ${n} walk to school every day?`,'Does',['Do','Is','Are'],'現在簡單式，第三人稱單數用Does發問。'],
 continuous:[`請用現在進行式：${n} ___ a book now.`,'is reading',['read yesterday','reads every day','was read'],'現在進行式＝am/is/are＋V-ing。'],
 frequency:[`${n} always ___ breakfast at home.`,'eats',['eat','eating','to eat'],'一般現在式第三人稱單數用eats。'],
 quantity:[`How ___ water does ${n} need?`,'much',['many','a few','several'],'water在此不可數，搭配much。'],
 time:[`${n} gets up ___ seven o’clock.`,'at',['on','in','to'],'明確時刻前通常用at。'],
 past:[`請用過去簡單式：${n} ___ to the park yesterday.`,'went',['go','goes','going'],'go的過去式為went。'],
 did:[`Did ${n} ___ the room yesterday?`,'clean',['cleaned','cleans','cleaning'],'Did後接原形動詞clean。'],
 'past-continuous':[ `請用過去進行式：${n} ___ dinner at six yesterday.`,'was cooking',['cooks','is cook','has cook'],'過去進行式＝was/were＋V-ing。'],
 because:[`${n} stayed home ___ it was raining.`,'because',['although','unless','so that'],'前後為原因說明，用because。'],
 gerund:[`${n} enjoys ___.`,'reading',['read','to read','reads'],'enjoy後接V-ing。'],
 comparative:[`${n}'s bag is ___ than this one. (heavy)`,'heavier',['heavy','heaviest','more heavier'],'heavy比較級為heavier，不重複加more。'],
 superlative:[`${n} is the ___ student in the group. (tall)`,'tallest',['taller','tall','more tall'],'群體中最高使用最高級tallest。'],
 future:[`${n} will buy ${obj}. will後動詞buy使用哪種形式？`,'原形',['過去式','過去分詞','V-ing'],'will後接原形動詞。'],
 ditransitive:[`${n} gave ${obj} ___ me.`,'to',['at','of','about'],'give物品to某人。'],
 linking:[`${n}'s idea sounds ___.`,'good',['wellly','a well','goodly'],'sound在此為連綴動詞，接形容詞good。'],
 perfect:[`請用現在完成式：${n} ___ the homework.`,'has finished',['finish','finishing','has finish'],'現在完成式＝has/have＋過去分詞。'],
 passive:[`請用過去被動式：The letter ___ by ${n} yesterday.`,'was written',['wrote','is writing','was wrote'],'過去被動式＝was/were＋過去分詞written。'],
 relative:[`The student ___ sits next to ${n} is my friend.`,'who',['which','where','when'],'先行詞是人且關係詞作主詞，用who。'],
 embedded:[`Do you know where ${n} ___?`,'lives',['does live','live does','living'],'間接問句使用主詞＋動詞的陳述語序。'],
 participles:[`${n} felt ___ after the long walk. (tire)`,'tired',['tiring','tire','tires'],'人的感受用tired。'],
 conditional:[`一般條件句：If it rains tomorrow, ${n} ___ at home.`,'will stay',['would stayed','will stayed','staying'],'if子句用現在式表未來，主要子句可用will＋原形。'],
 tag:[`${n} is a student, ___?`,'isn’t '+(n==='Ben'?'he':'she'),['doesn’t it','is they','did it'],'肯定陳述搭配否定附加問句，代詞依題目人物慣用指稱。'],
 both:[`Both ${n} and I ___ ready.`,'are',['is','am','be'],'both A and B為複數主詞，用are。']
 };
 // Avoid assuming gender from names in tag questions: use an explicit subject.
 if(tag==='tag')cases.tag=[`She is ${n}'s teacher, ___?`,'isn’t she',['is she','does she','did she'],'肯定句is搭配否定附加問句isn’t she。'];
 const c=cases[tag];return c?{question:c[0],correct:c[1],wrongs:c[2],explanation:c[3],params:{name:n,object:obj}}:null;
}
function generator(u,tag){if(u.subject==='math')return M[tag];if(u.subject==='science')return S[tag];if(u.subject==='english')return r=>english(tag,r);return null;}
function available(u){return (u.quiz||[]).filter(q=>{const g=generator(u,q.template);return g&&g(rng('probe'))!==null;});}
function candidate(u,base,seed,index,kind){
 let raw,params={};
 if(kind==='static')raw={question:base.question,correct:base.options.find(o=>o.id===base.answer).text,wrongs:base.options.filter(o=>o.id!==base.answer).map(o=>o.text),explanation:base.explanation||base.options.find(o=>o.id===base.answer).explanation};
 else{const gen=generator(u,base.template);if(!gen)throw Error('missing generator');raw=gen(rng(`${seed}/${u.id}/${base.id}/${index}`));if(!raw)throw Error('generator unavailable');params=raw.params;}
 const options=shuffle([raw.correct,...raw.wrongs],rng(`${seed}/options/${u.id}/${base.id}/${index}`)).map((text,i)=>({id:'abcd'[i],text:String(text)}));
 const id=`${u.id}/${kind}/${base.id}/${hash(seed)}/${index}`;
 const result={id,unitId:u.id,templateId:base.id,tag:base.template||base.concept,concept:base.concept,kind,question:raw.question,options,answer:options.find(o=>o.text===String(raw.correct)).id,explanation:raw.explanation,params,provenance:{seed,index,kind,version:VERSION},sources:base.sources||[]};
 if(!validateQuestion(result))throw Error('invalid question '+id);
 return result;
}
function generate(D,cfg){
 if(!plain(cfg))throw Error('需要指定範圍');
 const seed=String(cfg.seed??'');if(!seed||seed.length>80)throw Error('種子需1至80個字元');
 if(!Number.isInteger(cfg.count)||cfg.count<1||cfg.count>20)throw Error('題數需1至20');
 let us;
 if(cfg.unitId)us=D.units.filter(u=>u.id===cfg.unitId);
 else{if(![7,8,9].includes(cfg.grade)||![1,2].includes(cfg.semester)||!D.subjects.some(s=>s.id===cfg.subject))throw Error('無效年級、學期或科目');us=D.units.filter(u=>u.grade===cfg.grade&&u.semester===cfg.semester&&u.subject===cfg.subject&&u.status==='published');}
 if(!us.length)throw Error('此範圍尚無教材');
 const r=rng(seed+'/deck'),pool=[];
 for(const u of us){for(const b of u.quiz)pool.push(candidate(u,b,seed,0,'static'));const gs=available(u);for(let i=0;i<Math.max(48,cfg.count*5)&&gs.length;i++){const b=gs[i%gs.length];pool.push(candidate(u,b,seed,i+1,'generated'));}}
 const seen=new Set(),out=[];
 for(const q of shuffle(pool,r)){const stem=clean(q.question);if(seen.has(stem))continue;seen.add(stem);out.push(q);if(out.length===cfg.count)break;}
 return {version:VERSION,seed,requested:cfg.count,unitIds:us.map(u=>u.id),questions:out,limited:out.length<cfg.count};
}
function validateQuestion(q){return !!(plain(q)&&typeof q.id==='string'&&typeof q.unitId==='string'&&typeof q.question==='string'&&q.question.length&&typeof q.explanation==='string'&&Array.isArray(q.options)&&q.options.length===4&&q.options.every(o=>plain(o)&&typeof o.id==='string'&&typeof o.text==='string'&&o.text.trim())&&new Set(q.options.map(o=>clean(o.text))).size===4&&new Set(q.options.map(o=>o.id)).size===4&&q.options.filter(o=>o.id===q.answer).length===1&&!/NaN|undefined|Infinity/.test(JSON.stringify(q)));}
function newState(){return{app:APP,schema:3,version:VERSION,answers:{},mistakes:[],history:[],conceptStats:{}};}
function migrateState(s){
 if(!plain(s)||s.app!==APP)return s;
 if(s.schema===2){return{...s,schema:3,version:VERSION,mistakes:[],conceptStats:{}};}
 return s;
}
function conceptKey(q){return q.unitId+'#'+(q.concept||q.tag||q.templateId);}
function weakness(state,q){const x=(state.conceptStats||{})[conceptKey(q)]||{right:0,wrong:0};return x.wrong*3-Math.min(x.right,3);}
function examGenerate(D,cfg,state){
 if(!plain(cfg)||!Array.isArray(cfg.unitIds)||!cfg.unitIds.length)throw Error('段考至少選一個章節');
 const ids=[...new Set(cfg.unitIds)].filter(id=>D.units.some(u=>u.id===id));if(ids.length!==new Set(cfg.unitIds).size)throw Error('段考章節範圍無效');
 const count=cfg.count,seed=String(cfg.seed||'');if(!Number.isInteger(count)||count<1||count>40||!seed)throw Error('段考題數或種子無效');
 const per=Math.max(1,Math.ceil(count/ids.length)),pool=[];
 for(const id of ids){const d=generate(D,{unitId:id,count:Math.min(20,per+3),seed:seed+'/'+id});pool.push(...d.questions);}
 const r=rng(seed+'/exam'),seen=new Set(),out=[];for(const q of shuffle(pool,r).sort((a,b)=>weakness(state||newState(),b)-weakness(state||newState(),a))){if(seen.has(clean(q.question)))continue;seen.add(clean(q.question));out.push(q);if(out.length===count)break;}
 return{version:VERSION,seed,requested:count,unitIds:ids,questions:out,limited:out.length<count,exam:true};
}
function adaptiveGenerate(D,cfg,state){
 const base=generate(D,cfg),stats=state?.conceptStats||{};
 if(!Object.keys(stats).length)return base;
 const ranked=base.questions.slice().sort((a,b)=>weakness(state,b)-weakness(state,a));
 return {...base,questions:ranked,adaptive:true};
}
function record(state,q,answer){
 state=migrateState(state);
 if(!validateQuestion(q)||!q.options.some(o=>o.id===answer))throw Error('作答格式錯誤');
 const mistakes=state.mistakes.filter(x=>x.q.id!==q.id),right=answer===q.answer;
 if(!right)mistakes.push({q:JSON.parse(JSON.stringify(q)),selected:answer});
 const key=conceptKey(q),prev=state.conceptStats[key]||{right:0,wrong:0,last:null};
 const conceptStats={...state.conceptStats,[key]:{right:prev.right+(right?1:0),wrong:prev.wrong+(right?0:1),last:right?'right':'wrong'}};
 return {...state,answers:{...state.answers,[q.id]:answer},mistakes:mistakes.slice(-200),conceptStats};
}
function score(questions,answers){let answered=0,correct=0;for(const q of questions){const a=answers[q.id];if(!q.options.some(o=>o.id===a))continue;answered++;if(a===q.answer)correct++;}return{answered,correct,total:questions.length};}
function validateState(s,D){
 s=migrateState(s);
 if(!plain(s)||s.app!==APP||s.schema!==3||s.version!==VERSION||!plain(s.answers)||!plain(s.conceptStats)||!Array.isArray(s.mistakes)||!Array.isArray(s.history)||s.mistakes.length>200||s.history.length>50||Object.keys(s.answers).length>10000||Object.keys(s.conceptStats).length>1000)throw Error('備份格式或版本不符');
 for(const [k,v] of Object.entries(s.conceptStats))if(!/^[-a-z0-9]+#[a-z0-9]+$/i.test(k)||!plain(v)||!Number.isInteger(v.right)||!Number.isInteger(v.wrong)||v.right<0||v.wrong<0||v.right+v.wrong>10000||!['right','wrong',null].includes(v.last))throw Error('弱點統計無效');
 for(const [key,value]of Object.entries(s.answers))if(!/^[a-z0-9/-]+$/.test(key)||!['a','b','c','d'].includes(value))throw Error('作答資料無效');
 const ids=new Set();for(const x of s.mistakes){if(!plain(x)||!validateQuestion(x.q)||ids.has(x.q.id)||!x.q.options.some(o=>o.id===x.selected)||x.selected===x.q.answer)throw Error('錯題格式無效');ids.add(x.q.id);const u=D.units.find(u=>u.id===x.q.unitId),p=x.q.provenance;if(!u||!plain(p)||p.version!==VERSION||typeof p.seed!=='string'||!p.seed||p.seed.length>80||!Number.isInteger(p.index)||p.index<0||p.index>500||!['static','generated'].includes(p.kind))throw Error('錯題來源無效');const b=u.quiz.find(b=>b.id===x.q.templateId);if(!b||JSON.stringify(candidate(u,b,p.seed,p.index,p.kind))!==JSON.stringify(x.q))throw Error('錯題快照已更動或版本不符');}
 for(const h of s.history)if(!plain(h)||typeof h.date!=='string'||!Number.isInteger(h.correct)||!Number.isInteger(h.total)||h.correct<0||h.correct>h.total||h.total>20)throw Error('紀錄無效');
 return JSON.parse(JSON.stringify(s));
}
return{VERSION,generate,examGenerate,adaptiveGenerate,validateQuestion,newState,migrateState,record,score,validateState,available,candidate,conceptKey,weakness};
});
