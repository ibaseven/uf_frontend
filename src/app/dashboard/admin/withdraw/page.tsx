import { fetchJSON } from '@/lib/api';
import { GET_ACTIONNAIRES_URL_2, GET_OWNER_URL, GET_STATISTIQUE_PROJECT } from '@/lib/endpoint';
import WithdrawTabs from './_components/WithdrawTabs';
import { DollarSign, TrendingUp } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

const WithdrawPage = async ({ params }: Props) => {
  const { id } = await params;
  
  // Récupération des données utilisateur connecté
  const response = await fetchJSON(`${GET_ACTIONNAIRES_URL_2}`);
  const ownerResponse = await fetchJSON(`${GET_OWNER_URL}`);

  
  const user = response?.user;
  
  // Récupération des dividendes séparés
  const userDividendeActions = ownerResponse?.owner?.dividende_actions || 0;
  const userDividendeProject = ownerResponse?.owner?.dividende_project || 0;
  
  const isTheSuperAdmin = user?.isTheSuperAdmin || false;
  const statisque = await fetchJSON(`${GET_STATISTIQUE_PROJECT}`);
  
  // Récupération des statistiques des transactions
  const sommeActions = statisque?.sommeActions;
  const sommeProject = statisque?.sommeProject;

  // Récupération du solde Owner (si super admin)
  let ownerBalanceActions = 0;
  let ownerBalanceProject = 0;
  
  if (isTheSuperAdmin) {
    try {
      ownerBalanceActions = ownerResponse?.owner?.dividende_actions || 0;
      ownerBalanceProject = ownerResponse?.owner?.dividende_project || 0;
    } catch (error) {
      console.error("Erreur récupération owner:", error);
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Gestion Financière</h1>
        <p className="text-gray-600 mt-1">
          {isTheSuperAdmin 
            ? "Retirez vos dividendes ou déduisez des frais du compte Owner" 
            : "Retirez vos dividendes en toute sécurité"}
        </p>
      </div>

   
      
      <WithdrawTabs 
        dividendeActions={userDividendeActions}
        dividendeProject={userDividendeProject}
        ownerBalanceActions={ownerBalanceActions}
        ownerBalanceProject={ownerBalanceProject}
        adminId={id}
        isTheSuperAdmin={isTheSuperAdmin}
      />
    </div>
  );
};

export default WithdrawPage;