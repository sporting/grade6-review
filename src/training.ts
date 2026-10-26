import {bank,periodOf,examPeriods} from './bank.ts';
import {studyPlans,mappingOf} from './study-plan.ts';
import {subjects} from './types.ts';
import type {State,Subject,Question,TrainingSettings,Level} from './types.ts';
export const levels:Level[]=['自動','基礎','標準','進階'];
export type LaunchKind='逐題練習'|'隨手練10題'|'模擬考'|'弱點特訓'|'考前必殺';
export function preferences(s:State):TrainingSettings{return s.settings.training??{subject:'全科',stage:'全部',period:s.settings.examPeriod??'全部',level:'自動',plans:{},units:{}};}
export function chosenPlan(prefs:TrainingSettings,subject:Subject){const id=prefs.plans[subject];return studyPlans.find(p=>p.id===id&&p.subject===subject)??studyPlans.find(p=>p.subject===subject&&(prefs.period==='全部'||p.period===prefs.period)&&(prefs.stage==='全部'||p.period.startsWith(prefs.stage)))??studyPlans.find(p=>p.subject===subject);}
export function trainingPool(s:State,prefs=preferences(s)){
 return bank.filter(q=>{if(q.status!=='sourceChecked'||s.reports[q.questionId]||(prefs.subject!=='全科'&&prefs.subject!==q.subject))return false;
 const period=periodOf(q);if((prefs.period!=='全部'&&period!==prefs.period)||(prefs.stage!=='全部'&&!period?.startsWith(prefs.stage)))return false;
 const p=chosenPlan(prefs,q.subject);if(!p||prefs.plans[q.subject]==='unmapped'||q.questionSourceId!==p.sourceId)return false;
 const units=prefs.units[q.subject];return !units||units.includes(mappingOf(q)?.unit.id??'');});
}
export function lastAnswers(s:State,qid:string){return s.history.filter(h=>h.questionId===qid&&h.isCorrect!==null).slice(-5);}
const questionMeta=new Map(bank.map(q=>[q.questionId,mappingOf(q)]));
function weaknessScores(s:State){const recent=new Map<string,boolean[]>();for(const h of s.history){if(h.isCorrect===null)continue;const list=recent.get(h.questionId)??[];list.push(h.isCorrect);if(list.length>5)list.shift();recent.set(h.questionId,list);}const related=new Map<string,number>();for(const q of bank){if(!s.review[q.questionId]&&recent.get(q.questionId)?.at(-1)!==false)continue;const id=questionMeta.get(q.questionId)?.concept.id;if(id)related.set(id,(related.get(id)??0)+1);}return new Map(bank.map(q=>{const answers=recent.get(q.questionId)??[],concept=questionMeta.get(q.questionId)?.concept.id;return [q.questionId,(s.review[q.questionId]?8:0)+(answers.at(-1)===false?answers.filter(value=>!value).length*3:0)+(concept?(related.get(concept)??0):0)];}));}
export function weakness(s:State,q:Question){return weaknessScores(s).get(q.questionId)??0;}
export function effectiveLevel(s:State,prefs=preferences(s)):Exclude<Level,'自動'>{if(prefs.level!=='自動')return prefs.level;const allowed=new Set(trainingPool(s,prefs).map(q=>q.questionId));const hs=s.history.filter(h=>allowed.has(h.questionId)&&h.isCorrect!==null).slice(-10);if(hs.length<5)return '基礎';const accuracy=hs.filter(h=>h.isCorrect).length/hs.length;return accuracy>=.8?'進階':accuracy<.6?'基礎':'標準';}
export function selectTraining(s:State,kind:LaunchKind,prefs=preferences(s)){
 let pool=trainingPool(s,prefs);const level=effectiveLevel(s,prefs),scores=weaknessScores(s);if(kind==='弱點特訓')pool=pool.filter(q=>(scores.get(q.questionId)??0)>0);
 const subjectLevels=new Map(subjects.map(subject=>[subject,effectiveLevel(s,{...prefs,subject})]));
 const seen=new Set(s.history.map(h=>h.questionId));const shuffled=pool.map(q=>({q,r:Math.random()}));
 shuffled.sort((a,b)=>{const weak=(scores.get(b.q.questionId)??0)-(scores.get(a.q.questionId)??0);if(kind==='弱點特訓'||kind==='考前必殺'){if(weak)return weak;}
 const tier=(q:Question)=>mappingOf(q)?.tier==='應用題';const preferred=(q:Question)=>{const localLevel=prefs.level==='自動'?subjectLevels.get(q.subject)!:level;return localLevel==='基礎'?!tier(q):localLevel==='進階'?tier(q):false;};
 return Number(preferred(b.q))-Number(preferred(a.q))||Number(seen.has(a.q.questionId))-Number(seen.has(b.q.questionId))||a.r-b.r;});
 // Round-robin across subjects for all-subject sessions, without padding missing subjects.
 const ranked=shuffled.map(x=>x.q),limit=kind==='模擬考'?20:kind==='逐題練習'?5:10;
 const selected:Question[]=[];if(prefs.subject==='全科'){const queues=subjects.map(sub=>ranked.filter(q=>q.subject===sub));while(selected.length<limit&&queues.some(q=>q.length))for(const queue of queues){if(selected.length>=limit)break;const q=queue.shift();if(q)selected.push(q);}}else selected.push(...ranked.slice(0,limit));
 return {questions:selected,level,levelLabel:prefs.level==='自動'&&prefs.subject==='全科'?'分科自動':level,total:pool.length,missingSubjects:subjects.filter(sub=>(prefs.subject==='全科'||prefs.subject===sub)&&!pool.some(q=>q.subject===sub))};
}
export function weakConcepts(s:State,prefs=preferences(s)){const pool=trainingPool(s,prefs),allowed=new Set(pool.map(q=>q.questionId)),scores=weaknessScores(s),counts=new Map<string,{answered:number;wrong:number}>();for(const h of s.history){if(h.isCorrect===null||!allowed.has(h.questionId))continue;const id=questionMeta.get(h.questionId)?.concept.id;if(!id)continue;const count=counts.get(id)??{answered:0,wrong:0};count.answered++;if(!h.isCorrect)count.wrong++;counts.set(id,count);}return studyPlans.flatMap(p=>p.units.flatMap(u=>u.concepts.map(c=>{const qs=pool.filter(q=>questionMeta.get(q.questionId)?.concept.id===c.id),count=counts.get(c.id)??{answered:0,wrong:0};return {plan:p,unit:u,concept:c,questions:qs,...count,review:qs.filter(q=>s.review[q.questionId]).length};}))).filter(c=>c.questions.some(q=>(scores.get(q.questionId)??0)>0)).sort((a,b)=>b.review-a.review||b.wrong-a.wrong);}
export const skills=['概念辨識','語文運用','數量運算','情境推理','圖表判讀','整合閱讀'] as const;
export type Skill=typeof skills[number];
export function skillOf(q:Question):Skill{const map=mappingOf(q);if(map?.tier==='應用題')return '情境推理';if(q.subject==='英語'||q.subject==='國語')return '語文運用';if(q.subject==='數學'&&(/÷|最簡整數比/.test(q.stem)))return '數量運算';return '概念辨識';}
export function performance(s:State,dimension:'subject'|'skill',subject?:Subject){const labels=dimension==='subject'?subjects:skills;return labels.map(label=>{const records=s.history.filter(h=>h.isCorrect!==null&&(!subject||h.subject===subject)&&(dimension==='subject'?h.subject===label:skillOf(bank.find(q=>q.questionId===h.questionId)!)===label));const right=records.filter(h=>h.isCorrect).length;return {label,total:records.length,right,value:records.length?Math.round(right/records.length*100):null};});}
export function validTraining(t:any){if(!t||typeof t!=='object'||Array.isArray(t)||!['全科',...subjects].includes(t.subject)||!['全部','六上','六下'].includes(t.stage)||!['全部',...examPeriods].includes(t.period)||!levels.includes(t.level)||!t.plans||typeof t.plans!=='object'||Array.isArray(t.plans)||!t.units||typeof t.units!=='object'||Array.isArray(t.units))return false;
 return Object.entries(t.plans).every(([sub,id])=>subjects.includes(sub as Subject)&&(id==='unmapped'||studyPlans.some(p=>p.id===id&&p.subject===sub)))&&Object.entries(t.units).every(([sub,ids])=>subjects.includes(sub as Subject)&&(ids===undefined||Array.isArray(ids)&&ids.length<=40&&new Set(ids).size===ids.length&&ids.every(id=>studyPlans.some(p=>p.subject===sub&&p.units.some(u=>u.id===id)))));}
