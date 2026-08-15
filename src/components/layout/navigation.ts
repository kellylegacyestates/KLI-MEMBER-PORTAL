export type NavigationItem = {
  label: string;
  href: string;
  exact?: boolean;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

export const primaryNavigation: NavigationGroup[] = [
  {
    label: "Home",
    items: [{ label: "Dashboard", href: "/dashboard", exact: true }],
  },
  {
    label: "Learn",
    items: [
      { label: "Curriculum", href: "/curriculum" },
      { label: "Courses", href: "/courses" },
    ],
  },
  {
    label: "Research",
    items: [
      { label: "Research Library", href: "/research-library" },
      { label: "Weekly Briefings", href: "/briefings" },
      { label: "Bookmarks", href: "/bookmarks" },
      { label: "Notes", href: "/notes" },
    ],
  },
  {
    label: "Publications",
    items: [{ label: "Publication Registry", href: "/publications" }],
  },
  {
    label: "Records",
    items: [
      { label: "Certificates", href: "/certificates" },
      { label: "Tasks & Obligations", href: "/standing-ledger" },
      { label: "Document Downloads", href: "/downloads" },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/profile" },
      { label: "Membership & Billing", href: "/billing" },
      { label: "Support", href: "/support" },
    ],
  },
];

export const executiveNavigation: NavigationItem[] = [
  { label: "Executive Overview", href: "/executive", exact: true },
  { label: "Execution Framework", href: "/executive/execution-framework" },
  { label: "Governance & Oversight", href: "/executive/institutional-governance" },
];

export const adminNavigation: NavigationItem[] = [
  { label: "Admin Overview", href: "/admin", exact: true },
  { label: "Members", href: "/admin/members" },
  { label: "Access Control", href: "/admin/access" },
  { label: "Content", href: "/admin/content" },
  { label: "Publications", href: "/admin/publications" },
  { label: "Curriculum", href: "/admin/curriculum" },
  { label: "Research Library", href: "/admin/library" },
  { label: "Briefings", href: "/admin/briefings" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Audit Log", href: "/admin/audit" },
  { label: "Settings", href: "/admin/settings" },
];

export function isNavigationItemActive(pathname: string, item: NavigationItem) {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

const memberJourney: NavigationItem[] = [
  { label: "Courses", href: "/courses" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Research Library", href: "/research-library" },
  { label: "Publications", href: "/publications" },
  { label: "Weekly Briefings", href: "/briefings" },
  { label: "Downloads", href: "/downloads" },
  { label: "Certificates", href: "/certificates" },
  { label: "Notes", href: "/notes" },
  { label: "Profile", href: "/profile" },
];

export type ContextualNavigation = {
  overview: NavigationItem;
  previous?: NavigationItem;
  next?: NavigationItem;
};

export function getNavigationLabel(pathname: string): string | null {
  const items = [
    ...primaryNavigation.flatMap((group) => group.items),
    ...executiveNavigation,
    ...adminNavigation,
  ];
  return items
    .filter((item) => isNavigationItemActive(pathname, item))
    .sort((left, right) => right.href.length - left.href.length)[0]?.label ?? null;
}

export function getContextualNavigation(pathname: string): ContextualNavigation | null {
  const journey = pathname.startsWith("/admin")
    ? adminNavigation
    : pathname.startsWith("/executive")
      ? executiveNavigation
      : memberJourney;
  const currentIndex = journey.findIndex((item) => item.href === pathname);

  if (currentIndex < 0) return null;

  return {
    overview: pathname.startsWith("/admin")
      ? { label: "Admin Overview", href: "/admin" }
      : pathname.startsWith("/executive")
        ? { label: "Executive Overview", href: "/executive" }
        : { label: "Dashboard", href: "/dashboard" },
    previous: journey[currentIndex - 1],
    next: journey[currentIndex + 1],
  };
}
