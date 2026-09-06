'use client';
import {getDedicatedScreen} from './generated/DedicatedScreens';
export default function CompleteRolePortalScreen({role,slug}:{role:string;slug:string}){
  const Screen=getDedicatedScreen(role,slug);
  return <div className="moduleScreen completeRoleScreen"><Screen role={role} slug={slug}/></div>;
}