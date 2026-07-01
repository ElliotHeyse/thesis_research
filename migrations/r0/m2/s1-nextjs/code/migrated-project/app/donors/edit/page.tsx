import { redirect } from "next/navigation";
import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import {
  FormActions,
  FormField,
} from "@/components/ui/FormField";
import { getDonor } from "@/lib/db/donors";
import { saveDonorAction } from "../actions";

export default async function EditDonorPage({
  searchParams,
}: {
  searchParams: Promise<{ DonorID?: string }>;
}) {
  const params = await searchParams;
  const donorId = params.DonorID ? Number(params.DonorID) : null;

  let defaults = {
    businessName: "",
    contactName: "",
    contactEmail: "",
    contactTitle: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    taxReceipt: false,
  };

  if (donorId) {
    const donor = await getDonor(donorId);
    if (!donor) {
      redirect("/donors?error=notfound");
    }
    defaults = {
      businessName: donor.BusinessName ?? "",
      contactName: donor.ContactName,
      contactEmail: donor.ContactEmail,
      contactTitle: donor.ContactTitle ?? "",
      address: donor.Address,
      city: donor.City,
      state: donor.State,
      zipCode: donor.ZipCode,
      taxReceipt: Boolean(donor.TaxReceipt),
    };
  }

  return (
    <>
      <DonorsSubnav pathname="/donors/edit" />
      <form className="c-form" action={saveDonorAction}>
        {donorId && (
          <input type="hidden" name="DonorID" value={donorId} />
        )}
        <FormField
          label="Business Name"
          name="BusinessName"
          defaultValue={defaults.businessName}
          maxLength={75}
        />
        <FormField
          label="Contact Name"
          name="ContactName"
          defaultValue={defaults.contactName}
          maxLength={75}
          required
        />
        <FormField
          label="Email"
          name="ContactEmail"
          type="email"
          defaultValue={defaults.contactEmail}
          maxLength={200}
        />
        <FormField
          label="Contact Title"
          name="ContactTitle"
          defaultValue={defaults.contactTitle}
          maxLength={75}
        />
        <FormField
          label="Address"
          name="Address"
          defaultValue={defaults.address}
          maxLength={75}
        />
        <FormField
          label="City"
          name="City"
          defaultValue={defaults.city}
          maxLength={30}
        />
        <FormField
          label="State"
          name="State"
          defaultValue={defaults.state}
          maxLength={2}
        />
        <FormField
          label="Zip Code"
          name="ZipCode"
          defaultValue={defaults.zipCode}
          maxLength={5}
        />
        {donorId && (
          <FormField
            label="Tax Receipt Sent"
            name="TaxReceipt"
            type="checkbox"
            checked={defaults.taxReceipt}
          />
        )}
        <FormActions
          submitLabel={donorId ? "Update Donor" : "Add Donor"}
          cancelHref="/donors"
        />
      </form>
    </>
  );
}
