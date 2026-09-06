import ModuleScreenV2 from '../../../components/ModuleScreenV2';
export default async function Page({params}:{params:Promise<{screen:string}>}){const {screen}=await params;return <ModuleScreenV2 role="kycadmin" slug={screen}/>}
