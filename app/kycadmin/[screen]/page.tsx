import ModuleScreen from '../../../components/ModuleScreen';
export default function Page({params}:{params:{screen:string}}){return <ModuleScreen role="kycadmin" slug={params.screen}/>}
