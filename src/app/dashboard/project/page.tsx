// app/dashboard/pay-projects/page.tsx
import { fetchJSON } from '@/lib/api';
import { GET_ACTIONNAIRES_URL_2 } from '@/lib/endpoint';
import ProjectPaymentView from './_actionnaires/rapport';
import { AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PayProjectsPage = async () => {
  try {
    const response = await fetchJSON(GET_ACTIONNAIRES_URL_2);
    
    const projects = response.projects || [];
    console.log('Projets récupérés:', projects);

    return <ProjectPaymentView projects={projects} />;
    
  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error);
    
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-2xl mx-auto">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error 
              ? error.message 
              : 'Une erreur est survenue lors du chargement de vos projets.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }
};

export default PayProjectsPage;