import {englishNicolePlans} from './english-nicole.ts';
import {englishExtraPlans} from './english-extra.ts';
import {mathExtraPlans,mathExtraBank} from './math-extra.ts';
import {bank,periodOf} from './bank.ts';
import {chineseMorePlans} from './chinese-more.ts';
import {englishMorePlans} from './english-more.ts';
import {mathMorePlans} from './math-more.ts';
import {scienceMorePlans} from './science-more.ts';
import {socialMorePlans} from './social-more.ts';
import type {ExamPeriod,Question,Subject} from './types.ts';
export type Tier='基本題'|'應用題';
export type Concept={id:string;title:string;goal:string;basic:string[];application:string[]};
export type PlanUnit={id:string;title:string;concepts:Concept[]};
export type StudyPlan={id:string;subject:Subject;edition:string;year:number;period:ExamPeriod;range:string;scopeNote:string;sourceId:string;units:PlanUnit[];missing:string[]};
function concept(source:string,id:string,title:string,goal:string,basic:string[]=[],application:string[]=[]):Concept{
 const ids=(numbers:string[])=>numbers.map(n=>{const q=bank.find(q=>q.questionSourceId===source&&q.originalQuestionNumber===n);if(!q)throw Error(`缺少觀念對照題：${source}/${n}`);return q.questionId;});
 return {id:source+'-'+id,title,goal,basic:ids(basic),application:ids(application)};
}
function unit(id:string,title:string,concepts:Concept[]):PlanUnit{return {id,title,concepts};}
const m='ddes-math-paper',c='ddes-chinese-paper',s='ptes-social-paper',n='taes-自然-paper',e='taes-英語-paper',tm='taes-數學-paper',tc='taes-國語-paper';
const C=concept;
export const studyPlans:StudyPlan[]=[
 {id:'ddes-math-114',subject:'數學',edition:'版本未標示・大墩114',year:114,period:'六上第一次段考',sourceId:m,range:'原卷主題：因數與分數、小數除法、比與比值',scopeNote:'原卷未明示教材版本與完整單元範圍；以下按原題整理，不視為任何版本的完整期中目次。',missing:['教材版本與章節範圍尚待核對','圖表題及有疑義答案未收錄'],units:[
 unit('factors','因數與分數',[
 C(m,'prime','質數、合數與互質','辨識合數、互質及最大公因數的判斷條件。',['一、2','一、3','二、2']),
 C(m,'reduced','最簡分數','檢查最簡分數與公因數之間的關係。',['一、1']),
 C(m,'division','分數連除','依運算順序處理分數連除。',['二、1']),
 C(m,'fraction-context','分數的情境解題','從文字情境辨識數量關係，再選擇分數運算。')]),
 unit('decimal','小數除法',[C(m,'place','位值與商的判斷','分辨被除數、除數的位值變化是否維持相同的商。',['一、4']),C(m,'decimal-context','小數除法應用','從生活條件列出除法算式並核對單位。')]),
 unit('ratio','比與比值',[C(m,'simplify','最簡整數比','將小數比轉成最簡整數比。',['一、5']),C(m,'age','變動數量與比','分析年齡一起增加時，比是否保持不變。',[],['一、6'])])]},
 {id:'ddes-chinese-114',subject:'國語',edition:'版本未標示・大墩114',year:114,period:'六上第一次段考',sourceId:c,range:'原卷獨立文字題：文章特色、字音、修辭',scopeNote:'未核對完整課次，僅列出現有獨立題可對照的語文能力。',missing:['課本版本、課次及各課生字範圍尚未建立','課文閱讀、段落大意、寫作與跨文本題未收錄'],units:[
 unit('genre','文章特色',[C(c,'science-text','科普文的呈現方式','辨識說明資訊的文字、圖表與補充說明等形式。',['三、2']),C(c,'reading','閱讀證據','從完整文章找出支持判斷的語句。')]),
 unit('sound','字音',[C(c,'polyphone','一字多音','依詞語語境辨識同一字的不同讀音。',['三、3'])]),
 unit('rhetoric','修辭',[C(c,'metonymy','借代與代稱','辨識事物名稱與所指對象的關係。',['三、4']),C(c,'rhetoric-effect','修辭的表達效果','結合上下文判斷修辭使用的用意。')])]},
 {id:'taes-chinese-109',subject:'國語',edition:'康軒版・同安109',year:109,period:'六下期末考',sourceId:tc,range:'原卷明示：第七至十一課',scopeNote:'課次依原卷標題；本頁目標為原卷題型整理，尚未取得同年度完整教師指引。',missing:['第七至十課的課文理解題尚未收錄','生字字音、改錯、寫作及完整閱讀材料尚缺','跨課詞語題不強行歸入特定一課'],units:[
 unit('cross-language','第七至十一課・跨課詞語',[C(tc,'synonym','詞語替換','判斷替換後的詞語是否保留原句意思。',['三、2']),C(tc,'word-writing','語境中的詞語運用','在較完整的段落中選用合適詞語。')]),
 unit('lesson7','第七課・油條報紙・文字夢',[C(tc,'l7','人物經歷與敘事','整理人物經歷的先後、轉折與文章主旨。')]),
 unit('lesson8','第八課・雕刻一座小島',[C(tc,'l8','文體與描寫','辨識文章文體、描寫方法與用詞效果。')]),
 unit('lesson9','第九課・童年・夏日・棉花糖',[C(tc,'l9','童詩的意象與聯想','從語句辨識詩中的意象、聯想及情感。')]),
 unit('lesson10','第十課・追夢的翅膀',[C(tc,'l10','人物行動與主旨','連結人物的選擇、行動與文章傳達的意思。')]),
 unit('lesson11','第十一課・祝賀你，孩子',[C(tc,'l11-word','語句中的稱謂含義','依語境辨識稱謂所包含的意思。',['三、6']),C(tc,'l11-message','祝福語句與篇章用意','結合上下文理解期許與祝福的表達。')])]},
 {id:'taes-english-109',subject:'英語',edition:'何嘉仁版・同安109',year:109,period:'六下期末考',sourceId:e,range:'原卷明示：U3～Review 2（系列名稱未標示）',scopeNote:'原卷未提供可核對的U3/U4完整課名，故不猜測各課歸屬；以下用原卷語言主題整理。',missing:['教材系列、U3/U4各課目次尚待核對','聽力、圖像辨識、句子改寫、翻譯與篇章閱讀尚未收錄'],units:[
 unit('past','U3～Review 2・過去式與問答',[C(e,'did','Did問句與簡答','辨識一般過去式問句與簡答的對應。',['八、1','八、2']),C(e,'verb','肯定與否定句的動詞形式','依時間詞、助動詞判斷動詞形式。',['八、3','八、5']),C(e,'wh','What問句的回答','分辨詢問活動內容的問句與合適回答。',['八、4']),C(e,'conversation','完整對話與閱讀','依多句對話判斷人物、活動與時間。')]),
 unit('phonics','U3～Review 2・字母組合發音',[C(e,'ow','ow／ou等畫線發音辨別','比較同組單字畫線部分的發音。',['六、1','六、3']),C(e,'oy','ay／ai／oy／oi等畫線發音辨別','比較不同字母組合在單字中的發音。',['六、4','六、5']),C(e,'listening','聽音辨詞','透過音檔辨認單字，不以文字題代替聽力。')])]},
 {id:'taes-math-109',subject:'數學',edition:'翰林版・同安109',year:109,period:'六下期末考',sourceId:tm,range:'原卷明示：第四至六單元；另有跨單元回顧',scopeNote:'單元號碼依標題；完整章名尚未核實，以下採原卷主題名稱，避免套用其他年度目次。',missing:['第四至六單元的完整章名尚待同年度目次核對','原卷大部分計算、圖表及解題題型尚未收錄'],units:[
 unit('math-review','跨單元回顧・質數與合數',[C(tm,'primes','質數辨識','從一組整數辨識質數。',['一、4'])]),
 unit('problem','原卷主題・怎樣解題',[C(tm,'chicken','雞兔數量的限制','結合動物腳數的條件，判斷可能與不可能的數量。',[],['二、1(3)']),C(tm,'model','列表與線段圖','用表格或線段圖整理條件。'),C(tm,'age','年齡與和差問題','建立兩個量之間的和、差、倍數關係。')]),
 unit('percent','原卷主題・基準量與百分率',[C(tm,'reference','基準量與比較量','辨認哪一個量當作1，再處理倍數關係。'),C(tm,'discount','折扣與成長率','分辨原量、改變量與改變後的量。')]),
 unit('statistics','原卷主題・統計圖與速率',[C(tm,'chart','圓形圖與百分率','讀取統計表並檢查整體與部分的關係。'),C(tm,'speed','速率與追趕、相遇','先統一單位，再連結距離、時間與速率。')])]},
 {id:'taes-science-109',subject:'自然',edition:'南一版・同安109',year:109,period:'六下期末考',sourceId:n,range:'原卷主題：簡單機械、生物、環境、顯微鏡與能源',scopeNote:'原卷明示南一版，但沒有章次範圍。以下為原卷主題清單，不宣稱與現行南一版單元相同。',missing:['同年度課本完整單元目次與本次章次尚待核對','槓桿、滑輪的圖解判斷，以及實驗操作與圖表探究題尚缺'],units:[
 unit('machines','簡單機械',[C(n,'axle','輪軸的帶動方式','區分輪帶軸、軸帶輪及省力／費力的描述。',['一、1','一、5'],['二、3']),C(n,'gears','齒輪與鏈條的轉動','分析齒輪咬合、鏈條帶動時的方向與齒數關係。',['一、4','一、8'],['二、5','二、6']),C(n,'tools','工具與傳動方式','辨識生活工具所用的傳動裝置。',['二、10']),C(n,'lever','槓桿與滑輪圖解','由施力、支點及裝置圖判斷作用。')]),
 unit('biology','生物與環境',[C(n,'adapt','生物構造與環境適應','連結動物特徵、體溫及棲地條件。',['一、9'],['二、2','二、11']),C(n,'species','外來種與候鳥','辨識外來種影響與鳥類遷徙類型。',['二、8','二、9']),C(n,'ecology','生態資料判讀','從觀察紀錄比較生物與棲地的關係。')]),
 unit('environment','環境與永續',[C(n,'carbon','碳足跡與節約資源','辨識碳足跡、節水及環保標章的意義。',['一、2','一、10','二、4']),C(n,'warming','暖化與環境影響','區分暖化影響與其他環境問題。',['一、3'],['二、14']),C(n,'aqi','空氣品質指標','辨識AQI數值與品質描述的關係。',['二、7']),C(n,'data','環境圖表與行動','依地圖或數據選擇合適的環境行動。')]),
 unit('microscope','顯微鏡觀察',[C(n,'lens','構造與觀察用途','辨識顯微鏡的構造、放大與觀察用途。',['一、7','二、13']),C(n,'operation','操作與倍率','根據操作步驟或影像判斷觀察結果。')]),
 unit('energy','能源轉換',[C(n,'generation','發電方式與能量來源','配對不同發電方式與所用的原料或能量。',['三、(2)1','三、(2)2','三、(2)3','三、(2)4','三、(2)5']),C(n,'energy-choice','能源選擇與環境取捨','依情境資料比較不同能源的效益與限制。')])]},
 {id:'ptes-social-114',subject:'社會',edition:'版本未標示・北投114',year:114,period:'六下期末考',sourceId:s,range:'原卷主題：全球環境、人權與國際合作',scopeNote:'教科書版本與章次未標示；只對照原卷主題，不套用南一、康軒或翰林的章節。',missing:['教材版本、章次及完整考試範圍尚未核對','新聞閱讀、跨資料比較、地圖與論述題尚未收錄'],units:[
 unit('global','全球環境',[C(s,'climate','暖化與災害風險','將環境變化連結到海平面與淹水風險。',[],['一、2','二、2']),C(s,'agreement','氣候合作與水資源','辨識國際氣候合作及來源所載水資源資訊。',['一、3','一、5']),C(s,'evidence','環境議題的資料判讀','比較圖表、報導與不同立場的證據。')]),
 unit('rights','人權與國際合作',[C(s,'rights','勞動與消費中的人權','從工作待遇與購買行為辨識權益問題。',[],['一、6','二、7']),C(s,'org','國際組織與功能','辨識聯合國、WHO及國際奧會等組織的功能。',['一、7','一、9','一、10']),C(s,'connection','全球事件的連鎖影響','連結能源政策與全球經濟影響。',[],['一、8']),C(s,'citizen','多方觀點與公民行動','比較利害關係與資料後提出有依據的行動。')])]},
];
const newPlans:{id:string;subject:Subject;sourceId:string;edition:string;year:number;period:ExamPeriod;range:string;goals:Record<string,string>;applications:string[]}[]=[
 {id:'hses-english-11421',subject:'英語',sourceId:'hses-english-11421-paper',edition:'版本未標示・和順114期中',year:114,period:'六下第一次段考',range:'原卷語言主題：過去式、地點與日常活動問答',goals:{'過去式與問答':'區分did與be動詞過去式，依問句選擇動詞形式與地點回答。','日常對話':'辨識交通方式、用餐時間與休閒活動的對應問答。'},applications:['七、26','七、27','七、28','七、30']},
 {id:'hses-english-11422',subject:'英語',sourceId:'hses-english-11422-paper',edition:'版本未標示・和順114期末',year:114,period:'六下期末考',range:'原卷語言主題：時間、價格與數量、所有格與過去式',goals:{'時間介系詞':'辨認鐘點時間所用的介系詞。','數量與價格問句':'辨識how many與how much及單複數be動詞。','所有格與代名詞':'配對所有格與對應的主詞所有格。','過去式與問答':'依過去時間詞選用be動詞過去式。'},applications:['七、27']},
 {id:'hses-science-11312',subject:'自然',sourceId:'hses-science-11312-paper',edition:'版本未標示・和順113',year:113,period:'六上期末考',range:'原卷主題：電磁鐵、流水、岩石礦物、地震與地景',goals:{'電磁鐵':'辨識磁極、電流與磁力的變因，並比較電磁鐵、磁鐵與馬達的應用。','岩石與礦物':'區分岩石形成原因並連結礦物用途。','流水與地形':'連結河流坡度、速度、侵蝕、搬運與堆積。','地震與地景保育':'辨識地震原因與地質公園的功能。'},applications:['二、1','二、3','二、4','二、6','二、7','二、9','六、3(1)','六、3(2)','六、3(3)','六、3(4)','六、3(5)']},
 {id:'hses-science-11412',subject:'自然',sourceId:'hses-science-11412-paper',edition:'版本未標示・和順114期末',year:114,period:'六上期末考',range:'原卷主題：流水、岩石礦物、電磁鐵及地震防災',goals:{'電磁鐵':'辨識電流磁效應、磁力控制、改變磁極與生活應用。','岩石與礦物':'從形成原因、刻劃結果、特徵與用途辨認岩石及礦物。','流水與地形':'連結河流上中下游特徵與風化、侵蝕、堆積。','地震與防災':'區分震源、震央、規模、震度並辨認避難用品的保存條件。'},applications:['一、1','一、3','一、5','一、9','一、10','一、12','一、14','一、17','一、18','一、19','一、23','一、24','二、3(1)','二、3(2)','二、3(3)','二、3(4)']},
 {id:'hses-science-11411',subject:'自然',sourceId:'hses-science-11411-paper',edition:'版本未標示・和順114期中',year:114,period:'六上第一次段考',range:'已核對的原卷主題：水的形態與天氣',goals:{'水的形態與天氣':'依水蒸氣遇冷的位置與溫度，區分雲、露、霧及霜。'},applications:[]},
 {id:'hses-chinese-11311',subject:'國語',sourceId:'hses-chinese-11311-paper',edition:'版本未標示・和順113',year:113,period:'六上第一次段考',range:'原卷獨立文字題：字音、字詞、句意、文章結構與成語',goals:{'字形與詞語':'依完整語境辨識字形、詞義及近義詞替換。','字音':'依詞義分辨多音字在語句中的讀音。','文章結構':'辨識議論文結構及科普文的說明方式。','語句理解':'檢查語意矛盾、主被動及語序改變造成的差異。','關聯詞':'依前後分句關係選用關聯詞。','成語運用':'依人物行為、事件與語境選擇合適成語。'},applications:['三、5','三、6','三、7','三、9','三、11','三、15','三、16','三、17']},
 {id:'hses-math-11311',subject:'數學',sourceId:'hses-math-11311-paper',edition:'版本未標示・和順113',year:113,period:'六上第一次段考',range:'原卷主題：質因數、公因數與公倍數、分數與小數除法、比',goals:{'質因數與質數':'辨識質數、質因數及1的性質。','最簡分數':'檢查最簡分數和公因數的關係。','小數除法':'理解位值、商的大小與四捨五入。','比與數量關係':'依情境辨認兩數量的對應、等比與是否維持相同比值。','公因數與公倍數':'從整除及等分情境區分公因數、公倍數。','分數除法':'從單位量與倍數關係判斷除法算式。','數量關係':'從總數和部分數量判斷未知數。'},applications:['一、5','一、6','一、9','二、1','二、3','二、4','二、5','二、6','二、9','二、11','二、12','二、14']},
 {id:'taes-social-109',subject:'社會',sourceId:'taes-社會-paper',edition:'康軒版・同安109',year:109,period:'六下期末考',range:'原卷明示：第三至四單元',goals:{'塑膠與海洋環境':'辨識一次性塑膠、海流垃圾聚集與生態影響。','氣候與永續':'辨識氣候變遷、國際合作、能源與綠建築。','糧食與水資源':'區分資源總量、分配與糧食援助的作用。','國際組織':'依議題辨認相關國際組織的功能。','全球經濟與人權':'連結全球經濟、資源、貿易與人權保障。'},applications:['一、(二)5','一、(二)7','一、(三)3','一、(三)8','一、(四)6','二、(三)2','二、(三)3','二、(三)5','二、(三)6']}
];
for(const p of newPlans){
 const qs=bank.filter(q=>q.questionSourceId===p.sourceId&&!mathExtraBank.some(extra=>extra.questionId===q.questionId));
 studyPlans.push({id:p.id,subject:p.subject,sourceId:p.sourceId,edition:p.edition,year:p.year,period:p.period,range:p.range,scopeNote:'按已核對的原卷主題整理觀念；基本題與應用題是本站題型分類，不是原校難度標籤，也不代表完整版本目次。',missing:['完整教材目次與各校本次進度仍須分別核對','圖像、第三方引用閱讀、非選擇作答及有疑義題目未收錄'],units:Object.entries(p.goals).map(([title,goal],i)=>({id:p.id+'-unit-'+i,title,concepts:[{id:p.id+'-concept-'+i,title,goal,basic:qs.filter(q=>q.unit===title&&!p.applications.includes(q.originalQuestionNumber)).map(q=>q.questionId),application:qs.filter(q=>q.unit===title&&p.applications.includes(q.originalQuestionNumber)).map(q=>q.questionId)}]}))});
}
studyPlans.push(...englishNicolePlans,...englishExtraPlans,...mathExtraPlans,...chineseMorePlans,...englishMorePlans,...mathMorePlans,...scienceMorePlans,...socialMorePlans);
export function planQuestions(plan:StudyPlan,period:string='全部',reports:Record<string,unknown>={}){const ids=new Set(plan.units.flatMap(u=>u.concepts.flatMap(c=>[...c.basic,...c.application])));return bank.filter(q=>ids.has(q.questionId)&&q.status==='sourceChecked'&&q.questionSourceId===plan.sourceId&&(period==='全部'||periodOf(q)===period)&&!reports[q.questionId]);}
export function conceptQuestions(c:Concept,tier:Tier,pool:Question[]){const ids=tier==='基本題'?c.basic:c.application;return pool.filter(q=>ids.includes(q.questionId));}
export function coverage(plan:StudyPlan,pool:Question[]){const concepts=plan.units.flatMap(u=>u.concepts);return {concepts:concepts.length,withBasic:concepts.filter(c=>conceptQuestions(c,'基本題',pool).length).length,withApplication:concepts.filter(c=>conceptQuestions(c,'應用題',pool).length).length,both:concepts.filter(c=>conceptQuestions(c,'基本題',pool).length&&conceptQuestions(c,'應用題',pool).length).length};}
export function mappingOf(q:Question){for(const p of studyPlans)for(const u of p.units)for(const c of u.concepts){if(c.basic.includes(q.questionId))return {plan:p,unit:u,concept:c,tier:'基本題' as Tier};if(c.application.includes(q.questionId))return {plan:p,unit:u,concept:c,tier:'應用題' as Tier};}return undefined;}
