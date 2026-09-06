'use client';

import {useEffect,useMemo,useState} from 'react';
import {AlertTriangle,ArrowRight,Check,CheckCircle2,ChevronRight,Clock3,Download,FileCheck2,History,Info,Landmark,RefreshCcw,Search,ShieldCheck,UserRound,X} from 'lucide-react';

type Tone='normal'|'danger'|'warning';
type Field={label:string;value?:string;placeholder?:string;type?:'text'|'select'|'textarea'};
type Operation={area:string;eyebrow:string;description:string;tone:Tone;fields:Field[];facts:[string,string][];steps:string[];primary:string;secondary?:string;notice?:string};

const slug=()=>typeof window==='undefined'?'':window.location.pathname.split('/').filter(Boolean).pop()||'dashboard';
const clean=(s:string)=>s.toLowerCase().replace(/\s+/g,' ').trim();
const titleize=(s:string)=>s.split('-').map(x=>x?x[0].toUpperCase()+x.slice(1):x).join(' ');

const special:Record<string,Partial<Operation>>={
'kyc-approval-queue':{area:'KYC verification workbench',eyebrow:'IDENTITY DECISION',description:'Review the customer identity packet before approving, requesting correction, or rejecting the case.',tone:'warning',fields:[{label:'Customer',value:'Aarav Mehta'},{label:'PAN status',value:'Verified',type:'select'},{label:'Aadhaar status',value:'Verified',type:'select'},{label:'Selfie match',value:'Matched',type:'select'},{label:'Decision note',placeholder:'Record discrepancy, verification evidence or reviewer note…',type:'textarea'}],facts:[['Case','KYC-821'],['Documents','PAN · Aadhaar · Selfie'],['Risk','Low'],['Reviewer','KYC Admin']],steps:['Identity packet','Document comparison','Decision','Audit'],primary:'Approve KYC',secondary:'Request correction',notice:'Approval is shown as a frontend workflow state only; no backend KYC mutation is performed.'},
'bank-verification':{area:'Bank verification workbench',eyebrow:'PAYOUT ELIGIBILITY',description:'Review account, IFSC and verification evidence before allowing mandate or payout use.',tone:'normal',fields:[{label:'Account',value:'•••• 4821'},{label:'IFSC',value:'HDFC0001234'},{label:'Verification method',value:'Penny drop',type:'select'},{label:'Verification reference',placeholder:'Enter verification reference'},{label:'Reviewer note',placeholder:'Add verification note…',type:'textarea'}],facts:[['Case','BNK-2201'],['Holder','Aarav Mehta'],['Bank','HDFC Bank'],['State','Pending']],steps:['Account details','Verification','Decision','Audit'],primary:'Verify bank',secondary:'Request correction'},
'proposal-queue':{area:'Proposal review workspace',eyebrow:'PROPOSAL DECISION',description:'Validate the agent proposal, EMI choice, tenure and KYC readiness before policy creation.',tone:'normal',fields:[{label:'Proposal',value:'PROP-8421'},{label:'Monthly EMI',value:'₹10,000'},{label:'Tenure',value:'36 months'},{label:'KYC readiness',value:'Ready',type:'select'},{label:'Reviewer note',placeholder:'Record approval or clarification note…',type:'textarea'}],facts:[['Agent','AG-2041'],['Customer','Aarav Mehta'],['Asset','AST-001'],['Next step','Policy creation']],steps:['Proposal','KYC readiness','Asset mapping','Decision'],primary:'Approve proposal',secondary:'Request clarification'},
'refund-settlement':{area:'Termination settlement workspace',eyebrow:'FINANCIAL APPROVAL',description:'Review paid EMIs, applicable deductions, cooling-off state and refundable amount before settlement release.',tone:'warning',fields:[{label:'Policy',value:'IREC-00821'},{label:'EMIs paid',value:'₹90,000'},{label:'Deductions',value:'₹0'},{label:'Refundable',value:'₹90,000'},{label:'Settlement note',placeholder:'Reason, approval reference or exception note…',type:'textarea'}],facts:[['Cooling-off','Eligible'],['Settlement','Pending approval'],['Payout','Bank transfer'],['Audit','Required']],steps:['Calculation','Cooling-off','Approval','Payout'],primary:'Approve settlement',secondary:'Hold settlement',notice:'This is a visual approval workspace. Settlement values are illustrative UI data from the specification flow.'},
'emi-collection':{area:'EMI recovery workspace',eyebrow:'COLLECTION ACTION',description:'Review the selected EMI, debit state and recovery route before retrying a mandate or sending a payment link.',tone:'normal',fields:[{label:'Policy',value:'IREC-00840'},{label:'Holder',value:'Diya Shah'},{label:'EMI due',value:'₹15,000'},{label:'Current method',value:'NACH',type:'select'},{label:'Recovery note',placeholder:'Record failure reason or customer follow-up…',type:'textarea'}],facts:[['Attempt','Failed'],['Next action','Recovery'],['Lapse rule','3 consecutive failures'],['Agent alert','Enabled']],steps:['Payment failure','Recovery route','Customer notice','Audit'],primary:'Retry mandate',secondary:'Send payment link'},
'adjustments-reversals':{area:'Financial correction workspace',eyebrow:'CONTROLLED ADJUSTMENT',description:'Inspect the original ledger entry, correction amount and reason before posting a reversal or adjustment.',tone:'danger',fields:[{label:'Reference',value:'ADJ-882'},{label:'Original ledger',value:'LED-9919'},{label:'Adjustment amount',value:'₹18,000'},{label:'Reason',value:'Settlement correction',type:'select'},{label:'Approval note',placeholder:'Mandatory reason and supporting context…',type:'textarea'}],facts:[['Original state','Posted'],['Correction','Pending'],['Audit trail','Required'],['Risk','High value']],steps:['Original entry','Correction','Approval','Audit'],primary:'Approve adjustment',secondary:'Reverse entry'},
'asset-allocation':{area:'Asset allocation workspace',eyebrow:'EXPOSURE MAPPING',description:'Review the eligible asset and policy pool before committing an allocation decision.',tone:'normal',fields:[{label:'Asset',value:'AST-001'},{label:'Developer',value:'Aster Realty'},{label:'City',value:'Mumbai'},{label:'Policy pool',value:'Pool MUM-04',type:'select'},{label:'Allocation note',placeholder:'Add allocation rationale…',type:'textarea'}],facts:[['Asset value','₹12.4Cr'],['Availability','Ready'],['Exposure','Policy pool'],['Review','Pending']],steps:['Asset','Pool','Exposure','Decision'],primary:'Allocate asset',secondary:'Hold allocation'},
'lifecycle-manager':{area:'Policy lifecycle workspace',eyebrow:'STATE TRANSITION',description:'Inspect the current policy state, trigger and resulting system action before advancing the lifecycle.',tone:'warning',fields:[{label:'Policy',value:'IREC-2024-00841'},{label:'Current state',value:'EMI Running',type:'select'},{label:'Trigger',value:'First EMI + KYC'},{label:'Target state',value:'EMI Completed',type:'select'},{label:'Transition note',placeholder:'Record lifecycle decision…',type:'textarea'}],facts:[['EMI progress','18 / 36'],['Trigger','Rule-based'],['Next state','Benefit Active after final EMI'],['Audit','Required']],steps:['Current state','Trigger','Validation','Transition'],primary:'Advance lifecycle',secondary:'Open policy'},
'rules-engine':{area:'Rules validation workspace',eyebrow:'RULE TEST',description:'Test a hard policy rule against sample inputs and review the resulting validation state.',tone:'normal',fields:[{label:'Rule',value:'Minimum Monthly EMI',type:'select'},{label:'Threshold',value:'₹5,000'},{label:'Sample EMI',value:'₹10,000'},{label:'Expected result',value:'Pass',type:'select'},{label:'Test note',placeholder:'Record test case or rule-change rationale…',type:'textarea'}],facts:[['Minimum EMI','₹5,000'],['Tenure','24–48 months'],['Lapse trigger','3 consecutive failures'],['Enforcement','Blocking / automated']],steps:['Rule','Input','Result','Audit'],primary:'Run rule test',secondary:'Edit rule'},
'payout-queue':{area:'Payout approval workspace',eyebrow:'BENEFIT DISBURSEMENT',description:'Review beneficiary, amount, bank verification and payout reference before gateway submission.',tone:'warning',fields:[{label:'Payout',value:'PAY-8821'},{label:'Policy',value:'IREC-00841'},{label:'Amount',value:'₹3,600'},{label:'Bank',value:'•••• 4821'},{label:'Approval note',placeholder:'Add payout approval note…',type:'textarea'}],facts:[['Gateway','Razorpay'],['Bank verification','Verified'],['State','Queued'],['Reference','PAY-8821']],steps:['Payout record','Bank check','Approval','Gateway'],primary:'Approve payout',secondary:'Hold payout'},
'failed-payouts':{area:'Failed payout recovery workspace',eyebrow:'PAYOUT RECOVERY',description:'Inspect the failed gateway attempt and choose a controlled retry path.',tone:'danger',fields:[{label:'Payout',value:'PAY-8812'},{label:'Failure reason',value:'Bank timeout',type:'select'},{label:'Retry method',value:'Same bank account',type:'select'},{label:'Retry date',placeholder:'Select retry date'},{label:'Recovery note',placeholder:'Record gateway response and retry rationale…',type:'textarea'}],facts:[['Attempt','2'],['Gateway','Razorpay'],['Bank','Verified'],['Status','Failed']],steps:['Failure','Diagnosis','Retry','Audit'],primary:'Retry payout',secondary:'Escalate'},
'ownership-transfer':{area:'Ownership transfer case',eyebrow:'LEGAL / SUCCESSION',description:'Review current owner, proposed owner and legal evidence before approving a transfer.',tone:'warning',fields:[{label:'Case',value:'OWN-018'},{label:'Current holder',value:'Aarav Mehta'},{label:'New holder',value:'Priya Mehta'},{label:'Legal evidence',value:'Pending',type:'select'},{label:'Case note',placeholder:'Record legal review findings…',type:'textarea'}],facts:[['Policy','IREC-00841'],['Reason','Legal / deceased case'],['Review','Legal'],['Audit','Required']],steps:['Case','Evidence','Legal review','Decision'],primary:'Approve transfer',secondary:'Request legal proof'},
'alerts-approvals':{area:'Approval case workspace',eyebrow:'CENTRAL APPROVALS',description:'Open the approval packet, review requester context and record a controlled decision.',tone:'warning',fields:[{label:'Case',value:'APR-8421'},{label:'Module',value:'Refund'},{label:'Requested by',value:'Ops Admin'},{label:'Priority',value:'High',type:'select'},{label:'Decision note',placeholder:'Required reviewer rationale…',type:'textarea'}],facts:[['Age','18 min'],['Priority','High'],['Requester','Ops Admin'],['Audit','Enabled']],steps:['Case','Evidence','Decision','Audit'],primary:'Approve case',secondary:'Send back'},
'support-grievance':{area:'Support ticket workspace',eyebrow:'SERVICE CASE',description:'Create or update a service case with category, SLA and escalation path.',tone:'normal',fields:[{label:'Category',value:'Payment / EMI',type:'select'},{label:'Policy',value:'IREC-2024-00841'},{label:'Priority',value:'Normal',type:'select'},{label:'SLA tier',value:'L1 · 24 hrs',type:'select'},{label:'Issue description',placeholder:'Describe the customer issue and expected resolution…',type:'textarea'}],facts:[['Ticket','TKT-24081'],['Owner','Support Admin'],['Escalation','Support → Ops → Super'],['SLA','24 hrs']],steps:['Issue','SLA','Owner','Resolution'],primary:'Create ticket',secondary:'Escalate'},
'payment-links':{area:'Agent payment-link workspace',eyebrow:'CLIENT COLLECTION',description:'Select the client, EMI and delivery channels before generating a payment link.',tone:'normal',fields:[{label:'Client',value:'Aarav Mehta',type:'select'},{label:'Policy',value:'IREC-2024-00841',type:'select'},{label:'EMI amount',value:'₹10,000'},{label:'Link expiry',value:'48 hours',type:'select'},{label:'Delivery',value:'SMS + WhatsApp + Email',type:'select'}],facts:[['Agent','AG-2041'],['EMI','₹10,000'],['Channel','Multi-channel'],['Purpose','Missed / manual EMI']],steps:['Client','Amount','Delivery','Generate'],primary:'Generate payment link'},
'commission':{area:'Agent commission workspace',eyebrow:'COMMISSION LEDGER',description:'Review policy-linked commission, release state and applicable hold before processing the selected entry.',tone:'normal',fields:[{label:'Policy',value:'IREC-2024-00841'},{label:'Commission type',value:'Trail',type:'select'},{label:'Gross amount',value:'₹3,600'},{label:'TDS',value:'₹360'},{label:'Processing note',placeholder:'Add commission note…',type:'textarea'}],facts:[['Agent','AG-2041'],['Status','Pending'],['Release','EMI-linked'],['TDS','Applicable']],steps:['Policy','Commission','TDS','Release'],primary:'Process commission',secondary:'Place hold'},
};

