import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";
import { deleteDonorAction } from "@/lib/actions/donor.actions";
import * as donorService from "@/lib/services/donor.service";

export default async function DeleteDonorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const donorId = Number(id);
  const donor = await donorService.getDonor(donorId);
  if (!donor) notFound();

  return (
    <AppShell activeSection="donors">
      <DonorsSubnav active="donors" />
      <ConfirmDelete
        entityType="donor"
        entity={donor as unknown as Record<string, unknown>}
        cancelHref="/donors"
        deleteAction={deleteDonorAction.bind(null, donorId)}
      />
    </AppShell>
  );
}
