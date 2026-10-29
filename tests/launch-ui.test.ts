import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {Window} from 'happy-dom';
import {emptyState,parseBackup,STORAGE_KEY} from '../src/engine.ts';
const testWindow=new Window({url:'https://example.test/grade6-review/'});
for(const name of ['window','document','localStorage','navigator','HTMLElement','HTMLDialogElement','Node','Event','MouseEvent','KeyboardEvent','MutationObserver'])Object.defineProperty(globalThis,name,{value:name==='window'?testWindow:(testWindow as any)[name],configurable:true,writable:true});
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
const React=await import('react');
const {createRoot}=await import('react-dom/client');
await mkdir(new URL('./.ui-build/',import.meta.url),{recursive:true});
const output=new URL('./.ui-build/app.mjs',import.meta.url);
await build({entryPoints:[fileURLToPath(new URL('../src/main.tsx',import.meta.url))],outfile:fileURLToPath(output),bundle:true,format:'esm',platform:'node',packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
let sequence=0;
async function mount(seed=emptyState()){
 // This storage belongs only to the isolated DOM test, never a real visitor's browser.
 testWindow.localStorage.clear();testWindow.localStorage.setItem(STORAGE_KEY,JSON.stringify(seed));testWindow.document.body.innerHTML='';
 const {App}=await import(output.href+'?scenario='+sequence++);
 const host=testWindow.document.createElement('div');testWindow.document.body.append(host);const root=createRoot(host as any);
 await React.act(async()=>{root.render(React.createElement(App));});
 const click=async(label:string)=>{const button=[...host.querySelectorAll('button')].find(b=>b.textContent?.trim()===label||b.querySelector('strong')?.textContent===label||b.getAttribute('aria-label')===label);assert.ok(button,'Missing button: '+label);await React.act(async()=>{button.click();});};
 return {host,click,state:()=>parseBackup(testWindow.localStorage.getItem(STORAGE_KEY)!),close:async()=>{await React.act(async()=>root.unmount());host.remove();}};
}

test('重新開啟直接接回未完成題目，不先繞回首頁',async()=>{
 const first=await mount();let saved;
 try{await first.click('隨手練10題');saved=first.state();}finally{await first.close();}
 assert.ok(saved?.active);
 const reopened=await mount(saved);try{assert.ok(reopened.host.querySelector('.question-heading'));assert.equal(reopened.state().active!.id,saved.active.id);}finally{await reopened.close();}
});
test('實際React按鈕：隨手練開始、同回合繼續、切換前保存原回合',async()=>{
 const app=await mount();try{
  await app.click('隨手練10題');const first=app.state().active!;assert.equal(first.mode,'quiz');assert.equal(first.questions.length,10);assert.match(first.label!,/^隨手練10題/);assert.ok(app.host.querySelector('.question-heading'));
  await app.click('這個還沒教過');const answers=app.state().active!.answers;
  await app.click('六年級複習筆記首頁');await app.click('隨手練10題');assert.equal(app.state().active!.id,first.id);assert.equal(app.host.querySelector('dialog'),null);assert.ok(app.host.querySelector('.question-heading'));
  await app.click('六年級複習筆記首頁');await app.click('考前必殺');assert.match(app.host.querySelector('dialog')?.textContent??'',/目前有未完成的回合/);assert.equal(app.state().active!.id,first.id);
  await app.click('取消');assert.equal(app.state().active!.id,first.id);
  await app.click('考前必殺');await app.click('保存原回合，開始考前必殺');const next=app.state();assert.notEqual(next.active!.id,first.id);assert.equal(next.active!.mode,'practice');assert.match(next.active!.label!,/^考前必殺/);assert.equal(next.active!.questions.length,10);assert.equal(next.completed.length,1);assert.equal(next.completed[0].id,first.id);assert.deepEqual(next.completed[0].answers,answers);assert.equal(next.history.filter(h=>h.isCorrect===false).length,0);assert.ok(app.host.querySelector('.question-heading'));
 }finally{await app.close();}
});
test('實際React按鈕：沒有舊回合時考前必殺直接啟動',async()=>{const app=await mount();try{await app.click('考前必殺');assert.match(app.state().active!.label!,/^考前必殺/);assert.equal(app.state().active!.questions.length,10);assert.equal(app.state().completed.length,0);assert.ok(app.host.querySelector('.question-heading'));}finally{await app.close();}});
test('實際React按鈕：無可用題時提示取得焦點，保留原紀錄',async()=>{const seed=emptyState();seed.settings.training={subject:'國語',stage:'全部',period:'全部',level:'自動',plans:{國語:'unmapped'},units:{}};const app=await mount(seed);try{await app.click('隨手練10題');assert.equal(app.state().active,null);assert.match(app.host.querySelector('#notice')?.textContent??'',/目前範圍沒有題目/);assert.equal(testWindow.document.activeElement?.id,'notice');await app.click('考前必殺');assert.equal(app.state().active,null);assert.equal(testWindow.document.activeElement?.id,'notice');assert.deepEqual(app.state(),seed);}finally{await app.close();}});
