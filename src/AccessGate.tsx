import React,{useEffect,useState} from 'react';
import {BookOpen,ArrowRight} from 'lucide-react';
import {ACCESS_KEY,hasAccess,rememberAccess,verifyAccess} from './access.ts';
import './access.css';
type PracticeApp=React.ComponentType<{onLogout?:()=>void}>;
const loadPractice=()=>import('./main.tsx').then(module=>module.App);
export function AccessGate({verify=verifyAccess,loadApp=loadPractice}:{verify?:typeof verifyAccess;loadApp?:()=>Promise<PracticeApp>}){
 const [allowed,setAllowed]=useState(()=>{try{return hasAccess(localStorage);}catch{return false;}});
 const [App,setApp]=useState<PracticeApp|null>(null),[username,setUsername]=useState(''),[password,setPassword]=useState(''),[remember,setRemember]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const [loadAttempt,setLoadAttempt]=useState(0);
 useEffect(()=>{if(!allowed)return;let cancelled=false;setError('');loadApp().then(component=>{if(!cancelled)setApp(()=>component);}).catch(()=>{if(!cancelled)setError('練習頁載入失敗，請確認網路後再試。');});return()=>{cancelled=true;};},[allowed,loadApp,loadAttempt]);
 async function login(e:React.FormEvent){e.preventDefault();if(busy)return;setBusy(true);setError('');try{if(!await verify(username.trim(),password)){setError('帳號或密碼不正確，請再試一次。');return;}try{if(remember)rememberAccess(localStorage);else localStorage.removeItem(ACCESS_KEY);}catch{/* Current tab can still be used when storage is unavailable. */}setPassword('');setAllowed(true);}catch{setError('暫時無法驗證，請重新整理後再試。');}finally{setBusy(false);}}
 function logout(){try{localStorage.removeItem(ACCESS_KEY);}catch{}setApp(null);setAllowed(false);setPassword('');setError('');}
 if(allowed&&App)return <App onLogout={logout}/>;
 return <main className="access-page"><section className="access-card" aria-labelledby="access-title"><div className="access-mark"><BookOpen size={28}/></div><span className="access-eyebrow">每天一點，把觀念練熟</span><h1 id="access-title">六年級複習筆記</h1><p className="access-intro">你的練習、錯題和每一次進步，<br/>都從這裡接著開始。</p>{allowed?<><p role="status">{error||'正在準備練習內容…'}</p>{error&&<button className="access-submit" onClick={()=>setLoadAttempt(n=>n+1)}>重新載入</button>}<button className="access-back" onClick={logout}>回到登入</button></>:<form onSubmit={login}><label htmlFor="access-username">帳號</label><input id="access-username" name="username" autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} maxLength={100} required autoCapitalize="none" spellCheck={false}/><label htmlFor="access-password">密碼</label><input id="access-password" name="password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} maxLength={200} required/><label className="access-remember"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>在這個瀏覽器記住30天</label>{error&&<p className="access-error" role="alert">{error}</p>}<button className="access-submit" disabled={busy} type="submit">{busy?'確認中…':'開始今天的練習'}<ArrowRight size={18}/></button></form>}<p className="access-footnote">作答紀錄保存在目前裝置的瀏覽器。</p></section><p className="access-outside">國語 · 英語 · 數學 · 自然 · 社會</p></main>;
}
