import { fetchJSON } from '@/lib/api';
import { GET_ALL_PROJECTS_URL, GET_ACTION_PRICE_URL, GET_PROJECT_PARTICIPANTS_URL, GET_ACTIONNAIRES_URL_2, GET_SETTINGS_URL } from '@/lib/endpoint';
import ProjectsAdminView from './_components/ProjectsAdminView';
import BlockSettingsPanel from './_components/BlockSettingsPanel';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ProjectsPage() {
  // Récupérer les projets
  const projectsResponse = await fetchJSON(GET_ALL_PROJECTS_URL);
  const projects = projectsResponse?.projects || [];

  // Récupérer le prix des actions
  const priceResponse = await fetchJSON(GET_ACTION_PRICE_URL);
  const actionPrice = priceResponse?.pricePerAction;

  // Récupérer le profil utilisateur pour vérifier isTheOwner
  let isTheOwner = false;
  try {
    const profileResponse = await fetchJSON(GET_ACTIONNAIRES_URL_2);
    isTheOwner = profileResponse?.user?.isTheOwner ?? false;
  } catch {}

  // Récupérer les paramètres de blocage
  let actionsBlocked = false;
  let projectsBlocked = false;
  try {
    const settingsResponse = await fetchJSON(GET_SETTINGS_URL);
    actionsBlocked = settingsResponse?.actionsBlocked ?? false;
    projectsBlocked = settingsResponse?.projectsBlocked ?? false;
  } catch {}

  // Récupérer les participants pour chaque projet
  const projectsWithParticipants = await Promise.all(
    projects.map(async (project: any) => {
      try {
        const participantsUrl = `${GET_PROJECT_PARTICIPANTS_URL}/${project._id}/participants`;
        const participantsResponse = await fetchJSON(participantsUrl);
        return {
          ...project,
          participants: participantsResponse?.participants || [],
          stats: participantsResponse?.stats || {
            totalParticipants: 0,
            totalPacks: 0,
            totalInvestment: 0,
            totalPaid: 0,
            totalRemaining: 0,
            completedParticipants: 0
          }
        };
      } catch (error) {
        console.error(`Erreur récupération participants projet ${project._id}:`, error);
        return {
          ...project,
          participants: [],
          stats: {
            totalParticipants: 0,
            totalPacks: 0,
            totalInvestment: 0,
            totalPaid: 0,
            totalRemaining: 0,
            completedParticipants: 0
          }
        };
      }
    })
  );

  return (
    <div>
      {isTheOwner && (
        <div className="p-6 pb-0">
          <BlockSettingsPanel
            initialActionsBlocked={actionsBlocked}
            initialProjectsBlocked={projectsBlocked}
          />
        </div>
      )}
      <ProjectsAdminView
        projects={projectsWithParticipants}
        actionPrice={actionPrice}
      />
    </div>
  );
}