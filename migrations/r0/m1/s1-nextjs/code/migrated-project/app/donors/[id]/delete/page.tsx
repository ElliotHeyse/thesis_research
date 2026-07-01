import { notFound } from "next/navigation";
import { getDonor } from "@/lib/repositories/donors";
import { confirmDeleteDonorAction } from "@/lib/actions/donors";
import { DonorsSubnav } from "@/components/layout/Subnav";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";

export default async function DeleteDonorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const donorId = Number(id);
  const donor = await getDonor(donorId);

  if (!donor) {
    notFound();
  }

  return (
    <>
      <DonorsSubnav activeKey="donors" />
      <ConfirmDelete
        entityType="donor"
        entity={donor as unknown as Record<string, unknown>}
        returnUrl="/donors"
        confirmAction={confirmDeleteDonorAction.bind(null, donorId)}
      />
    </>
  );
}
