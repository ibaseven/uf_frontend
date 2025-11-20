// TransactionsPage.tsx
import { fetchJSON } from '@/lib/api';
import { GET_TRANSACTIONS_PURCHASE_URL_FOR_ACTIONNAIRE } from '../../../lib/endpoint';
import TransactionsAdaptedView from './_components/actionnaires';

const TransactionsPage = async () => {
  const transactionsResponse = await fetchJSON(GET_TRANSACTIONS_PURCHASE_URL_FOR_ACTIONNAIRE);
  //console.log(transactionsResponse);
  
  return (
    <TransactionsAdaptedView
      transactions={transactionsResponse}
    />
  );
};

export default TransactionsPage;