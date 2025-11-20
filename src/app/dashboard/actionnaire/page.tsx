import { fetchJSON } from '@/lib/api';


import ActionnaireUserView from './_components/actionnaires';
import { log } from 'console';
import { GET_ACTIONNAIRES_URL_2 } from '@/lib/endpoint';

const MyActionsPage = async () => {
  try {
    const response = await fetchJSON(GET_ACTIONNAIRES_URL_2);
    //console.log('Response from GET_ACTIONNAIRES_URL_2:', response);
    
    return (
      <ActionnaireUserView
        user={response.user}
      />
    );
  } catch (error) {
    console.error('Erreur lors du chargement de la page mes actions:', error);

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement de vos actions.'}
          </p>
        </div>
      </div>
    );
  }
};

export default MyActionsPage;
