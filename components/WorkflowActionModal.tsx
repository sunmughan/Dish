'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowRight,CheckCircle2,Clock3,FileCheck2,FileText,History,Info,Landmark,LockKeyhole,MessageSquare,ShieldAlert,ShieldCheck,UserCheck,X} from 'lucide-react';

type Mode='approval'|'financial'|'verification'|'document'|'support'|'security'|'request'|'settings'|'default';
type ModalSpec={title:string;eyebrow:string;description:string;mode:Mode;steps:string[];fields:string[];primary:string;accent:string;actionLabel:string};
type State={role:string;screen:string;action:string}|null;

const aliases:Record<string,string>={
  'my-policy':'policy','payments-emi':'payments','yield-benefits':'yield','document-center':'documents','emi-receipts':'receipts','annual-statements':'statements','tax-income-summary':'tax-summary','nominee-update':'nominee-request','bank-change':'bank-request','address-update':'address-request','termination-request':'termination','support-grievance':'support','profile-security':'profile'
};
const screens=new Set(['dashboard','operations','approvals','users','roles','admins','sessions','cities','developers','assets','allocations','policy-engine','proposals','policies','lifecycle','rules','kyc','kyc-users','bank-verification','nominees','address-verification','ownership','ledger','emi-collection','reconciliation','adjustments','settlements','yield','payouts','failed-payouts','yield-forecast','agents','hierarchy','commission','commission-holds','clawbacks','agent-performance','documents','print-queue','courier','delivery','reprints','support','sla','escalations','resolution-history','reports','audit','security-events','webhooks','jobs','notifications','integrations','feature-flags','system-settings','performance','notices','clients','proposal','proposal-queue','payment-links','missed-emis','follow-ups','lapse-warnings','tds','profile','payments','payout-tracking','receipts','statements','tax-summary','nominee-request','bank-request','address-request','termination','exceptions','broadcasts','templates']);
const human=(s:string)=>s.split('-').map(x=>x[0]?.toUpperCase()+x.slice(1)).join(' ');
const modeFor=(s:string):Mode=>/kyc|bank|address|nominee|ownership|verification/.test(s)?'verification':/emi|payment|payout|yield|ledger|settlement|commission|tds|reconciliation|adjustment/.test(s)?'financial':/document|print|courier|delivery|receipt|statement|tax/.test(s)?'document':/support|sla|escalation|ticket|broadcast|template/.test(s)?'support':/security|audit|role|session|admin/.test(s)?'security':/request|termination|proposal|follow-up|lapse/.test(s)?'request':/settings|integration|feature|webhook|job|notification/.test(s)?'settings':'default';
const accentFor=(s:string)=>['forest','plum','amber','ocean','slate','rose'][s.length%6];
const actionProfile=(screen:string,action:string,mode:Mode)=>{
  const a=action.toLowerCase();
  if(/approve|authori|release|confirm/.test(a))return {steps:['Review evidence','Validate controls','Record approval','Create audit entry'],primary:mode==='financial'?'Authorize controlled release':'Record approval'};
  if(/reject|decline|deny/.test(a))return {steps:['Review evidence','Record rejection reason','Confirm policy impact','Create audit entry'],primary:'Record rejection'};
  if(/download|print|generate|reprint/.test(a))return {steps:['Select document','Confirm version','Prepare output','Create audit entry'],primary:'Prepare document'};
  if(/pause|resume/.test(a))return {steps:['Inspect mandate','Confirm requested state','Apply demo change','Create audit entry'],primary:a.includes('pause')?'Pause mandate':'Resume mandate'};
  if(/escalat/.test(a))return {steps:['Review SLA','Select escalation tier','Assign owner','Create audit entry'],primary:'Escalate case'};
  if(/verify|kyc|validate/.test(a))return {steps:['Inspect evidence','Check source','Record verification','Create audit entry'],primary:'Record verification'};
  if(/pay|collect|settle|payout|refund/.test(a))return {steps:['Review transaction','Validate amount','Confirm control route','Create audit entry'],primary:'Continue controlled payment'};
  if(/edit|change|update|submit|request/.test(a))return {steps:['Review current value','Capture requested change','Validate supporting evidence','Submit demo request'],primary:'Submit controlled request'};
  return {steps:['Open selected record','Review context','Record operator action','Create audit entry'],primary:`Continue ${human(screen).toLowerCase()} action`};
};
function buildSpec(role:string,screen:string,action:string):ModalSpec{
  const canonical=aliases[screen]||screen;
  if(!screens.has(canonical))throw new Error(`No workflow modal registered for screen: ${role}/${screen}`);
  const mode=modeFor(canonical),name=human(screen),r=human(role),profile=actionProfile(canonical,action,mode);
  const fieldsByMode:Record<Mode,string[]>={approval:['Reference','Decision','Operator rationale'],financial:['Transaction reference','Amount / value','Control route','Operator rationale'],verification:['Customer / account','Evidence reference','Verification result','Reviewer note'],document:['Document reference','Version','Delivery format','Operator note'],support:['Case reference','Priority','Resolution route','Resolution note'],security:['Event reference','Risk level','Control action','Investigation note'],request:['Request reference','Requested change','Validation route','Customer note'],settings:['Configuration key','Current value','New value','Change reason'],default:['Record reference','Current state','Selected action','Operator note']};
  return {title:`${action} — ${name}`,eyebrow:`${r.toUpperCase()} / ${name.toUpperCase()}`,description:`This action opens the dedicated ${name.toLowerCase()} workflow for ${r}. Capture the decision, supporting context and operator rationale before completing the demo action.`,mode,steps:profile.steps,fields:fieldsByMode[mode],primary:profile.primary,accent:accentFor(canonical),actionLabel:action};
}
function Icon({mode}:{mode:Mode}){if(mode==='verification')return <UserCheck size={19}/>;if(mode==='financial')return <Landmark size={19}/>;if(mode==='document')return <FileText size={19}/>;if(mode==='support')return <MessageSquare size={19}/>;if(mode==='security')return <ShieldAlert size={19}/>;if(mode==='request')return <FileCheck2 size={19}/>;if(mode==='settings')return <LockKeyhole size={19}/>;return <Info size={19}/>}
function ModalBody({state,spec,onClose}:{state:State;spec:ModalSpec;onClose:()=>void}){return <div className={`wamModal modal-${spec.mode} modal-${spec.accent}`} onMouseDown={e=>e.stopPropagation()}>
<header className="wamHeader"><div><span>{spec.eyebrow}</span><h2>{spec.title}</h2></div><button type="button" className="wamClose" onClick={onClose} aria-label="Close"><X size={17}/></button></header>
<div className="wamBody"><div className="wamSummary"><div className="wamIcon"><Icon mode={spec.mode}/></div><div><span className="wamEyebrow">SCREEN-SPECIFIC WORKFLOW</span><h3>{spec.description}</h3></div></div>
<div className="wamSteps">{spec.steps.map((x,i)=><div className={i===spec.steps.length-1?'last':''} key={x}><span>{i+1}</span><strong>{x}</strong>{i<spec.steps.length-1&&<ArrowRight size={12}/>}</div>)}</div>
<div className="wamGrid">{spec.fields.map((f,i)=><label className={i===spec.fields.length-1?'wamFull':''} key={f}>{f}{i===spec.fields.length-1?<textarea placeholder={`Enter ${f.toLowerCase()}…`}/>:<input defaultValue={i===0?spec.actionLabel:''} placeholder={`Enter ${f.toLowerCase()}`}/>}</label>)}</div>
<div className="wamMiniRows"><div><span>Role</span><strong>{human(state?.role||'')}</strong></div><div><span>Screen</span><strong>{human(state?.screen||'')}</strong></div><div><span>Mode</span><strong>{spec.mode}</strong></div><div><span>Action</span><strong>{spec.actionLabel}</strong></div></div>
<div className="wamInfo"><Clock3 size={14}/><span>Demo environment only — no production payment, KYC, investment or policy transaction is executed.</span></div>
<div className="wamAudit"><ShieldCheck size={15}/><div><strong>Audit context</strong><span>Action: {state?.action} · Role: {state?.role} · Screen: {state?.screen}</span></div><History size={15}/></div>
<footer className="wamFooter"><button type="button" className="wamSecondary" onClick={onClose}>Cancel</button><button type="button" className={spec.mode==='security'?'wamDanger':'wamPrimary'} onClick={onClose}><CheckCircle2 size={15}/>{spec.primary}</button></footer></div></div>}
export default function WorkflowActionModal(){
  const[state,setState]=useState<State>(null);
  const previousFocus=useRef<HTMLElement|null>(null);
  useEffect(()=>{const click=(e:MouseEvent)=>{const target=e.target as HTMLElement|null;const el=target?.closest?.('[data-workflow-action]') as HTMLElement|null;if(!el||el.hasAttribute('disabled')||el.getAttribute('aria-disabled')==='true')return;const action=el.getAttribute('data-workflow-action');if(!action)return;e.preventDefault();e.stopPropagation();previousFocus.current=document.activeElement as HTMLElement|null;const root=el.closest('[data-workflow-screen]') as HTMLElement|null;const role=root?.getAttribute('data-workflow-role')||window.location.pathname.split('/')[1]||'';const screen=root?.getAttribute('data-workflow-screen')||window.location.pathname.split('/')[2]||'';if(!screen)return;setState({role,screen,action});};document.addEventListener('click',click,true);return()=>document.removeEventListener('click',click,true)},[]);
  useEffect(()=>{if(!state)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';const key=(e:KeyboardEvent)=>e.key==='Escape'&&setState(null);document.addEventListener('keydown',key);return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',key)}},[state]);
  useEffect(()=>{if(state){requestAnimationFrame(()=>document.querySelector<HTMLElement>('.wamClose')?.focus())}else if(previousFocus.current){previousFocus.current.focus();previousFocus.current=null}},[state]);
  const spec=useMemo(()=>state?buildSpec(state.role,state.screen,state.action):null,[state]);
  if(!state||!spec)return null;
  return <div className="wamRoot" role="dialog" aria-modal="true" aria-label={spec.title}><button type="button" className="wamBackdrop" aria-label="Close workflow" onClick={()=>setState(null)}/><ModalBody state={state} spec={spec} onClose={()=>setState(null)}/></div>
}
