// TransactionsPage.tsx
import { fetchJSON } from '@/lib/api';
import TransactionsAdaptedViewBYAdmin from './_components/transactions';
import { GET_TRANSACTIONS_PURCHASE_URL_FOR_ADMIN } from '@/lib/endpoint';

const TransactionsPage = async () => {
  const transactionsResponse = await fetchJSON(GET_TRANSACTIONS_PURCHASE_URL_FOR_ADMIN);
  //console.log(transactionsResponse);
  
  return (
    <TransactionsAdaptedViewBYAdmin
      transactions={transactionsResponse}
    />
  );
};

export default TransactionsPage;