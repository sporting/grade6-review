import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {Window} from 'happy-dom';
const testWindow=new Window({url:'https://example.test/grade6-review/'});
for(const name of ['window','document','localStorage','navigator','HTMLElement','HTMLDialogElement','Node','Event','MouseEvent','MutationObserver','FormData'])Object.defineProperty(globalThis,name,{value:name==='window'?testWindow:(testWindow as any)[name],configurable:true,writable:true});
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

test('手機自動填入未觸發change仍能登入；重開頁面直接進入且不再次驗證',async()=>{
 testWindow.localStorage.clear();testWindow.sessionStorage.clear();testWindow.document.cookie='six-review-access-v1=; Path=/grade6-review/; Max-Age=0';
 const host=testWindow.document.createElement('div');testWindow.document.body.append(host);let root=createRoot(host as any);
 const calls:string[][]=[];let loads=0;
 const verify=async(username:string,password:string)=>{calls.push([username,password]);return username==='family'&&password==='autofilled-password';};
 const loadApp=async()=>{loads++;return ()=>React.createElement('p',null,'已接回練習');};
 try{
  await React.act(async()=>root.render(React.createElement(AccessGate,{verify,loadApp})));
  assert.equal((host.querySelector('[name=username]') as any).value,'family');
  // Browser/password-manager changes the real form value without any React change event.
  (host.querySelector('[name=password]') as any).value=' autofilled-password ';
  await React.act(async()=>{host.querySelector('form')!.dispatchEvent(new testWindow.Event('submit',{bubbles:true,cancelable:true}));});
  assert.deepEqual(calls,[['family','autofilled-password']]);assert.match(host.textContent!,/已接回練習/);
  await React.act(async()=>root.unmount());root=createRoot(host as any);
  await React.act(async()=>root.render(React.createElement(AccessGate,{verify,loadApp})));
  assert.equal(host.querySelector('form'),null);assert.match(host.textContent!,/已接回練習/);assert.equal(calls.length,1);assert.equal(loads,2);
 }finally{await React.act(async()=>root.unmount());host.remove();}
});
