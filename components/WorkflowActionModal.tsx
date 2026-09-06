'use client';
import {useEffect,useMemo,useState} from 'react';
import {AlertTriangle,ArrowRight,CheckCircle2,Clock3,FileCheck2,FileText,History,Info,Landmark,LockKeyhole,MessageSquare,ShieldAlert,ShieldCheck,UserCheck,WalletCards,X} from 'lucide-react';

type ModalSpec={title:string;eyebrow:string;description:string;mode:'approval'|'financial'|'verification'|'document'|'support'|'security'|'request'|'settings'|'default';steps:string[];fields:string[];primary:string;accent:string};
type State={role:string;screen:string;action:string}|null;

const screens=['dashboard','operations','approvals','users','roles','admins','sessions','cities','developers','assets','allocations','policy-engine','proposals','policies','lifecycle','rules','kyc','kyc-users','bank-verification','nominees','address-verification','ownership','ledger','emi-collection','reconciliation','adjustments','settlements','yield','payouts','failed-payouts','yield-forecast','agents','hierarchy','commission','commission-holds','clawbacks','agent-performance','documents','print-queue','courier','delivery','reprints','support','sla','escalations','resolution-history','reports','audit','security-events','webhooks','jobs','notifications','integrations','feature-flags','system-settings','performance','notices','clients','proposal','proposal-queue','payment-links','missed-emis','follow-ups','lapse-warnings','tds','profile','payments','payout-tracking','receipts','statements','tax-summary','nominee-request','bank-request','address-request','termination','exceptions','broadcasts','templates'];

const human=(s:string)=>s.split('-').map(x=>x[0]?.toUpperCase()+x.slice(1)).join(' ');
const modeFor=(s:string):ModalSpec['mode']=>/kyc|bank|address|nominee|ownership|verification/.test(s)?'verification':/emi|payment|payout|yield|ledger|settlement|commission|tds|reconciliation|adjustment/.test(s)?'financial':/document|print|courier|delivery|receipt|statement|tax/.test(s)?'document':/support|sla|escalation|ticket|broadcast|template/.test(s)?'support':/security|audit|role|session|admin/.test(s)?'security':/request|termination|proposal|follow-up|lapse/.test(s)?'request':/settings|integration|feature|webhook|job|notification/.test(s)?'settings':'default';
const palette=['forest','plum','amber','ocean','slate','rose'];

function buildSpec(role:string,screen:string,action:string):ModalSpec{
  if(!screens.includes(screen)) throw new Error(`No workflow modal registered for screen: ${role}/${screen}`);
  const mode=modeFor(screen), name=human(screen), r=human(role);
  const common={approval:['Record','Evidence','Decision','Audit'],financial:['Transaction','Impact','Authorization','Audit'],verification:['Identity','Evidence','Verification','Audit'],document:['Document','Version','Delivery','Audit'],support:['Customer','Issue','Resolution','Audit'],security:['Event','Risk','Control','Audit'],request:['Request','Validation','Review','Submit'],settings:['Current','Change','Impact','Audit'],default:['Context','Review','Action','Audit']}[mode];
  const fields={approval:['Reference','Current state','Decision','Operator rationale'],financial:['Reference','Amount / value','Processing route','Control reason'],verification:['Customer / account','Evidence reference','Verification result','Reviewer note'],document:['Document reference','Version','Delivery format','Operator note'],support:['Case reference','Priority','Resolution route','Resolution note'],security:['Event reference','Risk level','Control action','Investigation note'],request:['Request reference','Requested change','Validation route','Customer note'],settings:['Configuration key','Current value','New value','Change reason'],default:['Record reference','Current state','Selected action','Operator note']}[mode];
  const primary=mode==='financial'?'Continue controlled review':mode==='verification'?'Record verification':mode==='document'?'Prepare document':mode==='support'?'Assign resolution':mode==='security'?'Record security decision':mode==='request'?'Submit request':mode==='settings'?'Apply controlled change':'Continue review';
  return {title:`${action} — ${name}`,eyebrow:`${r.toUpperCase()} / ${name.toUpperCase()}`,description:`Dedicated ${name.toLowerCase()} workflow for ${r}. Review the selected context, capture the operator decision and preserve an auditable demo trail.`,mode,steps:common,fields,primary,accent:palette[(screen.length+role.length)%palette.length]};
}

