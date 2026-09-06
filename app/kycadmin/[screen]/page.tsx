import RolePortalRoute from '../../../components/RolePortalRoute';
export default async function Page({params}:{params:Promise<{screen:string}>}){const {screen}=await params;return <RolePortalRoute role="kycadmin" slug={screen}/>}
