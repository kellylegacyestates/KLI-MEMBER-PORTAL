import type { Metadata } from "next";
import Link from "next/link";
import { AdminRouteGuard } from "@/components/auth/ServerRouteGuards";
import { PortalShell } from "@/components/layout/PortalShell";
import { DataTable } from "@/components/ui/DataTable";
import { ErrorState } from "@/components/ui/ErrorState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAllPublicationsForAdmin } from "@/lib/publications";

export const metadata: Metadata = {
  title: "Publication Manager",
  description: "Manage the authoritative Kelly Legacy Institute publication record.",
};

async function PublicationRecords() {
  let publications;
  try {
    publications = await getAllPublicationsForAdmin();
  } catch {
    return (
      <ErrorState
        title="Publication records unavailable"
        description="The registry could not be loaded. No publication metadata was changed."
      />
    );
  }

  const rows = publications.map((publication) => ({
    id: <span className="font-mono text-xs">{publication.id}</span>,
    title: (
      <Link
        href={`/admin/publications/${publication.id}`}
        className="font-semibold text-[#001f3f] underline decoration-[#d4af37] underline-offset-4"
      >
        {publication.title}
      </Link>
    ),
    status: <StatusBadge label={publication.status} tone="gold" />,
    version: publication.currentVersion,
    visibility: publication.visibility,
  }));

  return (
    <DataTable
      title="Canonical publication records"
      columns={[
        { key: "id", header: "Publication ID" },
        { key: "title", header: "Title" },
        { key: "status", header: "Status" },
        { key: "version", header: "Version" },
        { key: "visibility", header: "Visibility" },
      ]}
      rows={rows}
    />
  );
}

export default function AdminPublicationsPage() {
  return (
    <AdminRouteGuard pathname="/admin/publications">
      <PortalShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Administration"
            title="Publication registry"
            description="Inspect canonical records, control publication and distribution states, and preserve version history."
          />
          <PublicationRecords />
        </div>
      </PortalShell>
    </AdminRouteGuard>
  );
}
