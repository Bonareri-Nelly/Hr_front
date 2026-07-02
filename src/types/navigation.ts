export type NavigationItem = {
  id: string;
  label: string;
  path: string;
  section: string;
  icon: string;
};

export type NavigationSection = {
  label: string;
  items: NavigationItem[];
};
