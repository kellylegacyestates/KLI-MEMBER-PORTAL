export type CurriculumModule = {
  title: string;
  description: string;
  progress: string;
  lessonCards: string[];
  readingAssignments: string[];
  downloads: string[];
  videoPlaceholder: string;
  notes: string[];
};

export type ResearchItem = {
  title: string;
  author: string;
  published: string;
  category: string;
  abstract: string;
  downloadLabel: string;
};

export type PublicationEntry = {
  title: string;
  type: string;
  summary: string;
  issued: string;
};

export type BriefingEntry = {
  title: string;
  date: string;
  summary: string;
};

export type SearchIndexItem = {
  title: string;
  type: "Lesson" | "Research" | "Publication" | "Briefing" | "Download";
  category: string;
  summary: string;
  href: string;
};

export const dashboardWidgets = {
  welcome: "Welcome back, Member",
  currentCourse: {
    title: "Current Course",
    body: "Fiduciary Foundations — Module 7: Trust Administration",
    meta: "In progress",
  },
  learningProgress: {
    title: "Learning Progress",
    body: "72% completion across the active curriculum pathway.",
    meta: "On pace",
  },
  recentPublications: {
    title: "Recently Added Publications",
    body: "Annual Governance Review · Administrative Record Practice Note · Fiduciary Oversight Bulletin",
    meta: "Updated today",
  },
  weeklyBriefing: {
    title: "Weekly Fiduciary Briefing",
    body: "Institutional guidance on governance, oversight, and the practical management of public records.",
    meta: "New",
  },
  continueLearning: {
    title: "Continue Learning",
    body: "Advance into Module 8 and prepare annotations for the next seminar session.",
    meta: "Recommended",
  },
  savedResources: {
    title: "Saved Resources",
    body: "Trust Administration Checklist · Public Records Request Protocol · Governance Committee Brief",
    meta: "Pinned",
  },
  researchActivity: {
    title: "Research Activity",
    body: "12 notes, 9 sources, and 4 briefings captured this month in your workspace.",
    meta: "This month",
  },
  standingLedger: {
    title: "Standing Ledger",
    body: "Review institutional obligations, record stewardship status, and upcoming review milestones.",
    meta: "Current",
  },
  workshops: {
    title: "Upcoming Live Workshops",
    body: "August 14 — Administrative Record Review · August 28 — Fiduciary Governance Seminar",
    meta: "Scheduled",
  },
  announcements: {
    title: "Institute Announcements",
    body: "Membership materials and curriculum updates have been published for the current academic cycle.",
    meta: "Issued",
  },
};

export const curriculumModules: CurriculumModule[] = [
  {
    title: "Module 1 — The Record",
    description: "Foundational principles for evidentiary integrity, record curation, and institutional memory.",
    progress: "Progress 82%",
    lessonCards: ["Record classification", "Retention and access standards", "Evidence mapping"],
    readingAssignments: ["Records Management Doctrine", "Institutional Practice Note on Preservation"],
    downloads: ["Records Checklist", "Reference Matrix"],
    videoPlaceholder: "Lecture recording: The Record as an administrative instrument",
    notes: ["Prepare a short reflection on custody and access controls"],
  },
  {
    title: "Module 2 — Parties & Capacity",
    description: "A study of participation, authority, and the role of institutional actors in formal processes.",
    progress: "Progress 69%",
    lessonCards: ["Capacity and standing", "Institutional representation", "Procedural participation"],
    readingAssignments: ["Capacity and Representation Brief", "Trustee Authority Review"],
    downloads: ["Participation Flowchart", "Authority Matrix"],
    videoPlaceholder: "Lecture recording: Position, authority, and obligation",
    notes: ["Document the distinctions between fiduciary and administrative role"],
  },
  {
    title: "Module 3 — Standing",
    description: "An analysis of authority, interest, and the conditions that support review and participation.",
    progress: "Progress 74%",
    lessonCards: ["Standing categories", "Institutional interest", "Review eligibility"],
    readingAssignments: ["Standing and Participation Primer", "Administrative Review Guide"],
    downloads: ["Standing Checklist", "Decision Tree"],
    videoPlaceholder: "Lecture recording: Eligibility and procedural posture",
    notes: ["Create a reference table for the standing framework"],
  },
  {
    title: "Module 4 — Jurisdiction",
    description: "A practical exploration of venue, authority, and review pathways in institutional settings.",
    progress: "Progress 61%",
    lessonCards: ["Territorial scope", "Review pathways", "Conflicts and forum selection"],
    readingAssignments: ["Jurisdiction and Venue Notes", "Administrative Forum Review"],
    downloads: ["Jurisdiction Map", "Forum Selection Guide"],
    videoPlaceholder: "Lecture recording: Mapping authority and venue",
    notes: ["Track the distinctions between subject matter and personal authority"],
  },
  {
    title: "Module 5 — Evidence",
    description: "Structured work on proof, burden, and the management of decision records.",
    progress: "Progress 78%",
    lessonCards: ["Evidence sequencing", "Burden of proof", "Document authentication"],
    readingAssignments: ["Evidence and Burden Handbook", "Records Authentication Memo"],
    downloads: ["Evidence Checklist", "Proof Matrix"],
    videoPlaceholder: "Lecture recording: Building a disciplined evidentiary record",
    notes: ["Summarize key differences between documentary and testimonial evidence"],
  },
  {
    title: "Module 6 — Administrative Procedure",
    description: "A disciplined review of process, notice, and procedural fairness in institutional settings.",
    progress: "Progress 83%",
    lessonCards: ["Notice and hearing", "Decision-making steps", "Remedies and review"],
    readingAssignments: ["Administrative Procedure Manual", "Fairness and Notice Review"],
    downloads: ["Process Timeline", "Remedy Summary"],
    videoPlaceholder: "Lecture recording: Procedure as administrative stewardship",
    notes: ["Record the procedural safeguards that appear in the current case study"],
  },
  {
    title: "Module 7 — Trust Administration",
    description: "A focused study of duties, stewardship, and the ongoing management of trust-based obligations.",
    progress: "Progress 88%",
    lessonCards: ["Fiduciary duties", "Custodial controls", "Reporting obligations"],
    readingAssignments: ["Trust Administration Practice Note", "Fiduciary Duty and Oversight Guide"],
    downloads: ["Trust Dashboard", "Stewardship Checklist"],
    videoPlaceholder: "Lecture recording: Trust administration in practice",
    notes: ["Prepare observations for the next monthly review meeting"],
  },
  {
    title: "Module 8 — Building the Administrative Record",
    description: "A capstone module on curation, documentation, and the assembly of a complete record.",
    progress: "Progress 57%",
    lessonCards: ["Indexing and organization", "Narrative synthesis", "Final record review"],
    readingAssignments: ["Administrative Record Assembly Guide", "Case File Reconstruction Memo"],
    downloads: ["Record Assembly Checklist", "Final Review Template"],
    videoPlaceholder: "Lecture recording: Constructing a complete administrative record",
    notes: ["Draft a short outline for your final record brief"],
  },
];

