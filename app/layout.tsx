import './globals.css';
import './responsive.css';
import './workflow-modal.css';
import type { Metadata } from 'next';
import WorkflowActionModal from '../components/WorkflowActionModal';
export const metadata: Metadata={title:'DISH — Fractional Real Estate Investment',description:'DISH policyholder, agent and operations platform'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<WorkflowActionModal/></body></html>}
