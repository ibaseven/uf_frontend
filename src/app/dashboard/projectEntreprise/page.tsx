// app/dashboard/projects/page.tsx
import { fetchJSON } from '@/lib/api';
import { GET_ALL_PROJECTS_BYUSER_URL, GET_ALL_PROJECTS_URL } from '@/lib/endpoint';
import ProjectsView from './_actionnaires/pagee';



const ProjectsPage = async () => {
  const response = await fetchJSON(GET_ALL_PROJECTS_URL);
  const projectByuser= await fetchJSON(GET_ALL_PROJECTS_BYUSER_URL)
 // console.log(projectByuser);

  return( <ProjectsView projects={response.projects} />);
};

export default ProjectsPage;
