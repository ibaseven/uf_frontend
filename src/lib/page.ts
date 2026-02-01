import {
  Home,
  Users,
  Wallet,
  FolderKanban,
  Receipt,
  ShoppingCart,
  Building2,
  ArrowLeftRight,
  LucideIcon,
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
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

// Pages pour les actionnaires
const actionnairePages = (pathname: string): Group[] => [
  {
    groupLabel: "Tableau de bord",
    menus: [
      {
        href: "/dashboard/actionnaire",
        label: "Mon compte",
        active: pathname === "/dashboard/actionnaire",
        icon: Home,
        submenus: [],
      },
    ],
  },
  {
    groupLabel: "Finances",
    menus: [
      {
        href: "/dashboard/dividente",
        label: "Mes dividendes",
        active: pathname === "/dashboard/dividente",
        icon: Wallet,
        submenus: [],
      },
      {
        href: "/dashboard/mypurchase",
        label: "Mes achats",
        active: pathname === "/dashboard/mypurchase",
        icon: ShoppingCart,
        submenus: [],
      },
      {
        href: "/dashboard/transactions",
        label: "Mes transactions",
        active: pathname === "/dashboard/transactions",
        icon: Receipt,
        submenus: [],
      },
    ],
  },
  {
    groupLabel: "Projets",
    menus: [
      {
        href: "/dashboard/project",
        label: "Projets disponibles",
        active: pathname === "/dashboard/project",
        icon: FolderKanban,
        submenus: [],
      },
      {
        href: "/dashboard/projectEntreprise",
        label: "Mes projets",
        active: pathname === "/dashboard/projectEntreprise",
        icon: Building2,
        submenus: [],
      },
    ],
  },
];

// Pages pour les administrateurs
const adminPages = (pathname: string): Group[] => [
  {
    groupLabel: "Administration",
    menus: [
      {
        href: "/dashboard/admin/actionnaire",
        label: "Actionnaires",
        active: pathname.includes("/dashboard/admin/actionnaire"),
        icon: Users,
        submenus: [],
      },
      {
        href: "/dashboard/admin/prevision",
        label: "Projets",
        active: pathname.includes("/dashboard/admin/prevision"),
        icon: FolderKanban,
        submenus: [],
      },
      {
        href: "/dashboard/admin/purchaseActionnaire",
        label: "Achats actions",
        active: pathname.includes("/dashboard/admin/purchaseActionnaire"),
        icon: ShoppingCart,
        submenus: [],
      },
      /* {
        href: "/dashboard/admin/actionssellbuyuser",
        label: "Transferts",
        active: pathname.includes("/dashboard/admin/actionssellbuyuser"),
        icon: ArrowLeftRight,
        submenus: [],
      }, */
      {
        href: "/dashboard/admin/withdraw",
        label: "Retraits",
        active: pathname.includes("/dashboard/admin/withdraw"),
        icon: Wallet,
        submenus: [],
      },
    ],
  },
];

export const getPages = (pathname: string, role?: string): Group[] => {
  if (role === "universalLab_Admin") {
    return adminPages(pathname);
  }

  return actionnairePages(pathname);
};
