import './globals.css';
import './responsive.css';
import './workflow-modal.css';
import type { Metadata } from 'next';
import WorkflowActionModal from '../components/WorkflowActionModal';
import DemoNotice from '../components/DemoNotice';
export const metadata: Metadata={title:'DISH — UI Demo by Codeair Software Solutions',description:'DISH UI demonstration prepared by Codeair Software Solutions'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><DemoNotice/>{children}<WorkflowActionModal/></body></html>}
