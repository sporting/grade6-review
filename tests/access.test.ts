import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyAccess,rememberAccess,hasAccess,ACCESS_KEY,ACCESS_TTL,readBrowserAccess,saveBrowserAccess,clearBrowserAccess} from '../src/access.ts';
import type {AccessEnvironment} from '../src/access.ts';
test('簡單入口核對帳密，不接受錯誤帳號或密碼',async()=>{
 const config={username:'family-test',salt:'test-salt',hash:createHash('sha256').update('test-salt\nfamily-test\ntest-password').digest('hex'),version:1};
 assert.equal(await verifyAccess('family-test','test-password',config),true);
 assert.equal(await verifyAccess('wrong','test-password',config),false);
 assert.equal(await verifyAccess('family-test','wrong',config),false);
});

test('localStorage不可用時Cookie仍可記住；重新開啟分頁與登出均正確',()=>{
 let cookie='',lastWrite='';
 const blocked={getItem:()=>{throw Error('blocked');},setItem:()=>{throw Error('blocked');},removeItem:()=>{throw Error('blocked');}} as unknown as Storage;
 const env:AccessEnvironment={local:blocked,path:'/grade6-review/',secure:true,cookie:{read:()=>cookie,write:value=>{lastWrite=value;cookie=value.includes('Max-Age=0')?'':value.split(';')[0];}}};
 const now=1000000;assert.equal(saveBrowserAccess(true,env,now),true);assert.match(lastWrite,/Path=\/grade6-review\//);assert.match(lastWrite,/Secure/);
 assert.equal(readBrowserAccess({...env},now+1000),true);
 assert.equal(readBrowserAccess(env,now+ACCESS_TTL),false);
 clearBrowserAccess(env);assert.equal(readBrowserAccess(env,now),false);
});

test('Cookie不可用仍保存localStorage；兩者皆受限時明確回報且保留本分頁',()=>{
 const map=new Map<string,string>();const sessionMap=new Map<string,string>();
 const storage=(items:Map<string,string>)=>({getItem:(key:string)=>items.get(key)??null,setItem:(key:string,value:string)=>{items.set(key,value);},removeItem:(key:string)=>{items.delete(key);}} as unknown as Storage);
 const env:AccessEnvironment={local:storage(map),session:storage(sessionMap),path:'/',secure:true,cookie:{read:()=>'',write:()=>{}}};
 const now=1000000;assert.equal(saveBrowserAccess(true,env,now),true);assert.equal(readBrowserAccess(env,now+1000),true);
 clearBrowserAccess(env);delete env.local;
 assert.equal(saveBrowserAccess(true,env,now),false);assert.equal(readBrowserAccess(env,now+1000),true);
 assert.equal(saveBrowserAccess(false,env,now),false);assert.equal(readBrowserAccess(env,now+1000),true);
 clearBrowserAccess(env);assert.equal(readBrowserAccess(env,now+1000),false);
});
test('入口通行30天到期；登出及壞資料不影響作答紀錄',()=>{
 const map=new Map<string,string>([['six-review-notebook-v1','existing-progress']]);
 const storage={getItem:(key:string)=>map.get(key)??null,setItem:(key:string,value:string)=>map.set(key,value),removeItem:(key:string)=>map.delete(key)} as unknown as Storage;
 const now=1000000;assert.equal(hasAccess(storage,now),false);rememberAccess(storage,now);
 assert.equal(hasAccess(storage,now+1000),true);assert.equal(hasAccess(storage,now+ACCESS_TTL),false);
 storage.removeItem(ACCESS_KEY);assert.equal(hasAccess(storage,now),false);
 storage.setItem(ACCESS_KEY,'broken');assert.equal(hasAccess(storage,now),false);
 assert.equal(storage.getItem('six-review-notebook-v1'),'existing-progress');
});
