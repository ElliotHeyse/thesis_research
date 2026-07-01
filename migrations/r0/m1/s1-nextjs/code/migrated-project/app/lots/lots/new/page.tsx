import { getCategories } from "@/lib/repositories/categories";
import { getBidders } from "@/lib/repositories/lots";
import { LotForm } from "@/components/lots/LotForms";
import { LotsSubnav } from "@/components/layout/Subnav";

export default async function NewLotPage() {
  const [categories, bidders] = await Promise.all([
    getCategories(),
    getBidders(),
  ]);

  return (
    <>
      <LotsSubnav activeKey="lots" />
      <LotForm
        initialValues={{
          description: "",
          categoryId: "",
          highestBid: "",
          bidderId: "",
          delivered: false,
          image: "",
        }}
        categories={categories}
        bidders={bidders}
      />
    </>
  );
}