const groups:Record<string,string[]>={
'KYC & identity':['kyc','kyc-users','kyc-approval-queue','user-kyc-master','bank-verification','nominee-management','address-verification','ownership-transfer'],
'Finance':['central-ledger','emi-collection','reconciliation','adjustments-reversals','refund-settlement','yield-engine','payout-queue','failed-payouts','yield-forecast','payments','payout-tracking','receipts','statements','tax-summary'],
'Policy':['policy-creation-engine','proposal-queue','policy-book','lifecycle-manager','rules-engine','policies','policy','termination','termination-request'],
'Agent':['clients','proposal','proposal-queue','emi','payment-links','missed-emis','follow-ups','lapse-warnings','commission','tds','payouts','performance','notices'],
'Support':['support','support-grievance','sla','escalations','resolution-history','notifications','broadcasts','templates'],
'Documents':['documents','document-center','print-queue','courier','delivery','reprints','receipts','statements','tax-income-summary','tax-summary'],
'Security':['roles-permissions','admin-accounts','sessions-devices','security-events','audit','profile-security'],
'Master data':['city-master','cities','developer-master','developers','property-asset-master','assets','asset-allocation','allocations'],
'System':['dashboard','live-operations','alerts-approvals','operations','reports','webhooks','jobs','integrations','feature-flags','system-settings','settings']
};

