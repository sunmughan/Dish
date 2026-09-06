# DISH Platform UI

Next.js frontend prototype for the DISH fractional-real-estate policy platform, based on the supplied DISH Platform Spec v2.0 (August 2026).

## Included
- Public marketing website + live EMI calculator
- Super Admin / Head Office command center with comprehensive operational menus
- Ops Admin, Support Admin and KYC Admin role workspaces
- Agent / Field Sales portal
- User / Policyholder portal
- RBAC-aware navigation and role-specific screens
- Mobile-first responsive navigation and layouts
- Institutional real-estate / insurance visual language
- React Bits-inspired interaction primitives

## Portal coverage
### Super Admin
Command Center, Identity & Access, City/Developer/Asset Masters, Policy Creation, Proposals, Policy Book, Lifecycle, Rules Engine, KYC/User Master, Bank/Nominee/Address verification, Ownership Transfer, Central Ledger, EMI Collection, Reconciliation, Adjustments, Refund & Settlement, Yield Engine, Payouts, Failed Payouts, Yield Forecast, Agent Master, Hierarchy, Commission, Holds, Clawbacks, Performance Analytics, Document Center, Print Queue, Courier/AWB, Delivery, Reprints, Support, SLA, Escalations, Resolution History, MIS, Audit, Security Events, Webhooks, Jobs, Notifications, Integrations, Feature Flags and System Settings.

### Other roles
- Ops Admin: operations, customer verification, assets/partners, financial, documents/support and reports.
- Support Admin: ticket queue, SLA, escalation, resolution history, customer context and communications.
- KYC Admin: approval queue, user master, bank/address/nominee verification, policy context, exceptions and verification audit.
- Agent: dashboard, performance, notices, client registry, proposal flow, proposal queue, policy book, EMI follow-up, payment links, missed EMI alerts, follow-up tasks, lapse warnings, commission, TDS, payouts, support and profile.
- Policyholder: dashboard, policy, payments/EMI, yield/benefits, payout tracking, document center, receipts, annual statements, tax summary, nominee/bank/address requests, termination, support and profile/security.

## Responsive behavior
Desktop uses a persistent grouped sidebar. Tablet reduces density. Mobile removes the desktop sidebar, exposes the complete grouped menu through a compact menu bar, collapses grids and renders records as stacked cards so users do not need to zoom out.

## Source rules represented
- Three core portals: Admin, Agent, User.
- No fixed investment plans; client chooses monthly EMI and tenure.
- Minimum EMI ₹5,000 and tenure 24–48 months.
- Policy lifecycle and financial workflows are represented as controlled operational screens.

## Run
```bash
npm install
npm run dev
```
