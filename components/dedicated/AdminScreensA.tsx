'use client';
import type { ReactNode } from 'react';
import { AlertTriangle, ArrowDownToLine, ArrowRight, BarChart3, Bell, CheckCircle2, ChevronRight, CircleDollarSign, ClipboardCheck, Clock3, Download, FileCheck2, FileText, Flag, GitBranch, History, Landmark, LockKeyhole, MessageSquare, RefreshCcw, Search, ShieldAlert, ShieldCheck, SlidersHorizontal, Smartphone, Target, UserCheck, WalletCards } from 'lucide-react';
export type DedicatedScreenProps={role:string;slug:string};
const Action=({children,icon}:{children:ReactNode;icon?:ReactNode})=><button type="button" className="btn" data-workflow-action={String(children)}>{icon}{children}</button>;