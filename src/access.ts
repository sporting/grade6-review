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
 try{const value=JSON.parse(storage.getItem(ACCESS_KEY)??'null');return value?.version===accessConfig.version&&value.proof===accessConfig.hash&&Number.isFinite(value.expires)&&value.expires>now&&value.expires<=now+ACCESS_TTL;}catch{return false;}
}
