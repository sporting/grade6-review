import {englishNicoleBank,englishNicoleSources} from './english-nicole.ts';
import {englishExtraBank,englishExtraSources} from './english-extra.ts';
import {mathExtraBank,mathExtraSources} from './math-extra.ts';
import {hsesSourceLinks} from './hses-source-links.ts';
import {expandedBank,expandedSources} from './expansion.ts';
import {verifiedBank,verifiedSources} from './verified-additions.ts';
import {science114Bank,science114Sources} from './science-114.ts';
import {english114Bank,english114Sources} from './english-114.ts';
import {chineseMoreBank,chineseMoreSources} from './chinese-more.ts';
import {englishMoreBank,englishMoreSources} from './english-more.ts';
import {mathMoreBank,mathMoreSources} from './math-more.ts';
import {scienceMoreBank,scienceMoreSources} from './science-more.ts';
import {socialMoreBank,socialMoreSources} from './social-more.ts';
import type {Question, Source,Subject,ExamPeriod} from './types.ts';
const terms='學校正式定期評量試題；依智慧財產局「教學活動篇」對著作權法第9條第1項第5款之說明整理使用。不是創用CC授權。不收錄引用文章、照片或來源不明圖像。';
const evidence='https://www.tipo.gov.tw/tw/tipo1/209-21682.html';
const base={examPeriod:'六上第一次段考' as ExamPeriod,grade:6,edition:'學校自編定期評量；教科書版本未標示',accessedAt:'2026-10-24',accessStatus:'已下載並讀取原始檔',reuseTerms:terms,reuseEvidence:evidence,correctionNotes:'2026-10-24檢查發布頁及以校名、年度、更正檢索；未找到對應更正公告。非保證無後續更正。'};
export const sources:Source[]=[
 ...expandedSources,
 ...verifiedSources,
 ...science114Sources,
 ...english114Sources,
 ...englishNicoleSources,...englishExtraSources,...mathExtraSources,...chineseMoreSources,...englishMoreSources,...mathMoreSources,...scienceMoreSources,...socialMoreSources,
 {...base,sourceId:'ddes-chinese-paper',title:'114學年度第一學期第一次定期評量六年級語文領域國語試卷',publisher:'臺中市南屯區大墩國民小學（命題：蔡明諺老師）',url:'https://drive.google.com/file/d/1NP379d935MdOB5f_XkbZ7xWk3Cg-Yj1z/view',schoolYear:114,semester:1,subject:'國語'},
 {...base,sourceId:'ddes-chinese-key',title:'6C11411A.doc：同版本國語答案卷',publisher:'臺中市南屯區大墩國民小學',url:'https://drive.google.com/file/d/1IRQHoV1gWFrHBWOz3Sh4R5J5bQg-n5xR/view',schoolYear:114,semester:1,subject:'國語',accessStatus:'已下載；原檔為DOCX結構，以原始XML表格核對第三大題第2、3、4題，未以OCR推測。'},
 {...base,sourceId:'ddes-math-paper',title:'114學年度第一學期第一次定期評量六年級數學領域評量試卷',publisher:'臺中市南屯區大墩國民小學（命題：黃嘉惠老師）',url:'https://drive.google.com/file/d/1qNmmi3tsGmAPoIy5S6bgKKAOpwSN1f1i/view',schoolYear:114,semester:1,subject:'數學'},
 {...base,sourceId:'ddes-math-key',title:'6M11411A-1.jpg：同版本數學答案卷第一張',publisher:'臺中市南屯區大墩國民小學',url:'https://drive.google.com/file/d/1gHmyAfW0LsPh3uHxCniIvywqYqvwDNMm/view',schoolYear:114,semester:1,subject:'數學',correctionNotes:base.correctionNotes+' 選擇題第3、4題暫不收錄：答案疑義／時間表表頭與內容疑義待發布單位釐清，不自行修正。'},
 {...base,sourceId:'ptes-social-paper',examPeriod:'六下期末考',title:'114學年度第2學期六年級社會領域期末評量試題卷標準解答',publisher:'臺北市北投區北投國民小學／PANDA老師社會課2.5（張家齊老師）',url:'https://drive.google.com/file/d/19CZSwnEFMN0KZ5DgIUp6LnvfaVcK3DVg/view',schoolYear:114,semester:2,subject:'社會'},
 {...base,sourceId:'ptes-social-key',examPeriod:'六下期末考',title:'114學年度第2學期六年級社會領域期末評量作答卷標準解答',publisher:'臺北市北投區北投國民小學／PANDA老師社會課2.5',url:'https://drive.google.com/file/d/1cqKFA9oJX0h1PmOQW2GuT9TWWYlBjEaS/view',schoolYear:114,semester:2,subject:'社會'}
];
function q(subject:Subject,n:string,unit:string,stem:string,opts:string[],key:string,page=1):Question{const prefix=subject==='數學'?'ddes-math':subject==='國語'?'ddes-chinese':'ptes-social';return {questionId:(subject==='數學'?'ddes-114-m-':subject==='國語'?'ddes-114-c-':'ptes-114-s-')+n.replaceAll('、','-'),revision:1,subject,unit,unitMappingStatus:'整理分類',originalQuestionNumber:n,stem,options:opts.map((text,i)=>({id:String(i+1),text})),correctOptionId:key,passageId:null,assetIds:[],questionSourceId:prefix+'-paper',questionPage:page,answerSourceId:prefix+'-key',answerPage:1,officialExplanation:null,status:'sourceChecked',verificationNotes:subject==='國語'?'2026-10-24逐題查看原始PDF影像，並讀取同版本答案Word檔原始XML第三表格，核對第三大題第2、3、4題的題號與答案。僅調整排版，未補寫文章。單元為整理分類。':'2026-10-24逐題查看原始題本與同版本答案卷影像，核對題幹、選項順序、題號與保存答案；只調整空白、分數排版及選項標號。無AI生成答案或解析；單元為本站整理分類。'};}
const tf=['○（正確）','╳（錯誤）'];
export const bank:Question[]=[
q('數學','一、1','因數與分數','最簡分數的分子和分母沒有公因數。',tf,'2'),
q('數學','一、2','因數與分數','A=2×3×5，B=7×11，A和B兩數互質。',tf,'1'),
q('數學','一、3','因數與分數','合數是大於1的整數，除了1和自己以外，沒有其他的因數。',tf,'2'),
q('數學','一、4','小數除法','「3.9÷0.13」可以看成「39個0.1」除以「13個0.01」，也就是「39÷13」。',tf,'2'),
q('數學','一、5','比與比值','「0.5 : 0.7」的最簡整數比是5:7。',tf,'1'),
q('數學','一、6','比與比值','今年媽媽45歲，女兒15歲，明年媽媽的年齡也會是女兒的3倍。',tf,'2'),
q('數學','二、1','因數與分數','1/3 ÷ 1/3 ÷ 1/3 ÷ 1/3 ＝？',['1','3','9','27'],'3'),
q('數學','二、2','因數與分數','下列哪一組數的最大公因數是1？',['11、88','15、28','41、123','12、40'],'2'),
q('社會','一、2','全球環境','根據新聞報導，中華民國的邦交國吐瓦魯（Tuvalu）是位於南太平洋的島國，將面臨海平面上升而國土被淹沒的危機，請問導致海平面上升的主要原因是什麼？',['全球海水溫度升高','南北極冰雪融化流入海中','全球平均降雨量增加','海洋動物數量減少'],'2'),
q('社會','一、3','全球環境','國際間達成環境保護的共識後，在西元1992年簽署了哪一項國際公約，開始要求簽署國管制碳排放量？',['聯合國氣候變化綱要公約的京都議定書','世界人權宣言','聯合國氣候變化綱要公約的巴黎協定','聯合國氣候變化綱要公約'],'4'),
q('社會','一、5','全球環境','根據聯合國發布的2023年世界水資源開發報告，全球大約有多少比率的人口無法獲得安全飲用水？',['四分之一','三分之一','二分之一','十分之一'],'1'),
q('社會','一、6','人權與國際合作','來自印尼的Aisha在臺灣擔任看護，她經常超時工作，卻沒有獲得合理的薪資待遇。請問她可能是因為哪一種因素，難以替自己爭取合理的工作權益？',['宗教信仰','學歷優秀','精通中文','非本國籍'],'4',2),
q('社會','一、7','人權與國際合作','下列何者不是臺灣希望加入世界衛生組織的原因？',['保障國人健康','增加貿易收入','參與國際事務','健全防疫體系'],'2',2),
q('社會','一、8','人權與國際合作','烏俄戰爭爆發後，西方各國為了制裁俄羅斯的軍事行動，發起能源禁運，這對全世界造成哪一種影響？',['全球傳染病疫情加劇','全球經濟快速成長','全球石油價格上漲','全球農產品價格下跌'],'3',2),
q('社會','一、9','人權與國際合作','第二次世界大戰後，為了避免國際間再度發生大規模戰爭，於是世界各國共同成立了哪一個國際組織？',['歐洲聯盟','世界衛生組織','世界貿易組織','聯合國'],'4',2),
q('社會','一、10','人權與國際合作','正達收看奧運羽球比賽，為代表臺灣出賽的選手加油，請問這項賽事是由下列哪一個國際組織所主辦？',['國際綠色和平組織','世界貿易組織','國際奧林匹克委員會','紅十字會國際委員會'],'3',2),
q('社會','二、2','全球環境','由於全球暖化造成強降雨的現象，使得臺灣排水不良、地勢低窪的地方，可能遭受淹水災害的風險提高。',tf,'1',2),
q('社會','二、7','人權與國際合作','選擇購買價格最便宜的產品，除了能保護生態環境，也能促進維護人權的發展。',tf,'2',2),
q('國語','三、2','文章特色','下面哪一個不是科普文章的特點？',['生活事物的舉例','簡明扼要的圖表','節奏鮮明','具有補充說明的小視窗。'],'3'),
q('國語','三、3','字音','下面哪一個「弄」字，讀音和其他三個不同？',['逗「弄」','巷「弄」','玩「弄」','戲「弄」。'],'2'),
q('國語','三、4','修辭','「借代」是一種修辭法，指在談話或寫作時，捨棄事物的本名或語句不用，而借用與其密切相關的另一事物名稱來代替。請問杏壇是代指何種職業？',['醫生','演員','教師','園丁。'],'3'),
...expandedBank,
...verifiedBank,
...science114Bank,
...english114Bank,
...englishNicoleBank,...englishExtraBank,...mathExtraBank,...chineseMoreBank,...englishMoreBank,...mathMoreBank,...scienceMoreBank,...socialMoreBank
];
// Preserve this retired original revision for imported answer histories; do not offer the duplicate again.
const duplicate=bank.find(q=>q.questionId==='hses-science-11322-一、5');
if(duplicate){duplicate.status='excluded';duplicate.verificationNotes+=' 與11321一、4全文重複，保留舊紀錄相容但不再出題或計入題數。';}
// Original paper/key section numbers differ: retain known snapshots but stop new use.
for(const item of bank.filter(q=>q.questionSourceId==='hses-english-11321-paper')){item.status='excluded';item.verificationNotes+=' 題本與原刊答案大題號不一致，依收錄條件停用，不列有效題數。';}
for(const source of sources){if(source.sourceId.startsWith('hses-english-11321-'))source.correctionNotes='已停用：題本與原刊標答大題號不一致，相關題不列有效題數。'+source.correctionNotes;if(source.url.startsWith('https://achses.hses.tn.edu.tw/')){const fileId=new URL(source.url).searchParams.get('cfsn');if(fileId&&hsesSourceLinks[fileId])source.url=hsesSourceLinks[fileId];}}
export const missing:Partial<Record<Subject,string>>={};
export const researchLinks=[{title:'同安國小109學年度第二學期期末評量',url:'https://www.taes.tyc.edu.tw/exam/exam10902/',note:'新增39題；逐題比對題本及解答。自然二、1版本文字不一致、聽力、圖片、引用文章及有疑義題排除。舊試題不代表現行完整課綱。'},{title:'教育部數學領域課綱（範圍研究，不是題庫答案）',url:'https://edu.law.moe.gov.tw/LawContent.aspx?id=GL001788',note:'已讀取法規發布頁；本站不宣稱完整課綱對照。'},{title:'大墩國小114學年度上學期期中考',url:'https://sites.google.com/ddes.tc.edu.tw/testpaper/114/11411',note:'已核對檔名規則與題本／答案版本；自然、社會、英語題本未見同版本答案，排除。'},{title:'北投國小教師正式答案公告',url:'https://sites.google.com/gm.ptes.tp.edu.tw/panda/自主學習',note:'使用114下期末評量的獨立文字題；引用新聞文章、照片、依賴圖像及時事是非題不收錄。'},{title:'教育大市集六年級試卷',url:'https://market.cloud.edu.tw/list/exampaper.jsp',note:'多數下載要求登入；部分資源年代久遠。未繞過限制，未納入題庫。'},{title:'縣市學生學習能力檢測公告',url:'https://saaassessmentap3.ntcu.edu.tw/ExamReleases',note:'可讀取公告，下載未完成；未確認評量年級內容及重製條件，未收錄。'},{title:'博愛國小定期試題',url:'https://www.paps.kh.edu.tw/view/index.php?MainMenuId=51579&MainType=0&SubMenuId=52938&SubType=104&TypeChange=&WebID=322&page=2',note:'可讀取列表，未取得完整對應答案，不直接收錄。'}];



export const examPeriods:ExamPeriod[]=['六上第一次段考','六上期末考','六下第一次段考','六下期末考'];
export function periodOf(q:Question){return sources.find(s=>s.sourceId===q.questionSourceId)?.examPeriod;}
