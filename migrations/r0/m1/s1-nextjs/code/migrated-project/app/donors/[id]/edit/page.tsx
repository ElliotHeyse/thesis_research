import { notFound } from "next/navigation";
import { getDonor } from "@/lib/repositories/donors";
import { DonorForm } from "@/components/donors/DonorForm";
import { DonorsSubnav } from "@/components/layout/Subnav";

export default async function EditDonorPage({
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
      <DonorForm
        donorId={donorId}
        initialValues={{
          businessName: donor.BusinessName ?? "",
          contactName: donor.ContactName ?? "",
          contactEmail: donor.ContactEmail ?? "",
          contactTitle: donor.ContactTitle ?? "",
          address: donor.Address ?? "",
          city: donor.City ?? "",
          state: donor.State ?? "",
          zipCode: donor.ZipCode ?? "",
          taxReceipt: Boolean(donor.TaxReceipt),
        }}
      />
    </>
  );
}
