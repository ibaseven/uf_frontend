import { fetchJSON } from '@/lib/api';
import { GET_ACTIONNAIRES_URL_2, GET_OWNER_URL } from '@/lib/endpoint';
import WithdrawTabs from './_components/WithdrawTabs';

type Props = {
  params: Promise<{ id: string }>;
};

const WithdrawPage = async ({ params }: Props) => {
  const { id } = await params;
  
  // Récupération des données utilisateur connecté
  const response = await fetchJSON(`${GET_ACTIONNAIRES_URL_2}`);
  //console.log("+++++++++", response);
  const ownerResponse = await fetchJSON(`${GET_OWNER_URL}`);
  const user = response?.user;
  const userDividende = ownerResponse?.owner?.dividende || 0;
  const isTheSuperAdmin = user?.isTheSuperAdmin || false;

  // Récupération du solde Owner (si super admin)
  let ownerBalance = 0;
  if (isTheSuperAdmin) {
    try {
      
      //console.log(ownerResponse);
      
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