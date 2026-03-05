export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { fetchJSON } from '@/lib/api';
import { getAllMoratoireEngagements } from '@/actions/moratoire';
import { GET_ACTIONNAIRES_URL } from '@/lib/endpoint';
import MoratoireAdminView from './_components/MoratoireAdminView';

export default async function MoratoireAdminPage() {
  const [moratoiresRes, actionnairesRes] = await Promise.all([
    getAllMoratoireEngagements(),
    fetchJSON(GET_ACTIONNAIRES_URL),
  ]);

  const moratoires = moratoiresRes.data || [];
  const actionnaires = actionnairesRes?.actionnaires || [];

  return (
    <div className="p-6">
      <MoratoireAdminView moratoires={moratoires} actionnaires={actionnaires} />
    </div>
  );
}
