import { AppShell } from "@/components/layout/AppShell";
import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { DonorForm } from "@/components/donors/DonorForm";
import { FlashAlert } from "@/components/ui/FlashAlert";

export default async function NewDonorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <AppShell activeSection="donors">
      <DonorsSubnav active="donors" />
      <FlashAlert error={sp.error} />
      <h2 style={{ color: "var(--gray-900)", marginBottom: "var(--space-200)" }}>
        Add Donor
      </h2>
      <DonorForm />
    </AppShell>
  );
}
