import { fetchJSON } from '@/lib/api';
import { GET_ACTIONNAIRES_URL_2, GET_OWNER_URL ,GET_STATISTIQUE_PROJECT} from '@/lib/endpoint';
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
  const userDividende = ownerResponse?.owner?.dividende || 0;
  const isTheSuperAdmin = user?.isTheSuperAdmin || false;
  const statisque= await fetchJSON(`${GET_STATISTIQUE_PROJECT}`)
  //console.log(statisque);
  
  // Récupération des statistiques des transactions
  const sommeActions = statisque?.sommeActions ;
  const sommeProject = statisque?.sommeProject;

  // Récupération du solde Owner (si super admin)
  let ownerBalance = 0;
  if (isTheSuperAdmin) {
    try {
      ownerBalance = ownerResponse?.owner?.dividende || 0;
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

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Somme Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Actions</p>
              <p className="text-3xl font-bold text-gray-900">
                {sommeActions.toLocaleString()} FCFA
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Somme Project */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Projets</p>
              <p className="text-3xl font-bold text-gray-900">
                {sommeProject.toLocaleString()} FCFA
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>
      
      <WithdrawTabs 
        currentBalance={userDividende}
        ownerBalance={ownerBalance}
        adminId={id}
        isTheSuperAdmin={isTheSuperAdmin}
      />
    </div>
  );
};

export default WithdrawPage;