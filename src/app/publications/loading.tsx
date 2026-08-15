import { PublicLayout } from "@/components/layout/PublicLayout";
import { LoadingState } from "@/components/ui/LoadingState";

export default function PublicationsLoading() {
  return (
    <PublicLayout>
      <LoadingState label="Retrieving the publication registry…" />
    </PublicLayout>
  );
}
