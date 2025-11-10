export interface ActionsData {
  actionsNumber: number;
  dividende: number;
  derniere_mise_a_jour: string;
}



export interface ActionnaireUserViewProps {
  actions: ActionsData;
  user_info: UserInfo;
}

 export interface ActionsData {
  actionsNumber: number;
  dividende: number;
  derniere_mise_a_jour: string;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  telephone: string;
  telephonePartenaire?: string | null;
  actionsNumber?: number;
  dividende: number;
  derniere_mise_a_jour?: string;
  role?: string;
}

export interface Statistics {
  totalInvested: number;
  totalRemaining: number;
  totalPacks: number;
  numberOfProjects: number;
  completedProjects: number;
}

export interface Project {
  // Tu peux compléter selon ta structure réelle de projet
  id?: string;
  name?: string;
  status?: string;
  [key: string]: any;
}

export interface UserDashboard {
  user: UserInfo;
  statistics: Statistics;
  projects: Project[];
}




export interface WithdrawalForm {
  phoneNumber: string;
  amount: string;
  paymentMethod: string;
}