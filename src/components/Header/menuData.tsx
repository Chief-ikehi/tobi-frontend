import { Menu } from "@/types/menu";

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
    path: "/membership",
  },
  {
    id: 6,
    title: "Investor Portal",
    newTab: false,
    path: "/investorPortal",
  },
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
        id: 34,
        title: "Sign In",
        newTab: false,
        path: "/auth/signin",
      },
      {
        id: 35,
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
  },

];

export default menuData;
