import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bank} from '../src/bank.ts';
import {emptyState,begin,answer,finish,score,parseBackup,shortSelection,officialAnswer} from '../src/engine.ts';
const question=bank.find(q=>q.questionId==='hses-math-11321-二、1')!;
test('填答只比對來源答案；接受相等的數字表示但不執行算式',()=>{
 assert.ok(question);assert.equal(officialAnswer(question),'3/32');
 for(const input of ['3/32','３／３２','0.09375',' 3 / 32 '])assert.equal(shortSelection(question,input),'__short_correct');
 for(const input of ['3/0','3÷32','eval(3/32)','3/31'])assert.equal(shortSelection(question,input),'__short_wrong');
 assert.equal(shortSelection(question,'  '),null);
 assert.equal(shortSelection({...question,officialAnswer:'1又1/2'},'1.50'),'__short_correct');
 assert.equal(shortSelection({...question,officialAnswer:'1/2；3/4'},'0.5;0.75'),'__short_correct');
});
test('英文保留大小寫與單字邊界，只容忍空白格式與撇號字形',()=>{
 const q={...question,subject:'英語' as const,officialAnswer:'They’re from Japan.'};
 assert.equal(shortSelection(q,"They're  from Japan."),'__short_correct');
 assert.equal(shortSelection(q,"TheyrefromJapan."),'__short_wrong');
 assert.equal(shortSelection(q,"they're from Japan."),'__short_wrong');
 assert.equal(shortSelection({...q,officialAnswer:'does；do'},'does ; do'),'__short_correct');
});
test('填答確認鎖定、成績與原始輸入可備份還原',()=>{
 let s=begin(emptyState(),[question],'practice','數學',question.unit,'short-restore');
 s=answer(s,'0.09375','select');s=answer(s,s.active!.answers[question.questionId].selectedOptionId,'confirm');
 assert.equal(s.active!.answers[question.questionId].locked,true);
 assert.deepEqual(answer(s,'錯誤','select'),s);
 s=finish(s);assert.equal(score(s.completed[0]).correct,1);assert.equal(s.completed[0].answers[question.questionId].inputText,'0.09375');
 assert.deepEqual(parseBackup(JSON.stringify(s)),s);
});
test('填答錯誤與跳過分開；小測驗可修改暫選而未提前記分',()=>{
 let s=begin(emptyState(),[question],'quiz','數學',question.unit,'short-quiz');
 s=answer(s,'1','select');assert.equal(s.history.length,0);assert.equal(s.review[question.questionId],undefined);
 assert.deepEqual(answer(s,'1','confirm'),s);
 s=answer(s,'3/32','select');s=finish(s);assert.equal(score(s.completed[0]).correct,1);
 let skipped=begin(emptyState(),[question],'practice','數學',question.unit,'short-skipped');
 skipped=answer(skipped,'1','select');skipped=answer(skipped,null,'skip');skipped=finish(skipped);
 assert.equal(skipped.history[0].isCorrect,null);assert.equal(score(skipped.completed[0]).skipped,1);
 assert.deepEqual(parseBackup(JSON.stringify(skipped)),skipped);
});
test('匯入拒絕填答輸入與計分標記不符或竄改來源標準答案',()=>{
 let s=begin(emptyState(),[question],'practice','數學',question.unit,'short-tamper');
 s=answer(s,'3/32','select');s=answer(s,'__short_correct','confirm');s=finish(s);
 const bad=structuredClone(s);bad.completed[0].answers[question.questionId].inputText='7';
 assert.throws(()=>parseBackup(JSON.stringify(bad)));
 const changed=structuredClone(s);changed.completed[0].questions[0].officialAnswer='7';
 assert.throws(()=>parseBackup(JSON.stringify(changed)));
});
