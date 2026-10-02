#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function build(input,options){
 let html=require('./build-complete.cjs').build(input);
 const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)],dataScript=scripts.find(s=>s[1].includes('window.STUDY_DATA =')),box={window:{}};
 vm.runInNewContext(dataScript[1],box);
 const D=require('./modules/all-subjects-completion.cjs').enrich(JSON.parse(JSON.stringify(box.window.STUDY_DATA)),options);
 const core={module:{exports:{}},URL};vm.runInNewContext(scripts.find(s=>s[1].includes('Shared pure functions'))[1],core);
 const errors=core.module.exports.validateData(D);if(errors.length)throw Error(errors.join('\n'));
 html=html.replace(dataScript[0],()=>'<script>\nwindow.STUDY_DATA = '+JSON.stringify(D).replace(/</g,'\\u003c')+';\n</script>');
 for(const s of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
 return html;
}
if(require.main===module){
 const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node build-all-subjects.cjs source.html output.html');
 const html=build(fs.readFileSync(input,'utf8'));fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,html);
 console.log('Built V2.1.0 original worked examples, expanded question banks, and grade-nine language guides.');
}
module.exports={build};
