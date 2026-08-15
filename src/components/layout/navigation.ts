export type NavigationItem = {
  label: string;
  href: string;
  isAdmin?: boolean;
  isExecutive?: boolean;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Research Library", href: "/research-library" },
  { label: "Publications", href: "/publications" },
  { label: "Weekly Briefings", href: "/briefings" },
  { label: "Courses", href: "/courses" },
  { label: "Library", href: "/library" },
  { label: "Standing Ledger", href: "/standing-ledger" },
  { label: "Downloads", href: "/downloads" },
  { label: "My Notes", href: "/notes" },
  { label: "Bookmarks", href: "/bookmarks" },
  { label: "Account", href: "/account" },
  { label: "Support", href: "/support" },
];

export const executiveNavigation: NavigationItem[] = [
  { label: "Executive Overview", href: "/executive", isExecutive: true },
  { label: "Execution Framework", href: "/executive/execution-framework", isExecutive: true },
  { label: "Institutional Governance", href: "/executive/institutional-governance", isExecutive: true },
];

export const adminNavigation: NavigationItem[] = [
  { label: "Members", href: "/admin/members", isAdmin: true },
  { label: "Content", href: "/admin/content", isAdmin: true },
  { label: "Access", href: "/admin/access", isAdmin: true },
  { label: "Audit", href: "/admin/audit", isAdmin: true },
  { label: "Analytics", href: "/admin/analytics", isAdmin: true },
  { label: "Settings", href: "/admin/settings", isAdmin: true },
];
