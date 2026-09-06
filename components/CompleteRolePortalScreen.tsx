'use client';
import {useMemo,useState} from 'react';
import {ArrowUpRight,BarChart3,ChevronRight,Download,Filter,Plus,RefreshCcw,Search,ShieldCheck,SlidersHorizontal,Users,WalletCards} from 'lucide-react';
import {getScreenCatalog,type ScreenCatalog} from './ScreenSpecificCatalog';

const aliases:Record<string,Record<string,string>>={
 opsadmin:{approvals:'alerts-approvals',policies:'policy-book',lifecycle:'lifecycle-manager',users:'user-master',kyc:'kyc-approval-queue',nominees:'nominee-management',cities:'city-master',developers:'developer-master',assets:'property-asset-master',allocations:'asset-allocation',ledger:'central-ledger',yield:'yield-engine',payouts:'payout-queue',settlements:'refund-settlement',documents:'document-center',support:'ticket-queue'},
 supportadmin:{support:'ticket-queue',sla:'sla-monitor',escalations:'escalations','resolution-history':'resolution-history',users:'user-master',policies:'policy-book',documents:'document-center'},
 kycadmin:{kyc:'kyc-approval-queue','kyc-users':'user-kyc-master',policies:'policy-book',proposals:'proposal-queue',nominees:'nominee-management',audit:'audit-logs'},
 agent:{performance:'performance-analytics',clients:'client-registry',policies:'policy-book',emi:'emi-follow-up','payment-links':'payment-links','missed-emis':'missed-emi-alerts','follow-ups':'follow-up-tasks','lapse-warnings':'lapse-warnings',commission:'commission','tds':'tds-statements',payouts:'payout-statements'}
};
const actionFor=(s:string)=>({dashboard:'Open work queue','table:'Open record','queue':'Review case','detail':'Open policy','form:'Validate','chart:'Open drilldown',timeline:'Inspect event',settings:'Edit setting'}[s]||'Open record');
const pretty=(s:string)=>s.replaceAll('-',' ').replace(/\b\w/g,x=>x.toUpperCase());

function dataFor(role:string,slug:string){const key=aliases[role]?.[slug]||slug;return {key,d:getScreenCatalog(key)};}

export default function CompleteRolePortalScreen({role,slug}:{role:string;slug:string}){
 const {key,d}=useMemo(()=>dataFor(role,slug),[role,slug]);
 const [q,setQ]=useState('');const [filter,setFilter]=useState('All');const [toast,setToast]=useState('');
 const rows=d.rows.filter(r=>r.join(' ').toLowerCase().includes(q.toLowerCase())).filter(r=>filter==='All'||r.some(x=>x.toLowerCase().includes(filter.toLowerCase())));
 const flash=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(''),1800)};
 const primary=d.actions[0]||actionFor(d.view);
 return <div className="moduleScreen completeRoleScreen">
   <div className="moduleHero"><div><div className="eyebrow">{role.toUpperCase()} · {d.view.toUpperCase()}</div><h1>{d.title}</h1><p>{d.sub}</p></div><div className="heroActions"><button className="btn" data-workflow-action={d.actions[1]||'Refresh'}><RefreshCcw size={15}/> {d.actions[1]||'Refresh'}</button><button className="btn primary" data-workflow-action={primary}><ArrowUpRight size={15}/> {primary}</button></div></div>
   <div className="metricGrid">{d.kpis.map((k,i)=><div className="metric card" key={k}><span>{k}</span><strong>{d.values[i]||'—'}</strong><small>{i===0?'Current queue':i===1?'Needs attention':i===2?'Today':'Operational view'}</small></div>)}</div>
   <div className="moduleToolbar card"><div className="searchBox"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search ${d.title.toLowerCase()}…`}/></div><button className="btn" onClick={()=>setFilter(filter==='All'?'Review':'All')}><Filter size={15}/> {filter==='All'?'Filter':'Review only'}</button><button className="btn" data-workflow-action="Export"><Download size={15}/> Export</button><button className="btn" data-workflow-action="Configure filters"><SlidersHorizontal size={15}/> Filters</button></div>
   <div className="contentGrid">
    <section className="card moduleTableCard"><div className="sectionHead"><div><span className="eyebrow">WORK QUEUE</span><h3>{d.title} records</h3></div><span className="muted">{rows.length} visible</span></div><div className="tableWrap"><table><thead><tr>{d.columns.map(c=><th key={c}>{c}</th>)}<th>Action</th></tr></thead><tbody>{rows.map((r,ri)=><tr key={`${r[0]}-${ri}`}>{r.map((v,i)=><td key={`${i}-${v}`}><span className={i===r.length-1?'statusPill':''}>{v}</span></td>)}<td><button className="tableAction" data-workflow-action={d.actions[ri%d.actions.length]||primary}>{d.actions[ri%d.actions.length]||primary}<ChevronRight size={13}/></button></td></tr>)}</tbody></table></div></section>
    <aside className="card operationRail"><div className="sectionHead"><div><span className="eyebrow">OPERATIONS</span><h3>Screen controls</h3></div><ShieldCheck size={17}/></div><p>{d.note}</p><div className="railActions">{d.actions.map(a=><button className="btn" data-workflow-action={a} key={a}><WalletCards size={15}/>{a}<ChevronRight size={13}/></button>)}</div><div className="railInfo"><Users size={15}/><div><strong>Role scope</strong><span>{role==='admin'?'Global Head Office':'Restricted to '+pretty(role)+' workspace'}</span></div></div></aside>
   </div>
   {d.view==='chart'&&<div className="card visualPanel"><div className="sectionHead"><div><span className="eyebrow">TREND VIEW</span><h3>Operational movement</h3></div><BarChart3 size={18}/></div><div className="bars">{d.values.map((v,i)=><div key={i}><span>{v}</span><i style={{height:`${35+(i*13)%55}%`}}/><small>{d.kpis[i]||`Period ${i+1}`}</small></div>)}</div></div>}
   <div className="moduleFooterNote">{d.note}</div>{toast&&<div className="toast">{toast}</div>}
 </div>;
}
