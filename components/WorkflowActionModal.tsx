'use client';

import {useEffect,useMemo,useState} from 'react';
import {CheckCircle2,ChevronDown,Download,FileCheck,History,Loader2,Search,Send,ShieldAlert,SlidersHorizontal,X} from 'lucide-react';

type ModalState={open:boolean;action:string;context:string};

const normalize=(value:string)=>value.toLowerCase().replace(/\s+/g,' ').trim();

function ActionBody({action,context,onClose}:{action:string;context:string;onClose:()=>void}){
  const a=normalize(action);
  const [done,setDone]=useState(false);
  const [note,setNote]=useState('');
  const [reason,setReason]=useState('');
  const [status,setStatus]=useState('');

  const complete=(message:string)=>{setDone(true);setStatus(message);setTimeout(onClose,1100)};

  if(a.includes('approve')||a.includes('release')||a.includes('submit')||a.includes('create')||a.includes('allocate')||a.includes('verify')||a.includes('advance')||a.includes('resolve')||a.includes('reopen')||a.includes('retry')||a.includes('collect')||a.includes('send')||a.includes('mark')){
    const label=a.includes('approve')?'Approval':a.includes('verify')?'Verification':a.includes('retry')?'Retry':a.includes('create')?'Creation':a.includes('allocate')?'Allocation':'Workflow action';
    return <div className="wamBody">
      <div className="wamSummary"><div className="wamIcon"><CheckCircle2 size={20}/></div><div><span className="wamEyebrow">{label}</span><h3>{action}</h3><p>Review the operation details below before confirming this workflow action.</p></div></div>
      <div className="wamGrid"><label>Current workspace<input value={context} readOnly/></label><label>Operation<select defaultValue="standard"><option value="standard">Standard workflow</option><option value="priority">Priority review</option><option value="manual">Manual processing</option></select></label></div>
      <label className="wamFull">Operator note<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add an internal note for the audit trail…"/></label>
      {status&&<div className="wamSuccess"><CheckCircle2 size={16}/>{status}</div>}
      <div className="wamFooter"><button className="wamSecondary" onClick={onClose}>Cancel</button><button className="wamPrimary" onClick={()=>complete(`${action} confirmed — audit event created.`)} disabled={done}>{done?<Loader2 className="spin" size={16}/>:<CheckCircle2 size={16}/>} {done?'Processing…':`Confirm ${action}`}</button></div>
    </div>;
  }

  if(a.includes('reject')||a.includes('send back')||a.includes('hold')||a.includes('suspend')||a.includes('restrict')||a.includes('disable')||a.includes('revoke')||a.includes('flag')||a.includes('escalate')||a.includes('delete')||a.includes('reverse')){
    return <div className="wamBody">
      <div className="wamSummary danger"><div className="wamIcon"><ShieldAlert size={20}/></div><div><span className="wamEyebrow">Controlled exception</span><h3>{action}</h3><p>This operation changes workflow state and requires a reason.</p></div></div>
      <div className="wamGrid"><label>Workspace<input value={context} readOnly/></label><label>Reason<select value={reason} onChange={e=>setReason(e.target.value)}><option value="">Select reason</option><option>Policy exception</option><option>Customer request</option><option>Operational correction</option><option>Risk / compliance</option><option>Other</option></select></label></div>
      <label className="wamFull">Decision note<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Explain why this action is being taken…"/></label>
      <div className="wamFooter"><button className="wamSecondary" onClick={onClose}>Cancel</button><button className="wamDanger" disabled={!reason} onClick={()=>complete(`${action} recorded with reason and audit trail.`)}>{done?'Recorded':action}</button></div>
    </div>;
  }

  if(a.includes('download')||a.includes('export')||a.includes('print')||a.includes('generate')){
    return <div className="wamBody">
      <div className="wamSummary"><div className="wamIcon"><Download size={20}/></div><div><span className="wamEyebrow">Document operation</span><h3>{action}</h3><p>Choose the output and confirm generation. The operation will be recorded in activity history.</p></div></div>
      <div className="wamOptionGrid"><button className="wamOption active"><FileCheck size={18}/><span><strong>Primary output</strong><small>Production-ready document / dataset</small></span><CheckCircle2 size={16}/></button><button className="wamOption"><History size={18}/><span><strong>Previous version</strong><small>Open the latest generated version</small></span></button></div>
      <div className="wamInfo"><SlidersHorizontal size={15}/><span>Workspace: <strong>{context}</strong></span></div>
      <div className="wamFooter"><button className="wamSecondary" onClick={onClose}>Cancel</button><button className="wamPrimary" onClick={()=>complete(`${action} started. You can track it in the activity history.`)}><Download size={16}/> Start {action}</button></div>
    </div>;
  }

  if(a.includes('open')||a.includes('inspect')||a.includes('view')||a.includes('investigate')||a.includes('search')||a.includes('track')){
    return <div className="wamBody">
      <div className="wamSummary"><div className="wamIcon"><Search size={20}/></div><div><span className="wamEyebrow">Workspace</span><h3>{action}</h3><p>Open the selected operational context with filters, history and available next actions.</p></div></div>
      <div className="wamSearch"><Search size={16}/><input autoFocus placeholder="Search by ID, name, policy or reference…"/><button>Search</button></div>
      <div className="wamMiniRows"><div><span>Context</span><strong>{context}</strong></div><div><span>Access</span><strong>Role permitted</strong></div><div><span>Audit</span><strong>Enabled</strong></div></div>
      <div className="wamFooter"><button className="wamSecondary" onClick={onClose}>Close</button><button className="wamPrimary" onClick={()=>complete(`${action} workspace opened.`)}><Search size={16}/> Continue</button></div>
    </div>;
  }

  return <div className="wamBody"><div className="wamSummary"><div className="wamIcon"><SlidersHorizontal size={20}/></div><div><span className="wamEyebrow">Workflow control</span><h3>{action}</h3><p>This operation now has a dedicated interaction surface for review, input and confirmation.</p></div></div><label className="wamFull">Operator note<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Enter operational details…"/></label><div className="wamFooter"><button className="wamSecondary" onClick={onClose}>Close</button><button className="wamPrimary" onClick={()=>complete(`${action} completed.`)}><Send size={16}/> Continue</button></div></div>;
}

