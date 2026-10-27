// Generate NEW credentials solely for a public static gate. Never reuse or read
// credentials from the separate private server or another service.
import {mkdirSync,writeFileSync} from 'node:fs';
import {randomBytes,createHash} from 'node:crypto';
const username='family',password='Review6-'+randomBytes(9).toString('base64url');
const salt=randomBytes(24).toString('hex');
const hash=createHash('sha256').update(salt+'\n'+username+'\n'+password).digest('hex');
writeFileSync(new URL('../src/access-config.ts',import.meta.url),'// Public verification values for a simple static gate, not private server credentials.\nexport const accessConfig='+JSON.stringify({username,salt,hash,version:1})+';\n');
const directory=new URL('../.private/',import.meta.url);mkdirSync(directory,{recursive:true});
writeFileSync(new URL('GitHub入口帳密.txt',directory),`GitHub靜態入口專用帳密\n帳號：${username}\n密碼：${password}\n\n此帳密僅供公開靜態入口，不與本機伺服器或其他服務共用。驗證資訊會隨GitHub網站公開；這只是簡單門檻，不能保護敏感資料。\n`,{mode:0o600});
console.log('已建立GitHub靜態入口專用的新帳密；沒有讀取或沿用任何既有密碼。');