function Icon({mode}:{mode:ModalSpec['mode']}){if(mode==='verification')return <UserCheck size={19}/>;if(mode==='financial')return <Landmark size={19}/>;if(mode==='document')return <FileText size={19}/>;if(mode==='support')return <MessageSquare size={19}/>;if(mode==='security')return <ShieldAlert size={19}/>;if(mode==='request')return <FileCheck2 size={19}/>;if(mode==='settings')return <LockKeyhole size={19}/>;return <Info size={19}/>}

function ModalBody({state,spec,onClose}:{state:State;spec:ModalSpec;onClose:()=>void}){
  return <div className={`wamModal modal-${spec.mode} modal-${spec.accent}`} onMouseDown={e=>e.stopPropagation()}>
    <header className="wamHeader"><div><span>{spec.eyebrow}</span><h2>{spec.title}</h2></div><button className="wamClose" onClick={onClose} aria-label="Close"><X size={17}/></button></header>
    <div className="wamBody">
      <div className="wamSummary"><div className="wamIcon"><Icon mode={spec.mode}/></div><div><span className="wamEyebrow">DEDICATED WORKFLOW</span><h3>{spec.description}</h3></div></div>
      <div className="wamSteps">{spec.steps.map((x,i)=><div className={i===spec.steps.length-1?'last':''} key={x}><span>{i+1}</span><strong>{x}</strong>{i<spec.steps.length-1&&<ArrowRight size={12}/>}</div>)}</div>
      <div className="wamGrid">{spec.fields.map((f,i)=><label className={i===spec.fields.length-1?'wamFull':''} key={f}>{f}{i===spec.fields.length-1?<textarea placeholder={`Enter ${f.toLowerCase()}…`}/>:<input defaultValue={i===0?state?.action:''} placeholder={`Enter ${f.toLowerCase()}`}/>}</label>)}</div>
      <div className="wamMiniRows"><div><span>Role</span><strong>{human(state?.role||'')}</strong></div><div><span>Screen</span><strong>{human(state?.screen||'')}</strong></div><div><span>Mode</span><strong>{spec.mode}</strong></div><div><span>State</span><strong>Demo / review</strong></div></div>
      <div className="wamInfo"><Clock3 size={14}/><span>No production transaction is executed. This UI records only local demo interaction.</span></div>
      <div className="wamAudit"><ShieldCheck size={15}/><div><strong>Audit context</strong><span>Action: {state?.action} · Role: {state?.role} · Screen: {state?.screen}</span></div><History size={15}/></div>
      <footer className="wamFooter"><button className="wamSecondary" onClick={onClose}>Cancel</button><button className={spec.mode==='security'?'wamDanger':'wamPrimary'} onClick={onClose}><CheckCircle2 size={15}/>{spec.primary}</button></footer>
    </div>
  </div>
}

export default function WorkflowActionModal(){
  const[state,setState]=useState<State>(null);
  useEffect(()=>{const click=(e:MouseEvent)=>{const target=e.target as HTMLElement|null;const el=target?.closest?.('[data-workflow-action]') as HTMLElement|null;if(!el)return;const action=el.getAttribute('data-workflow-action');if(!action)return;e.preventDefault();e.stopPropagation();const root=el.closest('[data-workflow-screen]') as HTMLElement|null;const role=root?.getAttribute('data-workflow-role')||window.location.pathname.split('/')[1]||'';const screen=root?.getAttribute('data-workflow-screen')||window.location.pathname.split('/')[2]||'';setState({role,screen,action});};document.addEventListener('click',click,true);return()=>document.removeEventListener('click',click,true)},[]);
  useEffect(()=>{if(!state)return;const key=(e:KeyboardEvent)=>e.key==='Escape'&&setState(null);document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[state]);
  const spec=useMemo(()=>state?buildSpec(state.role,state.screen,state.action):null,[state]);
  if(!state||!spec)return null;
  return <div className="wamRoot" role="dialog" aria-modal="true" aria-label={spec.title}><button className="wamBackdrop" aria-label="Close workflow" onClick={()=>setState(null)}/><ModalBody state={state} spec={spec} onClose={()=>setState(null)}/></div>
}
