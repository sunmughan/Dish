import { PortalShell } from '../../../components/PortalShell';
import CompleteRolePortalScreen from '../../../components/CompleteRolePortalScreen';

export default async function Page({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  return <PortalShell role="user" slug={screen}><CompleteRolePortalScreen role="user" slug={screen} /></PortalShell>;
}
