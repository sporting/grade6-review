import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyAccess,rememberAccess,hasAccess,ACCESS_KEY,ACCESS_TTL} from '../src/access.ts';
test('簡單入口核對帳密，不接受錯誤帳號或密碼',async()=>{
 const config={username:'family-test',salt:'test-salt',hash:createHash('sha256').update('test-salt\nfamily-test\ntest-password').digest('hex'),version:1};
 assert.equal(await verifyAccess('family-test','test-password',config),true);
 assert.equal(await verifyAccess('wrong','test-password',config),false);
 assert.equal(await verifyAccess('family-test','wrong',config),false);
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