function groupFor(s:string){for(const [g,items] of Object.entries(groups))if(items.includes(s))return g;return 'DISH Operations';}
function buildOperation(s:string,a:string):Operation{
  const sp=special[s]||{};
  const group=groupFor(s);
  const base:Operation={area:`${titleize(s)} workspace`,eyebrow:`${group.toUpperCase()} OPERATION`,description:`Review the ${titleize(s).toLowerCase()} record and complete this frontend workflow with the appropriate operational context.`,tone:'normal',fields:[{label:'Record',value:s==='dashboard'?'DISH command center':'Select or enter record reference'},{label:'Status',value:'Pending review',type:'select'},{label:'Operator',value:'Current role'},{label:'Reference',placeholder:'Optional reference / case ID'},{label:'Operational note',placeholder:'Add a note for the activity timeline…',type:'textarea'}],facts:[['Workspace',titleize(s)],['Role access','Permitted'],['Audit view','Enabled'],['Backend','Not connected']],steps:['Record','Review','Decision','Activity'],primary:a||'Continue'};
  return {...base,...sp,area:sp.area||base.area,eyebrow:sp.eyebrow||base.eyebrow,description:sp.description||base.description,tone:sp.tone||base.tone,fields:sp.fields||base.fields,facts:sp.facts||base.facts,steps:sp.steps||base.steps,primary:sp.primary||base.primary,secondary:sp.secondary||base.secondary,notice:sp.notice||base.notice};
}

