import {sources} from './bank';
import {conceptQuestions,coverage} from './study-plan';
import type {StudyPlan,Concept,Tier} from './study-plan';
import type {Question} from './types';
export function StudyMap({plan,pool,active,onPractice,onResume}:{plan:StudyPlan;pool:Question[];active:boolean;onPractice:(c:Concept,tier:Tier)=>void;onResume:()=>void}){
 const stats=coverage(plan,pool),source=sources.find(s=>s.sourceId===plan.sourceId);
 return <section className="learning-map" aria-labelledby="map-title">
 <div className="map-heading"><div><span className="eyebrow">依觀念安排練習</span><h2 id="map-title">重要觀念與題型覆蓋</h2></div><span className="badge">{plan.year}學年度 · {plan.period}</span></div>
 <div className="scope-summary"><strong>{plan.edition}</strong><p>{plan.range}</p><p className="caption">{plan.scopeNote}</p>{source&&<a className="text-link" href={source.url} target="_blank" rel="noreferrer">核對原卷版本與範圍 ↗</a>}</div>
 {active&&<div className="map-resume"><span>目前有未完成回合，觀念練習暫停開始。完成後即可選題。</span><button onClick={onResume}>繼續原有回合</button></div>}
 <div className="map-stats"><span><strong>{stats.concepts}</strong> 個整理觀念</span><span><strong>{stats.withBasic}</strong> 個有基本題</span><span><strong>{stats.withApplication}</strong> 個有應用題</span><span><strong>{stats.both}</strong> 個兩類皆有題</span></div>
 <p className="caption">基本題：直接辨識、判斷或計算。應用題：需要連結情境、條件或推理。分類與目標由本站整理，非原卷難度標記，也不是出題頻率排名。數量只計目前階段可用題目，不代表學習程度或完整教材覆蓋率。</p>
 {!pool.length&&<p className="period-empty" role="status">此版本範圍在目前考試階段沒有可用題目。下方保留觀念清單供查看，練習按鈕停用。</p>}
 <div className="map-units">{plan.units.map((u,i)=>{
 const qs=pool.filter(q=>u.concepts.some(c=>[...c.basic,...c.application].includes(q.questionId)));
 const missing=u.concepts.filter(c=>!conceptQuestions(c,'基本題',pool).length||!conceptQuestions(c,'應用題',pool).length).length;
 return <details className="map-unit" key={u.id} open={i===0}><summary><span><strong>{u.title}</strong><small>{u.concepts.length} 個觀念 · {qs.length} 題可用</small></span><span className={missing?'gap-pill':'ready-pill'}>{missing?`${missing} 個觀念仍缺題型`:'兩類題型皆有收錄'}</span></summary><div className="concept-list">{u.concepts.map(c=>{
 const basic=conceptQuestions(c,'基本題',pool),app=conceptQuestions(c,'應用題',pool);
 return <article className="concept-card" key={c.id}><h3>{c.title}</h3><p className="concept-goal">練習目標：{c.goal}</p><div className="tier-grid">{(['基本題','應用題'] as Tier[]).map(tier=>{const qs=tier==='基本題'?basic:app;return <div className={'tier-box '+(!qs.length?'missing-tier':'')} key={tier}><strong>{tier} · {qs.length} 題</strong><p>{qs.length?`原題：${qs.map(q=>q.originalQuestionNumber).join('、')}`:'尚未涵蓋此題型'}</p><button disabled={active||!qs.length} onClick={()=>onPractice(c,tier)}>{qs.length?`練${tier}`:'待補題目'}</button></div>;})}</div>{(!basic.length||!app.length)&&<p className="gap-note">待補：{!basic.length&&!app.length?'基本題、應用題':!basic.length?'基本題':'應用題'}。尚不能視為完整觀念練習。</p>}</article>;
 })}</div></details>;
 })}</div>
 <aside className="coverage-gaps"><h3>這份範圍還缺什麼？</h3><ul>{plan.missing.map(note=><li key={note}>{note}</li>)}</ul><p>觀念清單依目前取得的原卷整理；未列出的內容不能視為不考。教材年度不同時，請先比對課名與老師公告。</p></aside>
 {active&&<p className="caption">你有尚未完成的回合。請先繼續並完成該回合，再開始觀念練習。</p>}
 </section>;
}
