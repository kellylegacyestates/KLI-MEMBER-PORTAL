export type NavigationItem = {
  label: string;
  href: string;
  isAdmin?: boolean;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Research Library", href: "/research-library" },
  { label: "Publications", href: "/publications" },
  { label: "Weekly Briefings", href: "/briefings" },
  { label: "Standing Ledger", href: "/standing-ledger" },
  { label: "Downloads", href: "/downloads" },
  { label: "My Notes", href: "/notes" },
  { label: "Bookmarks", href: "/bookmarks" },
  { label: "Account", href: "/profile" },
  { label: "Billing", href: "/billing" },
  { label: "Support", href: "/support" },
];

export const adminNavigation: NavigationItem[] = [
  { label: "Members", href: "/admin/members", isAdmin: true },
  { label: "Courses", href: "/admin/courses", isAdmin: true },
  { label: "Research", href: "/admin/research", isAdmin: true },
  { label: "Publications", href: "/admin/publications", isAdmin: true },
  { label: "Analytics", href: "/admin/analytics", isAdmin: true },
  { label: "Settings", href: "/admin/settings", isAdmin: true },
];
