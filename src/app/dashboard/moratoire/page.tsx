export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { getMoratoireByUser } from '@/actions/moratoire';
import MoratoireView from './_components/MoratoireView';

export default async function MoratoirePage() {
  const res = await getMoratoireByUser();
  const moratoires = res.data || [];

  return (
    <div className="p-6">
      <MoratoireView moratoires={moratoires} />
    </div>
  );
}
