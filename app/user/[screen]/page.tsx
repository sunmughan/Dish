import UserPortalScreen from '../../../components/UserPortalScreen';
import {PortalShell} from '../../../components/PortalShell';

const SCREEN_MAP: Record<string, string> = {
  dashboard: 'dashboard',
  policy: 'my-policy',
  payments: 'payments-emi',
  yield: 'yield-benefits',
  'payout-tracking': 'payout-tracking',
  documents: 'document-center',
  receipts: 'emi-receipts',
  statements: 'annual-statements',
  'tax-summary': 'tax-income-summary',
  'nominee-request': 'nominee-update',
  'bank-request': 'bank-change',
  'address-request': 'address-update',
  termination: 'termination-request',
  support: 'support-grievance',
  profile: 'profile-security',
};

export default async function Page({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  const mapped = SCREEN_MAP[screen] ?? screen;
  return <PortalShell role="user" slug={screen}><UserPortalScreen slug={mapped} /></PortalShell>;
}
