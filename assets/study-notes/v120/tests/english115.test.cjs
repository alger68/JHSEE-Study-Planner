const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const input=fs.readFileSync(path.join(root,'../index.html'),'utf8');
function extract(html){
  const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(x=>x[1].includes('window.STUDY_DATA ='));
  const box={window:{}};vm.runInNewContext(script[1],box);
  return JSON.parse(JSON.stringify(box.window.STUDY_DATA));
}
function result(){
  const html=require('../build-english.cjs').build(input);
  return {html,data:extract(html)};
}
test('115-1 English lessons match every school-listed unit in all three grades',()=>{
  const {data}=result();
  const added=data.units.filter(u=>u.id.startsWith('school-en-115-'));
  assert.equal(added.length,22);
  assert.equal(data.units.length,169);
  assert.equal(data.units.reduce((sum,u)=>sum+u.quiz.length,0),988);
  for(const grade of [7,8,9]){
    const course=data.atlas.courses.find(c=>c.id===`115-1-${grade}-english`);
    assert.equal(course.readySections,course.sections.length);
    assert.equal(course.sections.length,{7:7,8:8,9:7}[grade]);
    for(const section of course.sections){
      const note=data.units.find(u=>u.id===section.unitId);
      assert.ok(note,`${grade} ${section.label}`);
      assert.equal(note.title,section.title);
      assert.equal(note.chapter,section.label);
      assert.equal(note.grade,grade);
      assert.equal(note.schoolYear,115);
      assert.equal(note.semester,1);
      assert.equal(note.publisher,course.publisher);
      assert.equal(section.fixedQuestions,6);
      assert.equal(note.quiz.length,6);
      assert.equal(note.concepts.length,3);
      assert.match(note.reviewNote,/本站自編/);
      assert.ok(note.concepts.every(c=>c.body.join('').length>=35));
    }
  }
});
test('new lessons have distinct answer options and explained concept-linked questions',()=>{
  const {data}=result();
  const practice=require('../modules/practice-engine.cjs');
  for(const unit of data.units.filter(u=>u.id.startsWith('school-en-115-'))){
    for(const question of unit.quiz){
      assert.equal(question.options.length,4);
      assert.equal(new Set(question.options.map(o=>o.text)).size,4,`${unit.id}/${question.id}`);
      assert.ok(unit.concepts.some(c=>c.id===question.concept));
      assert.equal(question.options.filter(o=>o.id===question.answer).length,1);
      assert.ok(question.explanation.length>=18);
      assert.ok(practice.validateQuestion(practice.candidate(unit,question,'check',0,'static')));
    }
    const one=practice.generate(data,{unitId:unit.id,count:8,seed:'repeatable'});
    assert.deepEqual(one,practice.generate(data,{unitId:unit.id,count:8,seed:'repeatable'}));
    assert.equal(one.questions.length,6);
    assert.equal(new Set(one.questions.map(q=>q.id)).size,6);
  }
});
test('old lessons and historical school-year evidence remain intact',()=>{
  const old=extract(require('../build-114.cjs').build(input));
  const {data,html}=result();
  for(const unit of old.units)assert.deepEqual(data.units.find(u=>u.id===unit.id),unit);
  for(const course of old.atlas.courses){
    const current=data.atlas.courses.find(c=>c.id===course.id);
    if(course.subject==='english'&&course.year===115)continue;
    assert.deepEqual(current,course);
  }
  assert.equal(data.atlas.statistics.sourceCount,143);
  assert.equal(data.atlas.courses.filter(c=>c.year===114&&c.term===2&&c.subject==='english').every(c=>c.readySections===0),true);
  assert.equal(data.atlas.adoptionPolicy.currentYearReplacement,false);
  assert.equal(data.appVersion,'1.9.0');
  assert.match(html,/教學與測驗地圖/);
  assert.match(html,/const VERSION='1.3.1'/);
});
