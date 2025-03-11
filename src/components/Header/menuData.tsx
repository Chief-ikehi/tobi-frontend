interface Menu {
  id: number;
  title: string;
  newTab: boolean;
  path: string;
  submenu?: Menu[];
}

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "About Us",
    newTab: false,
    path: "/about",
  },
  {
    id: 3,
    title: "Contact",
    newTab: false,
    path: "/contact",
  },
  {
    id: 4,
    title: "Private Members",
    newTab: false,
    path: "/private-members",
  },
  {
    id: 5,
    title: "Investor Portal",
    newTab: false,
    path: "/investor-portal",
    /*submenu: [
      {
          id: 61,
          title: "Investment Directory",
          newTab: false,
          path: "/investor-portal/investment-directory" },

      {
          id: 62,
          title: "Property Analysis:",
          newTab: false,
      path: "/investor-portal/dashboard" },
    ],*/
  },
  {
    id: 6,
    title: "Agent Portal",
    newTab: false,
    path: "/agent-portal",
  },/*
  {
    id: 7,
    title: "Pages",
    newTab: false,
    submenu: [
      {
        id: 31,
        title: "Dashboard",
        newTab: false,
        path: "/dashboard",
      },
      {
        id: 32,
        title: "Sign In",
        newTab: false,
        path: "/auth/signin",
      },
      {
        id: 33,
        title: "Sign Up",
        newTab: false,
        path: "/auth/signup",
      },
      {
        id: 36,
        title: "404",
        newTab: false,
        path: "/error",
      },
    ],
  },*/

];

export default menuData;
