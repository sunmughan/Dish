import RolePortalScreen from '../../../components/RolePortalScreen';
export default async function Page({params}:{params:Promise<{screen:string}>}){const {screen}=await params;return <RolePortalScreen role="kycadmin" slug={screen}/>}
