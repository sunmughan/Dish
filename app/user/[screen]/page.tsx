import UserPortalScreen from '../../../components/UserPortalScreen';

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
  return <UserPortalScreen slug={SCREEN_MAP[screen] ?? screen} />;
}
