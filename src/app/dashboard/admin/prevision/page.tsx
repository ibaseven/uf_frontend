// app/dashboard/projects/page.tsx
import { fetchJSON } from '@/lib/api';
import { GET_ALL_PROJECTS_URL, GET_ACTION_PRICE_URL } from '@/lib/endpoint';
import ProjectsAdminView from './_components/ProjectsAdminView';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ProjectsPage() {

    // Récupérer les projets
    const projectsResponse = await fetchJSON(GET_ALL_PROJECTS_URL);
    const projects = projectsResponse?.projects || [];
    const priceResponse = await fetchJSON(GET_ACTION_PRICE_URL);
    const actionPrice = priceResponse?.pricePerAction
    
    return (
      <ProjectsAdminView 
        projects={projects}
        actionPrice={actionPrice}
      />
    );
}