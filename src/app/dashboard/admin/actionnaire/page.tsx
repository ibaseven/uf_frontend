// app/admin/actionnaires/page.tsx
import { fetchJSON } from '@/lib/api';
import ActionnairesAdminView from './_actionnaires/pagee';
import { GET_ACTIONNAIRES_URL, GET_ALL_PROJECTS_URL } from '@/lib/endpoint';

interface PageProps {
  searchParams: Promise<{ annee?: string }>;
}

const ActionnairesAdminPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  // Charger les actionnaires et les projets en parallèle
  const [actionnairesResponse, projectsResponse] = await Promise.all([
    fetchJSON(GET_ACTIONNAIRES_URL),
    fetchJSON(GET_ALL_PROJECTS_URL)
  ]);

  const actionnaires = actionnairesResponse.actionnaires || [];
  const allProjects = projectsResponse.projects || [];

  const statistiques = {
    nombre_total_actionnaires: actionnaires.length,
    actionnaires_actifs: actionnaires.filter((a: any) => !a.isBlocked).length,
    actionnaires_bloques: actionnaires.filter((a: any) => a.isBlocked).length,
    total_actions: actionnaires.reduce((sum: number, a: any) => sum + (a.actionsNumber || 0), 0),
    total_dividendes: actionnaires.reduce((sum: number, a: any) => sum + (a.dividende || 0), 0)
  };

  return (
    <ActionnairesAdminView
      actionnaires={actionnaires}
      statistiques={statistiques}
      allProjects={allProjects}
    />
  );
};

export default ActionnairesAdminPage;