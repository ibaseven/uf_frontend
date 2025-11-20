export type User = {
    _id: string;
    firstName: string;
    lastName: string;
    telephone: string;
    role: string;
  
  };
export type Role = 'universalLab_Admin' | 'actionnaire' ;
  export type UserInfos = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  imgUser?: string;
  isVerified: boolean;
  role: Role;


};