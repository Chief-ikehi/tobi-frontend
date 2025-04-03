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
    path: "/about-us",
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
  },
  {
    id: 6,
    title: "Agent Portal",
    newTab: false,
    path: "/agent-portal",
  },
];

export default menuData;
