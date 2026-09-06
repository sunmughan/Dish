'use client';
import CompleteRolePortalScreen from './CompleteRolePortalScreen';
import {PortalShell} from './PortalShell';
export default function RolePortalRoute({role,slug}:{role:string;slug:string}){return <PortalShell role={role} slug={slug}><CompleteRolePortalScreen role={role} slug={slug}/></PortalShell>}
