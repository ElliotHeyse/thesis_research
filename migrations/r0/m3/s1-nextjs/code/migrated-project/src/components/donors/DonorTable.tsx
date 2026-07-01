import Link from "next/link";
import type { Donor, DonorPendingReceipt } from "@/lib/types";
import { formatCurrency, formatOrDash, formatYesNo } from "@/lib/utils/format";

export function DonorTable({
  donors,
  showReceiptColumns = false,
}: {
  donors: (Donor | DonorPendingReceipt)[];
  showReceiptColumns?: boolean;
}) {
  if (donors.length === 0) {
    return <p className="c-empty-state">No donors found</p>;
  }

  return (
    <table className="template-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Business Name</th>
          <th>Contact Name</th>
          <th>Email</th>
          <th>City</th>
          <th>State</th>
          {!showReceiptColumns ? <th>Tax Receipt</th> : null}
          {showReceiptColumns ? (
            <>
              <th>Total Items</th>
              <th>Total Value</th>
            </>
          ) : null}
          {!showReceiptColumns ? <th>Actions</th> : null}
        </tr>
      </thead>
      <tbody>
        {donors.map((donor) => (
          <tr key={donor.DonorID}>
            <td>{donor.DonorID}</td>
            <td>{formatOrDash(donor.BusinessName)}</td>
            <td>{formatOrDash(donor.ContactName)}</td>
            <td>{formatOrDash(donor.ContactEmail)}</td>
            <td>{formatOrDash(donor.City)}</td>
            <td>{formatOrDash(donor.State)}</td>
            {!showReceiptColumns ? (
              <td>{formatYesNo(donor.TaxReceipt)}</td>
            ) : null}
            {showReceiptColumns && "TotalItems" in donor ? (
              <>
                <td>{donor.TotalItems}</td>
                <td>{formatCurrency(donor.TotalValue)}</td>
              </>
            ) : null}
            {!showReceiptColumns ? (
              <td>
                <Link href={`/donors/${donor.DonorID}/edit`} className="btn-edit">
                  Edit
                </Link>{" "}
                <Link href={`/donors/${donor.DonorID}/delete`} className="btn-delete">
                  Delete
                </Link>
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
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
    return <p className="c-empty-state">No donors found</p>;
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
            <tr key={donor.DonorID}>
              <td>
                <input type="checkbox" name="donorIds" value={donor.DonorID} />
              </td>
              <td>{donor.DonorID}</td>
              <td>{formatOrDash(donor.BusinessName)}</td>
              <td>{formatOrDash(donor.ContactName)}</td>
              <td>{formatOrDash(donor.ContactEmail)}</td>
              <td>{formatOrDash(donor.City)}</td>
              <td>{formatOrDash(donor.State)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 20 }}>
        <button type="submit" className="btn btn-success">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
