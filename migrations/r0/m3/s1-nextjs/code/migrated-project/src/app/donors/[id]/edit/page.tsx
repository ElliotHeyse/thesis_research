import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { DonorForm } from "@/components/donors/DonorForm";
import { FlashAlert } from "@/components/ui/FlashAlert";
import * as donorService from "@/lib/services/donor.service";

export default async function EditDonorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const donor = await donorService.getDonor(Number(id));
  if (!donor) notFound();

  return (
    <AppShell activeSection="donors">
      <DonorsSubnav active="donors" />
      <FlashAlert error={sp.error} />
      <h2 style={{ color: "var(--gray-900)", marginBottom: "var(--space-200)" }}>
        Edit Donor
      </h2>
      <DonorForm donor={donor} />
    </AppShell>
  );
}
