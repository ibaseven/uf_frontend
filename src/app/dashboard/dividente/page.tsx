import { fetchJSON } from '@/lib/api';
import ActionnaireUserViewRer from './_components/actionnaires';
import { GET_ACTIONNAIRES_URL_2, GET_TRANSACTIONS_URL } from '@/lib/endpoint';

const ActionnairesAdminPage = async () => {
  const response = await fetchJSON(GET_ACTIONNAIRES_URL_2);
  const transactionsResponse = await fetchJSON(GET_TRANSACTIONS_URL);

  console.log("+++++++++", response);

  return (
    <ActionnaireUserViewRer
      user_info={response}
      transactions={transactionsResponse.transactions}
    />
  );
};

export default ActionnairesAdminPage;
