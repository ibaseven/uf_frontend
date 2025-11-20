// // app/dashboard/projects/page.tsx
// import { fetchJSON } from '@/lib/api';
// import { GET_ALL_PROJECTS_URL } from '@/lib/endpoint';
// import ProjectsAdminView from './_components/ProjectsAdminView';


// export const dynamic = 'force-dynamic';
// export const runtime = 'nodejs';

// export default async function ProjectsPage() {
//   try {
//     const response = await fetchJSON(GET_ALL_PROJECTS_URL);
    
//     const projects = response.projects || [];
    
//     return (
//       <ProjectsAdminView 
//         projects={projects}
//       />
//     );
//   } catch (error) {
//     console.error('Erreur lors du chargement des projets:', error);
    
//     return (
//       <ProjectsAdminView 
//         projects={[]}
//       />
//     );
//   }
// }