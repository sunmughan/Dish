import UserPortalScreen from '../../../components/UserPortalScreen';
export default async function Page({params}:{params:Promise<{screen:string}>}){const {screen}=await params;return <UserPortalScreen slug={screen}/>}
