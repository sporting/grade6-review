import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {Window} from 'happy-dom';
const testWindow=new Window({url:'https://example.test/grade6-review/'});
for(const name of ['window','document','localStorage','navigator','HTMLElement','HTMLDialogElement','Node','Event','MouseEvent','MutationObserver'])Object.defineProperty(globalThis,name,{value:name==='window'?testWindow:(testWindow as any)[name],configurable:true,writable:true});
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
const React=await import('react');
const {createRoot}=await import('react-dom/client');
await mkdir(new URL('./.ui-build/',import.meta.url),{recursive:true});
const output=new URL('./.ui-build/access.mjs',import.meta.url);
await build({entryPoints:[fileURLToPath(new URL('../src/AccessGate.tsx',import.meta.url))],outfile:fileURLToPath(output),bundle:true,format:'esm',platform:'node',packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
const {AccessGate}=await import(output.href);

test('實際入口：錯誤登入不載入練習，成功載入，登出不清除進度且能重新登入',async()=>{
 testWindow.localStorage.clear();testWindow.localStorage.setItem('six-review-notebook-v1','saved-progress');
 const host=testWindow.document.createElement('div');testWindow.document.body.append(host);const root=createRoot(host as any);
 let accept=false,loads=0;
 const verify=async()=>accept;
 const loadApp=async()=>{loads++;return function Practice({onLogout}:{onLogout:()=>void}){return React.createElement('button',{onClick:onLogout},'登出測試練習');};};
 const submit=async()=>{await React.act(async()=>{host.querySelector('form')!.dispatchEvent(new testWindow.Event('submit',{bubbles:true,cancelable:true}));});};
 try{
  await React.act(async()=>root.render(React.createElement(AccessGate,{verify,loadApp})));
  assert.equal(loads,0);assert.match(host.textContent!,/六年級複習筆記/);
  await submit();assert.match(host.querySelector('[role=alert]')!.textContent!,/不正確/);assert.equal(loads,0);
  accept=true;await submit();assert.equal(loads,1);assert.match(host.textContent!,/登出測試練習/);
  assert.ok(testWindow.localStorage.getItem('six-review-access-v1'));
  await React.act(async()=>host.querySelector('button')!.click());
  assert.ok(host.querySelector('form'));assert.equal(testWindow.localStorage.getItem('six-review-access-v1'),null);
  assert.equal(testWindow.localStorage.getItem('six-review-notebook-v1'),'saved-progress');
  await submit();assert.equal(loads,2);assert.match(host.textContent!,/登出測試練習/);
 }finally{await React.act(async()=>root.unmount());host.remove();}
});
