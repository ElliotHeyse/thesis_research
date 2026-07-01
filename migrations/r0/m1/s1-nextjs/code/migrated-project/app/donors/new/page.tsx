import { DonorForm } from "@/components/donors/DonorForm";
import { DonorsSubnav } from "@/components/layout/Subnav";

export default function NewDonorPage() {
  return (
    <>
      <DonorsSubnav activeKey="donors" />
      <DonorForm
        initialValues={{
          businessName: "",
          contactName: "",
          contactEmail: "",
          contactTitle: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          taxReceipt: false,
        }}
      />
    </>
  );
}
