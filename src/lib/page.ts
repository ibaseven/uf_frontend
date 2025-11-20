/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LayoutGrid,
  CalendarCheck,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getPages(pathname: string, role?: string): Group[] {


  let rolePages: Group[] = [];

  // Rendre le tableau en fonction du rôle
  if (role === "universalLab_Admin") {
    rolePages = [
      {
        groupLabel: "Administrateur",
        menus: [
          {
            href: "/dashboard/admin/actionnaire",
            label: "Bureau",
            active: pathname === "/dashboard/admin/actionnaire",
            icon: LayoutGrid,
            submenus: []
          },
          {
            href: "/dashboard/admin/prevision",
            label: "Projects",
            active: pathname === "/dashboard/admin/prevision",
            icon: LayoutGrid,
            submenus: []
          },
          /* {
            href: "/dashboard/admin/historique",
            label: "Historique",
            active: pathname === "/dashboard/admin/historique",
            icon: LayoutGrid,
            submenus: []
          }, */
 {
            href: " /dashboard/admin/purchaseActionnaire",
            label: "Historique Transaction Actions",
            active: pathname === "/dashboard/admin/purchaseActionnaire",
            icon: LayoutGrid,
            submenus: []
          },
 /* {
            href: " /dashboard/admin/sellaction",
            label: "Vente des Actions",
            active: pathname === "/dashboard/admin/sellaction",
            icon: LayoutGrid,
            submenus: []
          }, */
           /* {
            href: " /dashboard/admin/actionssellbuyuser",
            label: "Vente des Actions Entre User",
            active: pathname === "/dashboard/admin/actionssellbuyuser",
            icon: LayoutGrid,
            submenus: []
          }, */
         
         // Ajout de la page paiements
        ]
      },
      
    ];
  } else if (role === "actionnaire") {
    rolePages = [
      {
        groupLabel: "Actionnaire",
        menus: [
          {
            href: "/dashboard/actionnaire",
            label: "ACTIONS",
            active: pathname === "/dashboard/actionnaire",
            icon: LayoutGrid,
            submenus: []
          },
          {
            href: "/dashboard/dividente",
            label: "DIVIDENDES",
            active: pathname === "/dashboard/dividente",
            icon: CalendarCheck,
            submenus: []
          },
           {
            href: "/dashboard/projectEntreprise",
            label: "Projects Entreprise",
            active: pathname === "/dashboard/projectEntreprise",
            icon: CalendarCheck,
            submenus: []
          } 
          ,
           {
            href: "/dashboard/project",
            label: "Mes Projects",
            active: pathname === "/dashboard/project",
            icon: CalendarCheck,
            submenus: []
          },
           /* {
            href: "/dashboard/prevision",
            label: "Prevision",
            active: pathname === "/dashboard/prevision",
            icon: LayoutGrid,
            submenus: []
          }, */
          { 
           href: " /dashboard/transactions",
            label: "Historique Transaction Actions",
            active: pathname === "/dashboard/transactions",
            icon: LayoutGrid,
            submenus: []
          },
          { 
           href: " /dashboard/mypurchase",
            label: "Achat des Actions",
            active: pathname === "/dashboard/mypurchase",
            icon: LayoutGrid,
            submenus: []
          },
        ]
      },
    ];
  } 

  return rolePages;
}