import{aM as e}from"./vendor-CJgtUEsE.js";import{P as i,D as u,a as d,b as m}from"./index-CQdTvscX.js";import{T as k,g as G,c as L,p as M,u as _,h as O,l as U,m as z,o as H,f as q,d as Y,i as Z,e as W,n as $,q as J,k as K,j as Q}from"./index-CQdTvscX.js";import{G as c,D as t,g as n,T as x,M as h}from"./antd-VDNu01zo.js";import{h as j,F as T,Z as f,I as p,i as N,d as S}from"./lucide-react-Bq-q9nDd.js";function b({player:s,onClose:a}){return e.jsx("div",{className:"player-modal-title",onClick:a,children:e.jsx("div",{children:e.jsxs("div",{className:"player-name",children:[s.year.slice(-2)," ",s.name]})})})}const g=["#FAAD14","#2F54EB","#C41D7F","#13C2C2","#D4380D"],A=s=>{switch(s){case i.ACE:return"gold";case i.ADVANCED:return"geekblue";case i.INTERMEDIATE:return"blue";case i.BEGINNER:return"gray";default:return"default"}};function E(s){return s?s.charAt(0).toUpperCase()+s.slice(1).toLowerCase():""}const{useBreakpoint:I}=c;function C({player:s,onClose:a}){const l=I();return e.jsxs("div",{className:"player-contents",onClick:a,children:[e.jsxs(t,{column:l.xs?1:2,size:"middle",layout:"horizontal",styles:{label:{fontWeight:500}},className:"player-descriptions",children:[e.jsx(t.Item,{label:e.jsxs("div",{className:"field-label",children:[e.jsx(j,{className:"icon tier-icon"}),"티어"]}),children:e.jsx(n,{color:A(s.tier),children:E(s.tier)})}),e.jsx(t.Item,{label:e.jsxs("div",{className:"field-label",children:[e.jsx(T,{className:"icon flame-icon"}),"컨디션"]}),children:D(s.condition)}),e.jsx(t.Item,{label:e.jsxs("div",{className:"field-label",children:[e.jsx(f,{className:"icon zap-icon"}),"강점"]}),children:s.strength||u}),e.jsx(t.Item,{label:e.jsxs("div",{className:"field-label",children:[e.jsx(p,{className:"icon attribute-icon"}),"특징"]}),children:s.attributes.length===0?e.jsx(e.Fragment,{children:d}):e.jsx("ul",{className:"player-attributes",children:s.attributes.map((o,r)=>e.jsx("li",{children:e.jsx(n,{color:g[r],children:o})},r))})})]}),e.jsx(x.Text,{type:"secondary",className:"footer-text",children:"업데이트 중이며 수정이 필요한 분은 카카오톡으로 문의 ㄱㄱ"})]})}function D(s){switch(s){case m.HIGH:return e.jsx(S,{className:"flame-icon"});default:return e.jsx(N,{})}}const{useBreakpoint:F}=c;function P({player:s,onClose:a}){const l=F();return e.jsx(h,{open:!!s,onCancel:a,footer:null,width:l.xs?"90%":600,centered:!0,className:"player-modal",title:e.jsx(e.Fragment,{children:s&&e.jsx(b,{player:s,onClose:a})}),children:s&&e.jsx(C,{player:s,onClose:a})})}export{P as PlayerModal,k as TeamSetupFlow,G as getSelectionStatus,L as getTeamsText,M as parseSharedTeams,_ as useActiveTabValue,O as useGetAvailablePlayersState,U as useIsSharedViewState,z as useIsSharedViewValue,H as usePlayerSelectionState,q as useRequiredPlayersValue,Y as useSetActiveTabState,Z as useSetPlayersState,W as useSetTeamOptionState,$ as useTeamDistributionValue,J as useTeamSetupFlowStore,K as useTeamsState,Q as useTeamsValue};
