'use client';
import ScreenWorkspace from './ScreenWorkspace';
import {PortalShell} from './PortalShell';
export default function RolePortalRoute({role,slug}:{role:string;slug:string}){return <PortalShell role={role} slug={slug}><ScreenWorkspace role={role} slug={slug}/></PortalShell>}
