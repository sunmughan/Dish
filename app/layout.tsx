import './globals.css';
import './responsive.css';
import type { Metadata } from 'next';
export const metadata: Metadata={title:'DISH — Fractional Real Estate Investment',description:'DISH policyholder, agent and operations platform'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
