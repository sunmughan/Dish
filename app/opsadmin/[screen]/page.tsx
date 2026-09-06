import ModuleScreen from '../../../components/ModuleScreen';
export default async function Page({params}:{params:Promise<{screen:string}>}){const {screen}=await params;return <ModuleScreen role="opsadmin" slug={screen}/>}