function Icon({tone}:{tone:Tone}){return tone==='danger'?<AlertTriangle size={19}/>:tone==='warning'?<ShieldCheck size={19}/>:<CheckCircle2 size={19}/>}

export default function WorkflowActionModal(){
  const [modal,setModal]=useState<{open:boolean;action:string;screen:string;role:string}>({open:false,action:'',screen:'',role:''});
  const [values,setValues]=useState<Record<string,string>>({});
  const [complete,setComplete]=useState(false);
  useEffect(()=>{
    const handler=(event:Event)=>{
      const target=event.target as HTMLElement|null;
      const button=target?.closest('button') as HTMLButtonElement|null;
      if(!button||button.closest('.wamRoot')||button.closest('nav,aside,.sidebar,.mobileTop'))return;
      const shell=button.closest('.moduleScreen,.dashboard,.main,main') as HTMLElement|null;
      if(!shell)return;
      const action=(button.innerText||button.getAttribute('aria-label')||'Continue').trim();
      if(!action||['close','cancel'].includes(clean(action)))return;
      event.preventDefault();event.stopPropagation();
      const path=window.location.pathname.split('/').filter(Boolean);
      const role=path[0]||'user';
      const screen=path[path.length-1]||'dashboard';
      setComplete(false);setValues({});setModal({open:true,action,screen,role});
    };
    document.addEventListener('click',handler,true);return()=>document.removeEventListener('click',handler,true);
  },[]);
  useEffect(()=>{if(!modal.open)return;const fn=(e:KeyboardEvent)=>{if(e.key==='Escape')setModal(x=>({...x,open:false}))};document.addEventListener('keydown',fn);return()=>document.removeEventListener('keydown',fn)},[modal.open]);
  const op=useMemo(()=>buildOperation(modal.screen,modal.action),[modal.screen,modal.action]);
  const set=(k:string,v:string)=>setValues(x=>({...x,[k]:v}));
  const submit=()=>{setComplete(true);};
  if(!modal.open)return null;
  return <div className="wamRoot" role="dialog" aria-modal="true" aria-label={op.primary}>
    <button className="wamBackdrop" aria-label="Close dialog" onClick={()=>setModal(x=>({...x,open:false}))}/>
    <section className={`wamModal wamTone-${op.tone}`}>
      <header className="wamHeader">
        <div className="wamHeaderTitle"><span className="wamKicker">DISH · {modal.role.toUpperCase()}</span><h2>{op.area}</h2><p>{op.description}</p></div>
        <button className="wamClose" aria-label="Close" onClick={()=>setModal(x=>({...x,open:false}))}><X size={18}/></button>
      </header>
      <div className="wamLayout">
        <aside className="wamRail">
          <div className="wamRailLabel">OPERATION</div>
          {op.steps.map((step,i)=><div className={`wamStep ${i===0?'active':''}`} key={step}><span>{i+1}</span><div><strong>{step}</strong><small>{i===0?'Current':'Next'}</small></div><ChevronRight size={14}/></div>)}
          <div className="wamRailCard"><Clock3 size={15}/><div><strong>Audit ready</strong><span>Frontend activity state</span></div></div>
        </aside>
        <div className="wamBody">
          <div className="wamActionHero"><div className="wamActionIcon"><Icon tone={op.tone}/></div><div><span>{op.eyebrow}</span><h3>{modal.action}</h3></div><div className="wamActionBadge">{groupFor(modal.screen)}</div></div>
          <div className="wamFacts">{op.facts.map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>
          {op.notice&&<div className="wamNotice"><Info size={15}/><span>{op.notice}</span></div>}
          <div className="wamFormHead"><div><span className="wamSectionKicker">REVIEW & INPUT</span><h4>Operation details</h4></div><span className="wamRequired">* Required where applicable</span></div>
          <div className="wamFormGrid">
            {op.fields.map((f)=><label key={f.label} className={f.type==='textarea'?'wamField wamWide':'wamField'}><span>{f.label}</span>{f.type==='textarea'?<textarea value={values[f.label]||''} onChange={e=>set(f.label,e.target.value)} placeholder={f.placeholder}/>:f.type==='select'?<select value={values[f.label]??f.value??''} onChange={e=>set(f.label,e.target.value)}><option value="">Select…</option><option>{f.value||'Pending review'}</option><option>Approved</option><option>Pending</option><option>Needs correction</option><option>Manual review</option></select>:<input value={values[f.label]??f.value??''} onChange={e=>set(f.label,e.target.value)} placeholder={f.placeholder}/>}</label>)}
          </div>
          {complete&&<div className="wamSuccess"><CheckCircle2 size={17}/><div><strong>{op.primary} staged successfully</strong><span>Frontend UI state updated. No backend or financial mutation was performed.</span></div></div>}
          <div className="wamFooter"><button className="wamSecondary" onClick={()=>setModal(x=>({...x,open:false}))}>Cancel</button>{op.secondary&&<button className="wamGhost" onClick={()=>setComplete(true)}>{op.secondary}<ArrowRight size={14}/></button>}<button className={`wamPrimary ${op.tone==='danger'?'isDanger':''}`} onClick={submit} disabled={complete}>{complete?<><Check size={16}/> Staged</>:<>{op.primary}<ArrowRight size={16}/></>}</button></div>
        </div>
      </div>
      <footer className="wamBottom"><span><Landmark size={13}/> DISH operational UI</span><span><FileCheck2 size={13}/> Review before confirmation</span><span><History size={13}/> Activity timeline</span></footer>
    </section>
  </div>;
}
