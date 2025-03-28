var de=Object.defineProperty;var ue=(e,t,a)=>t in e?de(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a;var T=(e,t,a)=>ue(e,typeof t!="symbol"?t+"":t,a);import{aI as s,aJ as k,aK as me,aL as he,aM as h,r as f,aH as pe}from"./vendor-BV1dCkyd.js";import{L as F,T as A,R as L,C as $,a as z,B as x,M as fe,F as w,I as ye,s as H,A as xe,b as be,c as X,S as Te,d as R,e as je,f as Se}from"./antd-OsG9eBrV.js";import{U,A as Q,a as ee,P as Ee,C as ge,b as ve,c as Ne,d as Ae,S as Ie,M as Pe,e as Ce,f as we,R as Me,g as Oe}from"./lucide-react-D9c3o07C.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=a(r);fetch(r.href,i)}})();const G="#ff681f",{Header:Re}=F,{Title:De}=A,_e="/urbancentro-fc";function ke(){return s.jsx(Re,{className:"team-header",onClick:()=>window.location.href=_e,children:s.jsxs("div",{className:"team-header-content",children:[s.jsx(U,{size:24,style:{color:G}}),s.jsx(De,{level:4,children:"Urbancentro FC"})]})})}const Y={players:[],availablePlayerCount:0},I=k((e,t)=>({...Y,setPlayers:a=>e(n=>{const r=typeof a=="function"?a(n.players):a;return{players:r,availablePlayerCount:r.filter(i=>i.isAvailable).length}}),getAvailablePlayers:()=>t().players.filter(n=>n.isAvailable),togglePlayerAvailability:a=>e(n=>{const r=n.players.map(i=>i.id===a?{...i,isAvailable:!i.isAvailable}:i);return{players:r,availablePlayerCount:r.filter(i=>i.isAvailable).length}}),resetPlayerState:()=>e(Y)})),E={FORWARD:"forward",MIDFIELDER:"midfielder",DEFENDER:"defender"},j={HIGH:"high",MID:"mid"},M="2099",se=99,V=E.MIDFIELDER,O=j.MID;class g{constructor(t){T(this,"id");T(this,"name");T(this,"year");T(this,"position");T(this,"condition");T(this,"number");T(this,"isGuest");T(this,"isAvailable");this.id=t.id||`${t.year}-${t.name}-${t.number}`,this.name=t.name||"",this.year=t.year||M,this.number=t.number||se,this.position=t.position||V,this.condition=t.condition||O,this.isGuest=t.isGuest||!1,this.isAvailable=t.year!==M}static createFromData(t){return new g(t)}toggleSelection(){this.isAvailable=!this.isAvailable}updateCondition(t){this.condition=t}}const te={FIVE_TWO_TEAMS:{ID:"5:5",TITLE:"5 vs 5",DESCRIPTION:"총 10명",TEAM_COUNT:2,PLAYERS_PER_TEAM:5},SIX_TWO_TEAMS:{ID:"6:6",TITLE:"6 vs 6",DESCRIPTION:"총 12명",TEAM_COUNT:2,PLAYERS_PER_TEAM:6},SEVEN_TWO_TEAMS:{ID:"7:7",TITLE:"7 vs 7",DESCRIPTION:"총 14명",TEAM_COUNT:2,PLAYERS_PER_TEAM:7},FIVE_THREE_TEAMS:{ID:"5:5:5",TITLE:"5 vs 5 vs 5",DESCRIPTION:"총 15명",TEAM_COUNT:3,PLAYERS_PER_TEAM:5},SIX_THREE_TEAMS:{ID:"6:6:6",TITLE:"6 vs 6 vs 6",DESCRIPTION:"총 18명",TEAM_COUNT:3,PLAYERS_PER_TEAM:6},SEVEN_THREE_TEAMS:{ID:"7:7:7",TITLE:"7 vs 7 vs 7",DESCRIPTION:"총 21명",TEAM_COUNT:3,PLAYERS_PER_TEAM:7}};function Fe(e){return[...e].sort(()=>Math.random()-.5)}function Le(e){e.players.forEach(a=>{a.condition=j.MID});const t=e.players.length-1;for(let a=0;a<=t;a++){if(a===0||a===t){e.players[a].condition=j.HIGH;continue}const n=a===1?.7:a===2?.5:.02;Math.random()<n&&(e.players[a].condition=j.HIGH)}}function $e(e,t){t.forEach(([a,n])=>{let r,i;for(const o of e)o.players.some(d=>d.name===a)&&(r=o),o.players.some(d=>d.name===n)&&(i=o);if(r&&i&&r===i){const o=e.find(d=>d!==r);if(o){const d=i.players.find(c=>c.name===n);d&&(r.players=r.players.filter(c=>c.name!==n),o.players.push(d));const l=o.players.find(c=>c.position===E.MIDFIELDER);l&&(o.players=o.players.filter(c=>c.id!==l.id),r.players.push(l))}}})}function ze(e,t){const a=[["지원","지원 2"]],r=t.split(":").map(Number).length,i={};e.forEach(l=>{i[l.position]||(i[l.position]=[]),i[l.position].push(l)});const o=Array.from({length:r},(l,c)=>({name:`팀 ${String.fromCharCode(65+c)}`,players:[]})),d=l=>{var p;if(!((p=i[l])!=null&&p.length))return;const c=Fe([...i[l]]);for(let m=0;m<r&&c.length>0;m++)o[m].players.push(c.shift());for(;c.length>0;)o.reduce((S,u)=>u.players.length<S.players.length?u:S,o[0]).players.push(c.shift())};return d(E.DEFENDER),d(E.FORWARD),d(E.MIDFIELDER),$e(o,a),o.forEach(Le),o.forEach(l=>l.players.sort((c,p)=>c.year.localeCompare(p.year))),o}const He=e=>{const t=window.Kakao,a=window.location.origin+window.location.pathname,n=e.teams?`?teams=${JSON.stringify(e.teams)}`:"",r=a+n;t.Share.sendDefault({objectType:"text",text:e.description,link:{webUrl:r,mobileWebUrl:r}})},B={teams:[],teamCount:0,playersPerTeam:0,requiredPlayers:0},P=k(e=>({...B,setTeamOption:(t,a)=>e(()=>({teamCount:t,playersPerTeam:a,requiredPlayers:t*a})),setTeams:t=>e(()=>({teams:t})),resetTeamState:()=>e(B)}));function ae(e,t){return e===0?{type:"warning",message:`${t}명의 선수를 선택해주세요`}:e<t?{type:"warning",message:`${t-e}명이 더 필요합니다`}:e>t?{type:"error",message:`${e-t}명이 초과되었습니다`}:{type:"success",message:"인원이 맞습니다"}}function D(e){return e.map(t=>{const a=t.players.map(n=>`${n.year?`${n.year.slice(-2)}`:"99"} ${n.name} ${n.condition===j.HIGH?"↑":""}`).join(`
`);return`${t.name}
${a}`}).join(`

`)}function Ue(e){if(!e)throw new Error("팀 데이터를 불러오는데 실패했습니다.");try{return JSON.parse(e).map((n,r)=>({id:String(r+1),name:`팀 ${n[0]}`,players:n[1].map((i,o)=>{const[d,l,c]=i.split("-");return new g({id:`shared-${r}-${o}`,name:l,year:d,position:E.MIDFIELDER,condition:c||O,isGuest:!0,isAvailable:!0})})}))}catch{throw new Error("팀 데이터를 불러오는데 실패했습니다.")}}const K={activeTab:"team-setup",isSharedView:!1},Ge=e=>({...K,setActiveTab:t=>e({activeTab:t}),setIsSharedView:t=>e({isSharedView:t}),resetFlowState:()=>e(K)}),v=k()(me(he((...e)=>({...Ge(...e)})),{name:"urbancentro-fc-team-setup-flow-store",enabled:!1}));function Ve(){return v(h(({activeTab:e})=>e))}function ne(){return v(h(({setActiveTab:e})=>e))}function re(){return P(h(({setTeamOption:e})=>e))}function Ye(){return P(h(({requiredPlayers:e})=>e))}function Be(){return I(h(({getAvailablePlayers:e})=>e))}function Ke(){return I(h(({setPlayers:e})=>e))}function ie(){return P(h(({teams:e})=>e))}function We(){return P(h(({teamCount:e,setTeams:t})=>({teamCount:e,setTeams:t})))}function Je(){return v(h(({isSharedView:e,activeTab:t})=>({isSharedView:e,activeTab:t})))}function Ze(){return I(h(({players:e,availablePlayerCount:t,setPlayers:a,togglePlayerAvailability:n})=>({players:e,availablePlayerCount:t,setPlayers:a,togglePlayerAvailability:n})))}const qe=32,_=20;function Xe(){const[e,t]=f.useState(null),a=ne(),n=re(),r=o=>()=>{t(o);const d=Object.values(te).find(l=>l.ID===o);d&&n(d.TEAM_COUNT,d.PLAYERS_PER_TEAM)};function i(){a("player-selection")}return{selectedOption:e,handleOptionClick:r,handleNextClick:i}}const{Title:W,Text:J}=A,Z={TEAM:32,ARROW:16},Qe=Object.values(te).map(e=>({id:e.ID,title:e.TITLE,description:e.DESCRIPTION}));function es(){const{selectedOption:e,handleOptionClick:t,handleNextClick:a}=Xe();return s.jsxs("div",{className:"team-setup-container",children:[s.jsxs("div",{className:"team-setup-header",children:[s.jsx(W,{level:4,children:"팀 구성 선택"}),s.jsx(J,{type:"secondary",children:"원하는 팀 구성을 선택해주세요"})]}),s.jsx(L,{gutter:[16,16],className:"team-option-row",children:Qe.map(n=>s.jsx($,{xs:12,md:8,children:s.jsx(z,{hoverable:!0,className:`team-option-card ${e===n.id?"selected":""}`,onClick:t(n.id),children:s.jsxs("div",{className:"team-option-content",children:[s.jsx(U,{size:Z.TEAM,className:e===n.id?"icon-selected":"icon-default"}),s.jsx(W,{level:5,className:"option-title",children:n.title}),s.jsx(J,{type:"secondary",children:n.description})]})})},n.id))}),s.jsx("div",{className:"next-button-container",children:s.jsx(x,{type:"primary",size:"large",icon:s.jsx(Q,{size:Z.ARROW}),onClick:a,disabled:!e,className:"next-button",children:"다음"})})]})}function ss({form:e,onOpenModal:t}){const a=Ke();return{onFinish:r=>{const i=new g({id:`guest-${Date.now()}`,name:r.name,year:M,number:se,position:V,condition:O,isGuest:!0,isAvailable:!0});a(o=>[i,...o]),t(!1)(),e.resetFields()}}}const ts=16;function as({form:e,isModalOpen:t,onOpenModal:a}){const{onFinish:n}=ss({form:e,onOpenModal:a});return s.jsx(fe,{title:"게스트 추가",width:350,open:t,onCancel:a(!1),footer:null,children:s.jsxs(w,{form:e,layout:"vertical",onFinish:n,children:[s.jsx(w.Item,{name:"name",label:"이름",rules:[{required:!0,message:"이름을 입력해주세요"}],children:s.jsx(ye,{placeholder:"게스트 이름"})}),s.jsx(w.Item,{className:"modal-footer",children:s.jsx(x,{type:"primary",htmlType:"submit",icon:s.jsx(ee,{size:ts}),className:"add-guest-button",children:"추가하기"})})]})})}function ns(){const[e,t]=H.useMessage(),{requiredPlayers:a}=P(),{availablePlayerCount:n}=I(),{activeTab:r}=v();return f.useEffect(()=>{const i=ae(n,a);r==="player-selection"&&e.open({key:"player-selection",type:i.type,content:i.message})},[n,e,r,a]),{contextHolder:t}}function rs(){const{contextHolder:e}=ns();return s.jsx(s.Fragment,{children:e})}const is=[{year:"2099",number:90,name:"지원",position:"defender"},{year:"2099",number:91,name:"지원 2",position:"defender"},{year:"1973",number:10,name:"김정표",position:"forward"},{year:"1984",number:30,name:"최현석",position:"midfielder"},{year:"1985",number:9,name:"전인정",position:"forward"},{year:"1986",number:11,name:"김성일",position:"midfielder"},{year:"1986",number:51,name:"송승근",position:"defender"},{year:"1986",number:28,name:"조용일",position:"defender"},{year:"1987",number:33,name:"강병용",position:"defender"},{year:"1987",number:20,name:"박준우",position:"midfielder"},{year:"1987",number:17,name:"양성호",position:"defender"},{year:"1987",number:19,name:"홍승우",position:"midfielder"},{year:"1988",number:0,name:"우상욱",position:"defender"},{year:"1989",number:0,name:"박근휘",position:"forward"},{year:"1989",number:8,name:"김동수",position:"midfielder"},{year:"1989",number:0,name:"박준범",position:"midfielder"},{year:"1989",number:1,name:"윤용준",position:"midfielder"},{year:"1989",number:4,name:"이원식",position:"forward"},{year:"1989",number:12,name:"이한별",position:"forward"},{year:"1989",number:22,name:"임은철",position:"forward"},{year:"1989",number:31,name:"장세원",position:"forward"},{year:"1989",number:42,name:"최승빈",position:"forward"},{year:"1989",number:7,name:"이원재",position:"midfielder"},{year:"1990",number:5,name:"박치환",position:"midfielder"},{year:"1990",number:13,name:"이민수",position:"defender"},{year:"1990",number:24,name:"임시현",position:"midfielder"},{year:"1991",number:6,name:"김백상",position:"midfielder"},{year:"1991",number:0,name:"김혁준",position:"defender"},{year:"1993",number:0,name:"황윤하",position:"forward"}];function os(){const e=Ye(),t=ne(),{players:a,availablePlayerCount:n,setPlayers:r,togglePlayerAvailability:i}=Ze(),[o,d]=f.useState(!1),[l]=w.useForm(),c=n!==e,p=f.useMemo(()=>ae(n,e),[n,e]),m=y=>()=>{d(y)},S=y=>()=>{i(y)},u=()=>{t("team-setup")},b=()=>{t("team-distribution")};return f.useEffect(()=>{const y=is.map(C=>new g({...C,position:C.position}));r(y)},[r]),{form:l,players:a,status:p,isDisabled:c,isModalOpen:o,handleModalOpen:m,handlePlayerClick:S,handlePrevClick:u,handleNextClick:b}}const{Title:ls,Text:q}=A,N=16;function cs(){const{form:e,players:t,status:a,isDisabled:n,isModalOpen:r,handleModalOpen:i,handlePlayerClick:o,handlePrevClick:d,handleNextClick:l}=os();return s.jsxs("div",{className:"player-selection-container",children:[s.jsxs("div",{className:"section-header",children:[s.jsx(ls,{level:4,children:"선수 선택"}),s.jsx(q,{type:"secondary",children:"참여할 선수를 선택해주세요"})]}),s.jsxs("div",{className:"control-panel",children:[s.jsx(x,{type:"dashed",icon:s.jsx(Ee,{size:N}),onClick:i(!0),className:"guest-add-button",children:"게스트 추가"}),s.jsx(xe,{showIcon:!0,message:a.message,type:a.type,icon:a.type==="success"?s.jsx(ge,{size:N}):s.jsx(ve,{size:N}),className:"status-alert"})]}),s.jsx("div",{className:"players-scroll-container",children:s.jsx(L,{gutter:[16,16],className:"player-row",children:t.map(c=>s.jsx($,{xs:12,sm:12,md:8,children:s.jsx(z,{hoverable:!0,className:`player-card ${c.isAvailable?"selected":""}`,onClick:o(c.id),children:s.jsxs("div",{className:"player-card-content",children:[s.jsx(be,{checked:c.isAvailable}),s.jsx("div",{className:"player-info",children:s.jsxs("div",{className:"player-name-container",children:[s.jsxs(q,{strong:!0,children:[c.year.slice(-2)," ",c.name]}),c.isGuest&&s.jsx(X,{count:"G",style:{backgroundColor:G}})]})})]})})},c.id))})}),s.jsx("div",{className:"next-button-container player-selection",children:s.jsxs("div",{className:"button-group",children:[s.jsx(x,{size:"large",icon:s.jsx(Ne,{size:N}),onClick:d,className:"prev-button",children:"이전"}),s.jsx(x,{type:"primary",size:"large",icon:s.jsx(Q,{size:N}),onClick:l,disabled:n,className:"next-button",children:"다음"})]})}),s.jsx(as,{form:e,isModalOpen:r,onOpenModal:i}),s.jsx(rs,{})]})}const{Text:ds}=A;function oe({isShuffle:e}){const t=ie();return s.jsx(s.Fragment,{children:e?s.jsx("div",{className:"loading-container",children:s.jsx(Te,{size:"large",style:{fontSize:"48px"}})}):s.jsx(L,{gutter:[8,8],className:"team-row",children:t.map(a=>s.jsx($,{xs:8,md:8,children:s.jsx(z,{title:s.jsxs("div",{className:"team-header",children:[s.jsx("span",{children:a.name}),s.jsx(X,{count:a.players.length})]}),className:"team-card",children:s.jsx("div",{className:"player-list",children:a.players.map(n=>s.jsxs("div",{className:"player-item",children:[s.jsxs(ds,{children:[n.year?`${n.year.slice(-2)} `:"G ",n.name]}),n.condition===j.HIGH&&s.jsx(Ae,{className:"arrow-big-up"})]},n.id))})})},a.name))})})}function us({isShuffle:e}){return s.jsxs(s.Fragment,{children:[s.jsx(oe,{isShuffle:e}),s.jsx("div",{className:"button-container"})]})}function ms(){const e=ie(),{setActiveTab:t}=v(),[a,n]=H.useMessage(),r=async()=>{try{const l=D(e);navigator.share?await navigator.share({title:"팀 분배 결과",text:l}):(await navigator.clipboard.writeText(l),a.success("클립보드에 복사되었습니다."))}catch(l){l instanceof Error&&l.message!=="Share canceled"&&a.error("공유에 실패했습니다."),console.error("공유 실패 :",l.message)}},i=async()=>{try{const l=D(e);await navigator.clipboard.writeText(l),a.success("클립보드에 복사되었습니다.")}catch{a.error("복사에 실패했습니다.")}},o=()=>{const l=e.map(p=>[p.name.slice(-1),p.players.map(m=>`${m.year?`${m.year.slice(-2)}`:"99"}-${m.name}-${m.condition===j.HIGH?j.HIGH:""}`)]),c=D(e);He({teams:l,description:c})};function d(){t("player-selection")}return{contextHolder:n,handleNativeShare:r,handleCopyToClipboard:i,handleShareKakao:o,handlePrevClick:d}}function hs({isShuffle:e,onClickShuffle:t}){const{contextHolder:a,handleNativeShare:n,handleCopyToClipboard:r,handleShareKakao:i,handlePrevClick:o}=ms();return s.jsxs("div",{className:"button-container",children:[a,s.jsxs("div",{className:"share-icons",children:[s.jsx(R,{title:"공유하기",children:s.jsx(x,{type:"text",icon:s.jsx(Ie,{size:24}),onClick:n,className:"share-icon-button"})}),s.jsx(R,{title:"카카오톡 공유",children:s.jsx(x,{type:"text",icon:s.jsx(Pe,{size:24}),onClick:i,className:"share-icon-button kakao"})}),s.jsx(R,{title:"클립보드에 복사",children:s.jsx(x,{type:"text",icon:s.jsx(Ce,{size:24}),onClick:r,className:"share-icon-button clipboard"})})]}),s.jsxs("div",{className:"button-group",children:[s.jsx(x,{type:"default",disabled:e,onClick:o,className:"action-button prev-button",icon:s.jsx(we,{size:16}),children:"이전"}),s.jsx(x,{type:"primary",size:"large",icon:s.jsx(Me,{size:16}),onClick:t,loading:e,className:"action-button shuffle-button",children:"다시 섞기"})]})]})}function ps({isShuffle:e,onClickShuffle:t}){return s.jsxs(s.Fragment,{children:[s.jsx(oe,{isShuffle:e}),s.jsx(hs,{isShuffle:e,onClickShuffle:t})]})}function fs(){const{isSharedView:e,activeTab:t}=Je(),{teamCount:a,setTeams:n}=We(),r=Be(),[i,o]=f.useState(!0),[d,l]=H.useMessage(),c=f.useRef(!1),p=async()=>{try{const b=new URLSearchParams(window.location.search).get("teams"),y=Ue(b);y&&n(y)}catch(u){const b=(u==null?void 0:u.message)||"팀 데이터를 불러오는데 실패했습니다.";d.error(b)}finally{o(!1)}},m=async()=>{try{const u=r(),b=Math.ceil(u.length/a),y=Array(a).fill(b).join(":"),C=await new Promise(le=>{setTimeout(()=>{const ce=ze(u,y);le(ce)},800)});n(C)}catch(u){const b=(u==null?void 0:u.message)||"팀 데이터를 불러오는데 실패했습니다.";d.error(b)}finally{o(!1)}},S=async()=>{o(!0),e?await p():await m()};return f.useEffect(()=>{!c.current&&t==="team-distribution"?(S(),c.current=!0):c.current=!1},[t]),{contextHolder:l,isSharedView:e,isShuffle:i,handleDistributePlayers:S}}const{Title:ys,Text:xs}=A;function bs(){const{contextHolder:e,isSharedView:t,isShuffle:a,handleDistributePlayers:n}=fs();return s.jsxs("div",{className:"team-distribution-container",children:[e,s.jsxs("div",{className:"header",children:[s.jsx(ys,{level:4,children:"팀 분배"}),s.jsx(xs,{type:"secondary",children:"랜덤으로 팀을 구성했습니다"})]}),t?s.jsx(us,{isShuffle:a}):s.jsx(ps,{isShuffle:a,onClickShuffle:n})]})}function Ts(){const e=Ve(),t=[{key:"team-setup",label:s.jsxs("div",{className:"tab-label",children:[s.jsx(U,{size:_}),s.jsx("span",{children:"팀 구성"})]}),children:s.jsx(es,{})},{key:"player-selection",label:s.jsxs("div",{className:"tab-label",children:[s.jsx(ee,{size:_}),s.jsx("span",{children:"선수 선택"})]}),children:s.jsx(cs,{})},{key:"team-distribution",label:s.jsxs("div",{className:"tab-label",children:[s.jsx(Oe,{size:_}),s.jsx("span",{children:"팀 분배"})]}),children:s.jsx(bs,{})}];return s.jsx(je,{activeKey:e,items:t,className:"team-setup-flow",centered:!0,size:"large",tabBarGutter:qe})}const js=e=>{try{return JSON.parse(decodeURIComponent(e))}catch(t){return console.error("Failed to parse teams parameter:",t),[]}},Ss=e=>e.reduce((t,a)=>t+a[1].length,0),Es=e=>e.flatMap((t,a)=>t[1].map(n=>{const[r,i,o]=n.split("-");return new g({id:`shared-${a}-${n}`,name:i,number:0,year:r||M,position:V,condition:o||O,isGuest:!0,isAvailable:!0})}));function gs(){return v(h(({setActiveTab:e,setIsSharedView:t})=>({setActiveTab:e,setIsSharedView:t})))}function vs(){return I(h(({setPlayers:e})=>e))}function Ns(){const{setActiveTab:e,setIsSharedView:t}=gs(),a=re(),n=vs();f.useEffect(()=>{const i=new URLSearchParams(window.location.search).get("teams");if(!i)return;const o=js(i);if(o.length===0)return;const d=Ss(o),l=Es(o);a(o.length,d),n(l),t(!0),e("team-distribution")},[a,n,e,t])}function As(){Ns()}function Is(){return As(),s.jsx(Ts,{})}function Ps(){return f.useEffect(()=>{const e=window.Kakao;e&&(e.isInitialized()||e.init("5b53b82753893f8da896b25aedba8dbe"))},[]),null}const{Content:Cs}=F;function ws(){return s.jsxs(F,{className:"app-layout",children:[s.jsx(ke,{}),s.jsx(Cs,{className:"app-content",children:s.jsx(Is,{})}),s.jsx(Ps,{})]})}function Ms({children:e}){return s.jsx(Se,{theme:{token:{colorPrimary:G,borderRadius:6}},children:e})}pe.createRoot(document.getElementById("root")).render(s.jsx(f.StrictMode,{children:s.jsx(Ms,{children:s.jsx(ws,{})})}));
