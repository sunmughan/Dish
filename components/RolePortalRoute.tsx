'use client';
import DiverseRoleScreen from './DiverseRoleScreen';
import {PortalShell} from './PortalShell';
export default function RolePortalRoute({role,slug}:{role:string;slug:string}){return <PortalShell role={role} slug={slug}><DiverseRoleScreen role={role} slug={slug}/></PortalShell>}
