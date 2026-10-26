import {validVocabulary} from './vocabulary.ts';
import {validTraining} from './training.ts';
import {studyPlans} from './study-plan.ts';
import type {State,Question,Mode,Answer,Session,Subject,Completed} from './types.ts';
import {subjects} from './types.ts';
import {bank,examPeriods,periodOf} from './bank.ts';
export const STORAGE_KEY='six-review-notebook-v1';
export const emptyState=():State=>({version:1,settings:{subject:'數學',unit:''},active:null,history:[],completed:[],review:{},reports:{}});
export const blankAnswer=():Answer=>({selectedOptionId:null,locked:false,skipped:false,misunderstood:false});
export function officialAnswer(q:Question){return q.answerType==='short'?q.officialAnswer!:q.options.find(o=>o.id===q.correctOptionId)?.text??'';}
// Compare transcription formats only; never evaluate a student's expression or derive an answer.
function scalar(value:string):[bigint,bigint]|null{
 if(value.length>100)return null;
 const mixed=/^(-?)(\d+)又(\d+)\/(\d+)$/.exec(value),fraction=/^(-?\d+)\/(\d+)$/.exec(value),decimal=/^(-?)(\d*)(?:\.(\d+))?$/.exec(value);
 if(mixed){const denominator=BigInt(mixed[4]);return denominator?[BigInt(mixed[1]+'1')*(BigInt(mixed[2])*denominator+BigInt(mixed[3])),denominator]:null;}
 if(fraction){const denominator=BigInt(fraction[2]);return denominator?[BigInt(fraction[1]),denominator]:null;}
 if(decimal&&(decimal[2]||decimal[3]))return [BigInt(decimal[1]+(decimal[2]||'0')+(decimal[3]??'')),10n**BigInt(decimal[3]?.length??0)];
 return null;
}
export function shortSelection(q:Question,text:string){
 const normalized=(value:string)=>{const plain=value.normalize('NFKC').replace(/[’‘]/g,"'");return q.subject==='英語'?plain.trim().replace(/\s+/g,' ').replace(/\s*;\s*/g,';'):plain.replace(/\s/g,'');};
 const input=normalized(text),key=normalized(q.officialAnswer??'');if(!input)return null;
 const values=input.split(';'),keys=key.split(';');const equal=(a:string,b:string)=>{const x=scalar(a),y=scalar(b);return a===b||!!(x&&y&&x[0]*y[1]===y[0]*x[1]);};
 return values.length===keys.length&&values.every((value,i)=>equal(value,keys[i]))?'__short_correct':'__short_wrong';
}
export function available(bank:Question[],s:State,subject:Subject,unit:string,review=false,period:string='全部'){return bank.filter(q=>q.status==='sourceChecked'&&(period==='全部'||periodOf(q)===period)&&q.subject===subject&&(!unit||q.unit===unit)&&!s.reports[q.questionId]&&(!review||!!s.review[q.questionId]));}
export function begin(s:State,questions:Question[],mode:Mode,subject:Subject|'全科',unit:string,id=crypto.randomUUID(),limit=10,ordered=false):State{
 if(s.active||!questions.length)return s;
 const seen=new Set(s.history.map(h=>h.questionId));
 const unique=[...new Map(questions.map(q=>[q.questionId,q])).values()];
 const ranked=unique.map(q=>({q,r:Math.random()})).sort((a,b)=>Number(seen.has(a.q.questionId))-Number(seen.has(b.q.questionId))||Number(!!s.review[b.q.questionId])-Number(!!s.review[a.q.questionId])||a.r-b.r);
 const chosen=(ordered?unique:ranked.map(x=>x.q)).slice(0,Math.max(1,Math.min(30,limit))).map(q=>structuredClone(q));
 return {...s,active:{id,mode,subject,unit,questions:chosen,answers:{},index:0,startedAt:new Date().toISOString()}};
}
export function answer(s:State,selectedOptionId:string|null,action:'select'|'confirm'|'skip'|'understand'|'report'):State{
 if(!s.active)return s; const a=structuredClone(s); const session=a.active!; const q=session.questions[session.index];const prior=session.answers[q.questionId]??blankAnswer();
 if(action==='report'){a.reports[q.questionId]={at:new Date().toISOString(),reason:'學生標記：這題可能有問題（僅記錄於本機）'};session.answers[q.questionId]={...prior,selectedOptionId:null,skipped:true,locked:true,answeredAt:new Date().toISOString()};return a;}
 if(action==='understand'){if(!prior.locked||prior.skipped)return s;session.answers[q.questionId]={...prior,misunderstood:true};a.review[q.questionId]={streak:0,lastCorrectSession:null};return a;}
 if(prior.locked)return s;
 if(action==='skip'){session.answers[q.questionId]={...prior,selectedOptionId:null,skipped:true,locked:true,answeredAt:new Date().toISOString()};return a;}
 if(q.answerType==='short'){
  const inputText=action==='select'?(selectedOptionId??''):prior.inputText??'';
  if(inputText.length>300)return s;
  const selected=shortSelection(q,inputText);
  if(action==='select')session.answers[q.questionId]={...prior,inputText,selectedOptionId:selected};
  if(action==='confirm'&&session.mode!=='quiz'&&selected){session.answers[q.questionId]={...prior,inputText,selectedOptionId:selected,locked:true,answeredAt:new Date().toISOString()};if(selected!==q.correctOptionId)a.review[q.questionId]={streak:0,lastCorrectSession:null};}
  return a;
 }
 if(!q.options.some(o=>o.id===selectedOptionId))return s;
 if(action==='select')session.answers[q.questionId]={...prior,selectedOptionId};
 if(action==='confirm'&&session.mode!=='quiz'){session.answers[q.questionId]={...prior,selectedOptionId,locked:true,answeredAt:new Date().toISOString()};if(selectedOptionId!==q.correctOptionId)a.review[q.questionId]={streak:0,lastCorrectSession:null};}
 return a;
}
export function finish(s:State):State{
 if(!s.active||s.completed.some(c=>c.id===s.active!.id))return s;
 const a=structuredClone(s); const session=a.active!;const now=new Date().toISOString();
 for(const q of session.questions){const res=session.answers[q.questionId]??blankAnswer();const selected=res.selectedOptionId; const correct=res.skipped||!selected?null:selected===q.correctOptionId;
  a.history.push({questionId:q.questionId,revision:q.revision,sessionId:session.id,mode:session.mode,subject:q.subject,unit:q.unit,selectedOptionId:res.skipped?null:selected,isCorrect:correct,skipped:res.skipped,answeredAt:res.answeredAt??now});
  if(correct===false||res.misunderstood)a.review[q.questionId]={streak:0,lastCorrectSession:null};
  else if(correct===true&&a.review[q.questionId]&&a.review[q.questionId].lastCorrectSession!==session.id){const prev=a.review[q.questionId];if(prev.streak+1>=2)delete a.review[q.questionId];else a.review[q.questionId]={streak:prev.streak+1,lastCorrectSession:session.id};}
 }
 a.completed.push({id:session.id,mode:session.mode,subject:session.subject,unit:session.unit,...(session.label?{label:session.label}:{}),questions:session.questions,answers:session.answers,completedAt:now});a.active=null;return a;
}
export function score(c:Completed){const all=c.questions.map(q=>({q,a:c.answers[q.questionId]??blankAnswer()}));return {correct:all.filter(({q,a})=>!a.skipped&&a.selectedOptionId===q.correctOptionId).length,answered:all.filter(({a})=>!a.skipped&&a.selectedOptionId).length,unanswered:all.filter(({a})=>!a.skipped&&!a.selectedOptionId).length,skipped:all.filter(({a})=>a.skipped).length,total:all.length};}
// Import data is untrusted. Validate every nested value before it can affect rendering or grading.
const obj=(x:unknown):x is Record<string,any>=>!!x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>!['__proto__','prototype','constructor'].includes(k));
const str=(x:unknown):x is string=>typeof x==='string'&&x.length<=30000;
const id=(x:unknown):x is string=>str(x)&&x.length>0&&x.length<160&&!['__proto__','prototype','constructor'].includes(x);
const date=(x:unknown)=>str(x)&&Number.isFinite(Date.parse(x));
const subj=(x:unknown)=>subjects.includes(x as Subject);
const mode=(x:unknown)=>['practice','quiz','review'].includes(x as string);
const num=(x:unknown)=>Number.isSafeInteger(x)&&Number(x)>=1;
const canonical=(x:any):string=>JSON.stringify(Array.isArray(x)?x.map(v=>JSON.parse(canonical(v))):obj(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,JSON.parse(canonical(x[k]))])):x);
function validQuestion(q:any):q is Question{if(!(obj(q)&&id(q.questionId)&&num(q.revision)&&subj(q.subject)&&str(q.unit)&&['來源明示','整理分類','待確認'].includes(q.unitMappingStatus)&&str(q.originalQuestionNumber)&&str(q.stem)&&Array.isArray(q.options)&&(q.answerType==='short'?q.options.length===0&&str(q.officialAnswer)&&q.officialAnswer.length>0&&q.officialAnswer.length<=300&&q.correctOptionId==='__short_correct':q.answerType===undefined&&q.options.length>=2&&q.options.length<=16&&q.options.every((o:any)=>obj(o)&&id(o.id)&&str(o.text))&&new Set(q.options.map((o:any)=>o.id)).size===q.options.length&&q.options.some((o:any)=>o.id===q.correctOptionId))&&q.passageId===null&&Array.isArray(q.assetIds)&&q.assetIds.length===0&&id(q.questionSourceId)&&id(q.answerSourceId)&&num(q.questionPage)&&num(q.answerPage)&&(q.officialExplanation===null||str(q.officialExplanation))&&['sourceChecked','excluded','draft'].includes(q.status)&&str(q.verificationNotes)))return false;
 // Keep retired revisions in bank with status excluded when updating content.
 // Backups may restore known revisions, but cannot introduce unverified questions or answers.
 return bank.some(approved=>approved.questionId===q.questionId&&approved.revision===q.revision&&Object.keys(approved).filter(k=>!['status','verificationNotes'].includes(k)).every(k=>canonical(q[k])===canonical(approved[k as keyof Question])));
}
function validRound(r:any,active:boolean):boolean{
 if(!obj(r)||!id(r.id)||!mode(r.mode)||!(subj(r.subject)||r.subject==='全科')||!str(r.unit)||!Array.isArray(r.questions)||r.questions.length<1||r.questions.length>30||!r.questions.every(validQuestion)||new Set(r.questions.map((q:Question)=>q.questionId)).size!==r.questions.length||!obj(r.answers))return false;
 if(r.label!==undefined&&(!str(r.label)||r.label.length>300))return false;
 if(!r.questions.every((q:Question)=>(r.subject==='全科'||q.subject===r.subject)&&(!r.unit||q.unit===r.unit)))return false;
 for(const [key,a] of Object.entries(r.answers) as [string,any][]){const q=r.questions.find((q:Question)=>q.questionId===key);if(!q||!obj(a)||(a.answeredAt!==undefined&&!date(a.answeredAt))||typeof a.locked!=='boolean'||typeof a.skipped!=='boolean'||typeof a.misunderstood!=='boolean'||(q.answerType==='short'?((a.inputText!==undefined&&(!str(a.inputText)||a.inputText.length>300))||(!a.skipped&&a.selectedOptionId!==shortSelection(q,a.inputText??''))):(a.inputText!==undefined||a.selectedOptionId!==null&&!q.options.some((o:any)=>o.id===a.selectedOptionId)))||(a.skipped&&(a.selectedOptionId!==null||!a.locked))||(a.misunderstood&&(!a.locked||a.skipped))||(active&&r.mode==='quiz'&&a.locked&&!a.skipped))return false;}
 return active?Number.isInteger(r.index)&&r.index>=0&&r.index<r.questions.length&&date(r.startedAt):date(r.completedAt);
}
export function validateState(x:unknown):x is State{
 if(!obj(x)||x.version!==1||(x.vocabulary!==undefined&&!validVocabulary(x.vocabulary))||!obj(x.settings)||!subj(x.settings.subject)||!str(x.settings.unit)||(x.settings.training!==undefined&&!validTraining(x.settings.training))||(x.settings.studyPlanId!==undefined&&x.settings.studyPlanId!=='unmapped'&&!studyPlans.some(p=>p.id===x.settings.studyPlanId))||(x.settings.examPeriod!==undefined&&x.settings.examPeriod!=='全部'&&!examPeriods.includes(x.settings.examPeriod))||!Array.isArray(x.history)||x.history.length>100000||!Array.isArray(x.completed)||x.completed.length>10000||!obj(x.review)||!obj(x.reports)||(x.active!==null&&!validRound(x.active,true))||!x.completed.every(c=>validRound(c,false)))return false;
 if(new Set(x.completed.map(c=>c.id)).size!==x.completed.length||x.completed.some(c=>c.id===x.active?.id))return false;
 const keys=new Set<string>();
 for(const h of x.history){if(!obj(h)||!id(h.questionId)||!num(h.revision)||!id(h.sessionId)||!mode(h.mode)||!subj(h.subject)||!str(h.unit)||(h.selectedOptionId!==null&&!id(h.selectedOptionId))||!(h.isCorrect===null||typeof h.isCorrect==='boolean')||typeof h.skipped!=='boolean'||!date(h.answeredAt))return false;
 const c=x.completed.find(c=>c.id===h.sessionId),q=c?.questions.find((q:Question)=>q.questionId===h.questionId),res=c?.answers[h.questionId]??blankAnswer();if(!q||q.revision!==h.revision||c.mode!==h.mode||q.subject!==h.subject||q.unit!==h.unit||h.skipped!==res.skipped||h.selectedOptionId!==res.selectedOptionId||h.isCorrect!==(res.skipped||!res.selectedOptionId?null:res.selectedOptionId===q.correctOptionId))return false;const k=h.sessionId+':'+h.questionId;if(keys.has(k))return false;keys.add(k);}
 if(x.history.length!==x.completed.reduce((n,c)=>n+c.questions.length,0))return false;
 return Object.entries(x.review).every(([k,r])=>id(k)&&obj(r)&&[0,1].includes(r.streak)&&(r.lastCorrectSession===null||x.completed.some((c:Completed)=>c.id===r.lastCorrectSession)))&&Object.entries(x.reports).every(([k,r])=>id(k)&&obj(r)&&date(r.at)&&str(r.reason));
}
export function parseBackup(text:string):State{if(text.length>15_000_000)throw Error('檔案過大，請選擇 15 MB 以下的備份。');const v=JSON.parse(text);if(!validateState(v))throw Error('備份格式、版本或紀錄內容不正確；現有紀錄未變更。');return v;}


