import {
  formatCurrency,
  formatOrDash,
  formatYesNo,
} from "@/lib/format";
import type { Donor, DonorWithReceiptStats } from "@/lib/db/types";
import { ActionLinks } from "./ActionLinks";
import { DataTable } from "./DataTable";

interface DonorsTableProps {
  donors: Donor[] | DonorWithReceiptStats[];
  showReceiptColumns?: boolean;
}

export function DonorsTable({
  donors,
  showReceiptColumns = false,
}: DonorsTableProps) {
  return (
    <DataTable
      empty={donors.length === 0}
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
          <td>{donor.DonorID}</td>
          <td>{formatOrDash(donor.BusinessName)}</td>
          <td>{formatOrDash(donor.ContactName)}</td>
          <td>{formatOrDash(donor.ContactEmail)}</td>
          <td>{formatOrDash(donor.City)}</td>
          <td>{formatOrDash(donor.State)}</td>
          <td>{formatYesNo(donor.TaxReceipt)}</td>
          {showReceiptColumns && "TotalItems" in donor && (
            <>
              <td>{donor.TotalItems}</td>
              <td>{formatCurrency(donor.TotalValue)}</td>
            </>
          )}
          <td>
            <ActionLinks
              links={{
                Edit: `/donors/edit?DonorID=${donor.DonorID}`,
                Delete: `/donors/delete?DonorID=${donor.DonorID}`,
              }}
            />
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

interface DonorCheckboxTableProps {
  donors: Donor[];
  formAction: string;
  submitLabel: string;
}

export function DonorCheckboxTable({
  donors,
  formAction,
  submitLabel,
}: DonorCheckboxTableProps) {
  if (donors.length === 0) {
    return <DataTable empty emptyMessage="No donors found" head={<tr />} />;
  }

  return (
    <form action={formAction} method="post">
      <DataTable
        head={
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Business Name</th>
            <th>Contact Name</th>
            <th>Email</th>
            <th>City</th>
            <th>State</th>
          </tr>
        }
      >
        {donors.map((donor) => (
          <tr key={donor.DonorID}>
            <td>
              <input
                type="checkbox"
                name="donorIds"
                value={donor.DonorID}
              />
            </td>
            <td>{donor.DonorID}</td>
            <td>{formatOrDash(donor.BusinessName)}</td>
            <td>{formatOrDash(donor.ContactName)}</td>
            <td>{formatOrDash(donor.ContactEmail)}</td>
            <td>{formatOrDash(donor.City)}</td>
            <td>{formatOrDash(donor.State)}</td>
          </tr>
        ))}
      </DataTable>
      <button type="submit" className="btn btn-success">
        {submitLabel}
      </button>
    </form>
  );
}