export const researchCategories = [
  "Administrative Law",
  "Trust Administration",
  "Jurisdiction",
  "Governance",
  "Public Records",
  "Congressional Research",
  "Banking",
  "AI Governance",
  "Legal Research",
];

export const researchItems: ResearchItem[] = [
  {
    title: "Trust Administration and Record Stewardship",
    author: "Dr. Helena Marrow",
    published: "March 14, 2026",
    category: "Trust Administration",
    abstract: "A practical review of stewardship duties, preservation controls, and the institutional obligations that support reliable trust administration.",
    downloadLabel: "Download PDF",
  },
  {
    title: "Administrative Procedure and Review",
    author: "Miriam Chen",
    published: "February 21, 2026",
    category: "Administrative Law",
    abstract: "A disciplined summary of procedure, notice, and review considerations relevant to institutional governance.",
    downloadLabel: "Download PDF",
  },
  {
    title: "State Public Records and Access Practice",
    author: "Samuel Ortega",
    published: "January 9, 2026",
    category: "Public Records",
    abstract: "An institutional guide to public records access, retention obligations, and responsive review practice.",
    downloadLabel: "Download PDF",
  },
  {
    title: "Governance Committee Handbook",
    author: "Lena Patel",
    published: "December 3, 2025",
    category: "Governance",
    abstract: "A reference handbook for committees managing fiduciary oversight, review routines, and executive accountability.",
    downloadLabel: "Download PDF",
  },
  {
    title: "Banking and Custodial Oversight",
    author: "Daniel Rowe",
    published: "November 11, 2025",
    category: "Banking",
    abstract: "An overview of prudent oversight, fiduciary controls, and institutional coordination with financial service partners.",
    downloadLabel: "Download PDF",
  },
  {
    title: "Congressional Research on Administrative Modernization",
    author: "Evelyn Brooks",
    published: "October 28, 2025",
    category: "Congressional Research",
    abstract: "A concise review of legislative developments and procedural reform trends affecting institutional administration.",
    downloadLabel: "Download PDF",
  },
  {
    title: "AI Governance and Decision Records",
    author: "Noah Bennett",
    published: "September 16, 2025",
    category: "AI Governance",
    abstract: "A scholarly overview of governance controls, traceability, and accountable use of emerging technologies in formal settings.",
    downloadLabel: "Download PDF",
  },
  {
    title: "Legal Research Methods for Institutional Practice",
    author: "Carla Leon",
    published: "August 5, 2025",
    category: "Legal Research",
    abstract: "A practical guide to legal research strategy, source evaluation, and the use of archival materials in professional practice.",
    downloadLabel: "Download PDF",
  },
];

