// app/admin/actionnaires/page.tsx
import { fetchJSON } from '@/lib/api';
import ActionnairesAdminView from './_actionnaires/pagee';
import { GET_ACTIONNAIRES_URL } from '@/lib/endpoint';

interface PageProps {
  searchParams: Promise<{ annee?: string }>;
}

const ActionnairesAdminPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const response = await fetchJSON(GET_ACTIONNAIRES_URL);
  
  const actionnaires = response.actionnaires || [];
  
  const statistiques = {
    nombre_total_actionnaires: actionnaires.length,
    actionnaires_actifs: actionnaires.filter((a: any) => !a.isBlocked).length,
    actionnaires_bloques: actionnaires.filter((a: any) => a.isBlocked).length,
    total_actions: actionnaires.reduce((sum: number, a: any) => sum + (a.actionsNumber || 0), 0),
    total_dividendes: actionnaires.reduce((sum: number, a: any) => sum + (a.dividende || 0), 0)
  };
  //console.log(response);
  
  return (
    <ActionnairesAdminView
      actionnaires={actionnaires}
      statistiques={statistiques}
      entreprise_info={null}
      toutes_annees={[]}
      resume_global={{
        nombre_annees: 0,
        total_benefices_toutes_annees: 0,
        premiere_annee: null,
        derniere_annee: null,
        moyenne_benefice_par_annee: 0
      }}
    />
  );
};

export default ActionnairesAdminPage;