export default function WorkflowActionModal(){
  const [modal,setModal]=useState<ModalState>({open:false,action:'',context:''});
  useEffect(()=>{
    const handler=(event:Event)=>{
      const target=event.target as HTMLElement|null;
      const button=target?.closest('button') as HTMLButtonElement|null;
      if(!button||button.closest('.wamRoot')) return;
      const shell=button.closest('.moduleScreen, .dashboard, .main, main') as HTMLElement|null;
      if(!shell) return;
      const action=(button.innerText||button.getAttribute('aria-label')||'Workflow action').trim();
      if(!action||['close','cancel'].includes(normalize(action))) return;
      const heading=shell.querySelector('h1')?.textContent?.trim()||document.title||'DISH workspace';
      event.preventDefault(); event.stopPropagation();
      setModal({open:true,action,context:heading});
    };
    document.addEventListener('click',handler,true);
    return()=>document.removeEventListener('click',handler,true);
  },[]);
  useEffect(()=>{if(!modal.open)return;const fn=(e:KeyboardEvent)=>{if(e.key==='Escape')setModal(x=>({...x,open:false}))};document.addEventListener('keydown',fn);return()=>document.removeEventListener('keydown',fn)},[modal.open]);
  const title=useMemo(()=>modal.action||'Workflow action',[modal.action]);
  if(!modal.open)return null;
  return <div className="wamRoot" role="dialog" aria-modal="true" aria-label={title}>
    <button className="wamBackdrop" aria-label="Close dialog" onClick={()=>setModal(x=>({...x,open:false}))}/>
    <section className="wamModal"><header className="wamHeader"><div><span>DISH WORKFLOW</span><h2>{title}</h2></div><button className="wamClose" aria-label="Close" onClick={()=>setModal(x=>({...x,open:false}))}><X size={18}/></button></header><ActionBody action={modal.action} context={modal.context} onClose={()=>setModal(x=>({...x,open:false}))}/></section>
  </div>;
}
