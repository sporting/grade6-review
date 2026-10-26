import type {Question,Source} from './types.ts';
import type {StudyPlan} from './study-plan.ts';

const archive='https://class.tn.edu.tw/modules/tad_web/page.php?PageID=16297&WebID=4103';
const base={examPeriod:'六下期末考' as const,publisher:'新北市三重區五華國民小學／Tr. Nicole’s classroom',schoolYear:109,semester:2,grade:6,subject:'英語' as const,edition:'原卷未明示教材版本；教師檢討檔名FM8 Final test',accessedAt:'2026-10-27',accessStatus:'已下載學校題本PDF與官方教師同頁發布的38頁檢討PPTX，人工查看題本及PowerPoint輸出的原刊標答影像',reuseTerms:'學校正式定期評量的獨立文字試題，沿用著作權法第9條第1項第5款整理依據；非CC。只整理原刊題目與原刊答案，不重製教師講解內容、聽力、第三方圖片或文章。',reuseEvidence:'https://www.tipo.gov.tw/tw/tipo1/209-21682.html',correctionNotes:'官方教師頁要求使用FM8 Final PPT批改，PPT第1頁標示六年級英語期末卷檢討110.6.03，且第24–27、33–36頁題號與完整文字吻合109下題本第2頁。名為答案卷的PDF是空白作答紙，不以其充當標答。聽力1–25、圖像28/33–37/45及畫圖46排除。第41兩格及42四格均保留原題、不拆題。'};
export const englishNicoleSources:Source[]=[
 {...base,sourceId:'wuhua-english-10922-paper',title:'109學年度第2學期六年級英語領域第2次評量・題目卷',url:'https://class.tn.edu.tw/modules/tad_web/page.php?op=tufdl&files_sn=3908520&fn=109下六年級期末考(題目卷).pdf'},
 {...base,sourceId:'wuhua-english-10922-key-ppt',title:'FM8 Final test.pptx・六年級英語期末卷檢討110.6.03（原刊標準答案）',url:'https://class.tn.edu.tw/modules/tad_web/page.php?op=tufdl&files_sn=3908522&fn=FM8%20Final%20test.pptx'},
 {...base,sourceId:'wuhua-english-10922-teacher-page',title:'Tr. Nicole’s classroom・六年級英語期末卷（含聽力）／附上答案檔',url:archive}
];
function q(n:number,unit:string,stem:string,options:string[],key:string,slide:number):Question{return {questionId:`wuhua-english-10922-${n}`,revision:1,subject:'英語',unit,unitMappingStatus:'整理分類',originalQuestionNumber:String(n),stem,options:options.map((text,i)=>({id:'ABC'[i],text})),correctOptionId:key,passageId:null,assetIds:[],questionSourceId:'wuhua-english-10922-paper',questionPage:2,answerSourceId:'wuhua-english-10922-key-ppt',answerPage:slide,officialExplanation:null,status:'sourceChecked',verificationNotes:`2026-10-27人工查看五華國小109下六年級原題本第2頁及官方教師同頁發布FM8 Final test.pptx第${slide}頁影像，逐項核對原題號、完整句子、選項次序及紅字原刊標答。PPT頁碼為投影片序號。僅整理空白與換行，未自編題目、選項、答案或解析；完整多格題依原題號只計一題。`};}
function short(n:number,unit:string,stem:string,officialAnswer:string,slide:number):Question{return {...q(n,unit,stem,[],'__short_correct',slide),answerType:'short',officialAnswer};}
export const englishNicoleBank:Question[]=[
 q(26,'現在式與主詞一致','G. Read and Choose. 選出正確的選項\nGina _____ a sweet ________.',['have ; tooth','has ; teeth','has ; tooth'],'C',24),
 q(27,'現在式與主詞一致','G. Read and Choose. 選出正確的選項\n_____ John ______ a headache?',['Do ; have','Does ; has','Does ; have'],'C',24),
 q(29,'地點問答與there be','G. Read and Choose. 選出正確的選項\nA: __________________?\nB: No, there isn’t. There is a supermarket nearby.',['Where is the supermarket?','Is there a coffee shop nearby?','Is there a supermarket nearby?'],'B',25),
 q(30,'地點問答與there be','G. Read and Choose. 選出正確的選項\nA: ______ is the bus stop?\nB: It’s ______ Black Street.',['Where ; in','What ; under','Where ; on'],'C',26),
 q(31,'現在式與主詞一致','G. Read and Choose. 選出正確的選項\nA: What’s ________?\nB: Jerry and Peter ______ a cold and a fever.',['wrong ; have','that ; have','wrong ; has'],'A',26),
 q(32,'詞義與日常用語','G. Read and Choose. 選出正確的選項\nA: There is a supermarket nearby. Let’s go!\nB: __________________.',['Face the music','The game is in the bag','Let’s hit the road'],'C',27),
 short(38,'拼字與冠詞','I. Correct 請圈出句子中錯誤之處並改成正確的寫法。\nThere is a book store nearby.\n____________','bookstore',33),
 short(39,'拼字與冠詞','I. Correct 請圈出句子中錯誤之處並改成正確的寫法。\nDan and Ella have headache.\n____________','a',33),
 short(40,'街道介系詞與大小寫','I. Correct 請圈出句子中錯誤之處並改成正確的寫法。\nThe night market is in Cool Street.\n____________','on',34),
 short(41,'街道介系詞與大小寫','I. Correct 請圈出句子中錯誤之處並改成正確的寫法。\nThere is a coffee shop on blue road.（兩個錯誤）\n________ ________','Blue;Road',34),
 short(42,'現在式與主詞一致','J. Complete the sentence 依提示完成句子\nA: ________ your sister _______ a cold?\nB: No, _____ _________.','Does;have;she;doesn’t',35),
 short(43,'地點問答與there be','J. Complete the sentence 依提示完成句子\nA: ______ there a coffee shop and a bus stop nearby?\nB: Yes. They are on Pink Road.','Are',35),
 short(44,'現在式與主詞一致','J. Complete the sentence 依提示完成句子\nKelly ______ a cold and a runny nose.','has',36)
];
const goals:Record<string,string>={'現在式與主詞一致':'依主詞辨識has/have與Does問句、否定簡答。','地點問答與there be':'依完整問答辨識場所詢問、there be及街道位置。','詞義與日常用語':'依完整日常對話辨認原卷所列慣用語。','拼字與冠詞':'辨認bookstore的拼字及症狀名詞前的冠詞。','街道介系詞與大小寫':'辨認街道前介系詞on及街道名稱的字首大寫。'};
const application=new Set([29,31,32,41,42]);
export const englishNicolePlans:StudyPlan[]=[{id:'wuhua-english-10922',subject:'英語',edition:'版本未標示・五華109下期末',year:109,period:'六下期末考',sourceId:'wuhua-english-10922-paper',range:'原卷第2頁G、I、J中已核驗且不依賴圖片的13道原題；主題為現在式、症狀及場所問答',scopeNote:'FM8為教師檢討檔名，未據此推定出版社或完整教材課次。觀念與基本／應用題為本站整理分類，非原校難度標記。',missing:['完整教材版本與課次目次尚待核對','聽力、圖片、畫圖題未納入'],units:Object.keys(goals).map((title,i)=>({id:`wuhua-english-10922-unit-${i}`,title,concepts:[{id:`wuhua-english-10922-concept-${i}`,title,goal:goals[title],basic:englishNicoleBank.filter(q=>q.unit===title&&!application.has(Number(q.originalQuestionNumber))).map(q=>q.questionId),application:englishNicoleBank.filter(q=>q.unit===title&&application.has(Number(q.originalQuestionNumber))).map(q=>q.questionId)}]}))}];
