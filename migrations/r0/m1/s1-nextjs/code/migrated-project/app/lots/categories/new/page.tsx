import { CategoryForm } from "@/components/lots/LotForms";
import { LotsSubnav } from "@/components/layout/Subnav";

export default function NewCategoryPage() {
  return (
    <>
      <LotsSubnav activeKey="categories" />
      <CategoryForm initialDescription="" />
    </>
  );
}
