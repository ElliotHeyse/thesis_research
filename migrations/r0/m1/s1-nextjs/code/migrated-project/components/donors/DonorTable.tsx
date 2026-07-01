import { formatCurrency, formatOrDash, formatYesNo } from "@/lib/format";
import type { Donor, DonorWithReceiptStats } from "@/lib/types";
import { ActionLinks } from "@/components/ui/Button";
import { DataTable, EmptyState } from "@/components/ui/Table";

function donorCells(
  donor: Donor | DonorWithReceiptStats,
  mode: "default" | "select" | "receipt",
) {
  return (
    <>
      {mode === "select" && (
        <td>
          <input type="checkbox" name="donorIds" value={donor.DonorID} />
        </td>
      )}
      <td>{donor.DonorID}</td>
      <td>{formatOrDash(donor.BusinessName)}</td>
      <td>{formatOrDash(donor.ContactName)}</td>
      <td>{formatOrDash(donor.ContactEmail)}</td>
      <td>{formatOrDash(donor.City)}</td>
      <td>{formatOrDash(donor.State)}</td>
      {mode !== "select" && <td>{formatYesNo(donor.TaxReceipt)}</td>}
      {mode === "receipt" && (
        <>
          <td>{(donor as DonorWithReceiptStats).TotalItems ?? 0}</td>
          <td>{formatCurrency((donor as DonorWithReceiptStats).TotalValue ?? 0)}</td>
        </>
      )}
    </>
  );
}

export function DonorTable({
  donors,
  showReceiptColumns = false,
}: {
  donors: Donor[] | DonorWithReceiptStats[];
  showReceiptColumns?: boolean;
}) {
  const mode = showReceiptColumns ? "receipt" : "default";
  const isEmpty = donors.length === 0;

  return (
    <DataTable
      isEmpty={isEmpty}
      emptyMessage="No donors found"
      head={
        <tr>
          <th>ID</th>
          <th>Business Name</th>
          <th>Contact Name</th>
          <th>Email</th>
          <th>City</th>
          <th>State</th>
          <th>Tax Receipt</th>
          {showReceiptColumns && (
            <>
              <th>Total Items</th>
              <th>Total Value</th>
            </>
          )}
          <th>Actions</th>
        </tr>
      }
    >
      {donors.map((donor) => (
        <tr key={donor.DonorID}>
          {donorCells(donor, mode)}
          <td>
            <ActionLinks
              links={{
                Edit: `/donors/${donor.DonorID}/edit`,
                Delete: `/donors/${donor.DonorID}/delete`,
              }}
            />
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

export function DonorSelectTable({
  donors,
  formAction,
  submitLabel,
}: {
  donors: Donor[];
  formAction: string;
  submitLabel: string;
}) {
  if (donors.length === 0) {
    return <EmptyState message="No donors found" />;
  }

  return (
    <form action={formAction} method="post">
      <table className="template-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Business Name</th>
            <th>Contact Name</th>
            <th>Email</th>
            <th>City</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((donor) => (
            <tr key={donor.DonorID}>{donorCells(donor, "select")}</tr>
          ))}
        </tbody>
      </table>
      <div className="form-actions" style={{ marginTop: 20 }}>
        <button type="submit" className="btn btn-success">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
