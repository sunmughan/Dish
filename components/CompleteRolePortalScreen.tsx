'use client';
import {getDedicatedScreen} from './generated/DedicatedScreens';

export default function CompleteRolePortalScreen({role,slug}:{role:string;slug:string}){
  const Screen=getDedicatedScreen(role,slug);
  return <div className="moduleScreen completeRoleScreen" data-workflow-role={role} data-workflow-screen={slug}><Screen role={role} slug={slug}/></div>;
}
