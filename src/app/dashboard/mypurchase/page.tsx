import { fetchJSON } from '@/lib/api';
import BuyActionsView from "./_components/ByActions";
import { GET_ACTION_PRICE_URL } from '@/lib/endpoint';

const BuyActionsPage = async () => {
  const response = await fetchJSON(GET_ACTION_PRICE_URL);  
  const pricePerAction = response.pricePerAction
  return <BuyActionsView pricePerAction={pricePerAction} />;
};

export default BuyActionsPage;
