import { getDonorsForSelect } from "@/lib/repositories/donors";
import { getLotDescriptions } from "@/lib/repositories/lots";
import { ItemForm } from "@/components/lots/LotForms";
import { LotsSubnav } from "@/components/layout/Subnav";

export default async function NewItemPage() {
  const [donors, lots] = await Promise.all([
    getDonorsForSelect(),
    getLotDescriptions(),
  ]);

  return (
    <>
      <LotsSubnav activeKey="items" />
      <ItemForm
        initialValues={{
          description: "",
          retailValue: "",
          donorID: "",
          lotID: "NULL",
        }}
        donors={donors}
        lots={lots}
      />
    </>
  );
}
