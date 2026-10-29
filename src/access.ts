import {accessConfig} from './access-config.ts';
export const ACCESS_KEY='six-review-access-v1';
export const ACCESS_TTL=30*24*60*60*1000;
type Config=typeof accessConfig;
export async function verifyAccess(username:string,password:string,config:Config=accessConfig){
 const bytes=new TextEncoder().encode(config.salt+'\n'+username+'\n'+password);
 const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
 return username===config.username&&hash===config.hash;
}
export function rememberAccess(storage:Storage,now=Date.now()){storage.setItem(ACCESS_KEY,JSON.stringify({version:accessConfig.version,proof:accessConfig.hash,expires:now+ACCESS_TTL}));}
export function hasAccess(storage:Storage,now=Date.now()){
 try{return validRecord(storage.getItem(ACCESS_KEY),now);}catch{return false;}
}
function validRecord(raw:string|null,now:number){try{const value=JSON.parse(raw??'null');return value?.version===accessConfig.version&&value.proof===accessConfig.hash&&Number.isFinite(value.expires)&&value.expires>now;}catch{return false;}}
export type AccessEnvironment={local?:Storage;session?:Storage;cookie?:{read:()=>string;write:(value:string)=>void};path:string;secure:boolean};
function browserEnvironment():AccessEnvironment{
 const env:AccessEnvironment={path:new URL('.',window.location.href).pathname,secure:window.location.protocol==='https:'};
 try{env.local=window.localStorage;}catch{}try{env.session=window.sessionStorage;}catch{}
 env.cookie={read:()=>document.cookie,write:value=>{document.cookie=value;}};return env;
}
function cookieRecord(env:AccessEnvironment){try{const raw=env.cookie?.read().split(';').map(value=>value.trim()).find(value=>value.startsWith(ACCESS_KEY+'='))?.slice(ACCESS_KEY.length+1);return raw?decodeURIComponent(raw):null;}catch{return null;}}
export function readBrowserAccess(env=browserEnvironment(),now=Date.now()){
 return !!(env.local&&hasAccess(env.local,now))||validRecord(cookieRecord(env),now)||!!(env.session&&hasAccess(env.session,now));
}
export function clearBrowserAccess(env=browserEnvironment()){
 for(const store of [env.local,env.session])try{store?.removeItem(ACCESS_KEY);}catch{}
 try{env.cookie?.write(`${ACCESS_KEY}=; Path=${env.path}; Max-Age=0; SameSite=Lax${env.secure?'; Secure':''}`);}catch{}
}
export function saveBrowserAccess(remember:boolean,env=browserEnvironment(),now=Date.now()){
 if(!remember)clearBrowserAccess(env);
 try{if(env.session)rememberAccess(env.session,now);}catch{}
 let persistent=false;
 if(remember){
  try{if(env.local){rememberAccess(env.local,now);persistent=hasAccess(env.local,now);}}catch{}
  try{const value=JSON.stringify({version:accessConfig.version,proof:accessConfig.hash,expires:now+ACCESS_TTL});env.cookie?.write(`${ACCESS_KEY}=${encodeURIComponent(value)}; Path=${env.path}; Max-Age=${ACCESS_TTL/1000}; SameSite=Lax${env.secure?'; Secure':''}`);persistent=validRecord(cookieRecord(env),now)||persistent;}catch{}
 }
 return persistent;
}