export const publicationEntries: PublicationEntry[] = [
  { title: "White Paper: Fiduciary Stewardship in Practice", type: "White Paper", summary: "A formal analysis of stewardship obligations, oversight structures, and institutional accountability.", issued: "May 2026" },
  { title: "Research Brief: Administrative Record Standards", type: "Research Brief", summary: "A concise brief summarizing current practice standards for assembling and maintaining records.", issued: "April 2026" },
  { title: "Institute Memorandum: Review and Access Protocols", type: "Institute Memorandum", summary: "Operational guidance on access control, review queues, and secure circulation of sensitive materials.", issued: "March 2026" },
  { title: "Administrative Guide: Evidence Review Workflow", type: "Administrative Guide", summary: "A structured reference for documenting evidence, review steps, and decision preparation.", issued: "February 2026" },
  { title: "Case Study: Trust Administration and Oversight", type: "Case Study", summary: "A practical case study demonstrating record discipline, oversight, and fiduciary coordination.", issued: "January 2026" },
  { title: "Educational Bulletin: Member Learning Cycle", type: "Educational Bulletin", summary: "A bulletin covering the learning cycle, milestone planning, and member engagement initiatives.", issued: "December 2025" },
];

export const briefingEntries: BriefingEntry[] = [
  { title: "Weekly Fiduciary Briefing", date: "July 18, 2026", summary: "A concise review of governance concerns, administrative record practice, and prudent oversight priorities." },
  { title: "Administrative Procedure Review", date: "July 11, 2026", summary: "Practical guidance for members preparing for the next seminar and case review cycle." },
  { title: "Member Communications Notice", date: "July 4, 2026", summary: "Institutional updates on curriculum pacing, publication releases, and service availability." },
];

export const downloadEntries = [
  { title: "Member Handbook", description: "An institutional guide to portal access, learning pathways, and service expectations.", size: "2.1 MB", type: "PDF" },
  { title: "Research Index", description: "A structured catalog of current research materials, categories, and archive access points.", size: "1.4 MB", type: "Index" },
  { title: "Curriculum Outline", description: "A concise outline of module sequencing, readings, and milestone planning.", size: "780 KB", type: "PDF" },
];

export const notesEntries = [
  { title: "Administrative Procedure", description: "Prepare evidence summaries and note the procedural elements that warrant follow-up.", meta: "Draft" },
  { title: "Research Reading", description: "Capture questions for the next seminar and track points of comparison across sources.", meta: "Saved" },
  { title: "Member Briefing", description: "Record key action items and institutional observations for the next weekly briefing.", meta: "Pinned" },
];

export const bookmarkEntries = [
  { title: "Research Index", description: "A curated list of institutional materials aligned to current research priorities.", meta: "Pinned" },
  { title: "Trust Administration Guide", description: "A retained reference to duties, oversight notes, and procedural best practices.", meta: "Saved" },
  { title: "Curriculum Module", description: "A saved pathway to the next module recommended for continued study.", meta: "Pinned" },
];

export const accountSections = [
  { title: "Profile", description: "Institutional profile information for member communications and service delivery." },
  { title: "Membership Status", description: "Active Fellow Member with full access to curriculum, briefings, and research materials." },
  { title: "Billing", description: "Annual membership renewal and invoice history retained for review in the portal." },
  { title: "Password", description: "Security settings and account recovery guidance are maintained through institutional support." },
  { title: "Notifications", description: "Weekly briefings, curriculum alerts, and publication updates are enabled by default." },
  { title: "Privacy", description: "Access to personal information and communication preferences is managed under institutional policy." },
  { title: "Downloads", description: "Member materials and reference documents remain available for repeated access." },
];

export const adminPanels = [
  { title: "Members", description: "Member records and institutional access status." },
  { title: "Courses", description: "Curriculum modules and milestone tracking." },
  { title: "Research Library", description: "Published materials and collection management." },
  { title: "Publications", description: "White papers, memoranda, and bulletin releases." },
  { title: "Announcements", description: "Operational communications and member notices." },
  { title: "Analytics", description: "Member engagement and resource utilization." },
  { title: "Billing Overview", description: "Invoice review, renewal activity, and account status." },
  { title: "Dashboard Statistics", description: "Current performance indicators for the portal." },
];

export const searchIndex: SearchIndexItem[] = [
  { title: "Module 7 — Trust Administration", type: "Lesson", category: "Curriculum", summary: "Focused study of duties, stewardship, and the management of trust-based obligations.", href: "/curriculum" },
  { title: "Trust Administration and Record Stewardship", type: "Research", category: "Trust Administration", summary: "Reference material covering stewardship duties and preservation controls.", href: "/research-library" },
  { title: "White Paper: Fiduciary Stewardship in Practice", type: "Publication", category: "White Paper", summary: "A formal analysis of stewardship obligations and institutional accountability.", href: "/publications" },
  { title: "Weekly Fiduciary Briefing", type: "Briefing", category: "Weekly Briefings", summary: "A concise review of governance concerns and administrative record practice.", href: "/briefings" },
  { title: "Member Handbook", type: "Download", category: "Downloads", summary: "Institutional guide for portal access, learning pathways, and service expectations.", href: "/downloads" },
];
