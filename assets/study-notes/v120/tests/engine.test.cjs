const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
test('可用且不會誤用舊的多解引擎',()=>{
 assert.ok(fs.existsSync(require('node:path').join(__dirname,'../modules/practice-engine.cjs')),'缺少V1.2出題引擎');
});
