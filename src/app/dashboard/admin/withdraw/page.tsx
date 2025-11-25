import { fetchJSON } from '@/lib/api';
import { GET_ADMIN_BALANCE_URL } from '@/lib/endpoint';
import WithdrawForm from './_components/WithdrawForm';

type Props = {
  params: Promise<{ id: string }>;
};

const WithdrawPage = async ({ params }: Props) => {
  const { id } = await params;
  
  // Simple GET du dividende uniquement
  const response = await fetchJSON(`${GET_ADMIN_BALANCE_URL}`);
  //console.log("+++++++++",response);
  
  const dividende = response?.dividende || 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Retrait d'Argent</h1>
        <p className="text-gray-600 mt-1">
          Retirez vos dividendes en toute sécurité
        </p>
      </div>
      
      <WithdrawForm 
        currentBalance={dividende}
        adminId={id}
      />
    </div>
  );
};

export default WithdrawPage;