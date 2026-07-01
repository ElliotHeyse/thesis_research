import Link from "next/link";
import { saveDonorAction } from "@/lib/actions/donor.actions";
import type { Donor } from "@/lib/types";

export function DonorForm({ donor }: { donor?: Donor }) {
  return (
    <form className="c-form" action={saveDonorAction}>
      {donor ? <input type="hidden" name="DonorID" value={donor.DonorID} /> : null}
      <div className="c-form__field">
        <label htmlFor="BusinessName">Business Name</label>
        <input
          type="text"
          id="BusinessName"
          name="BusinessName"
          maxLength={75}
          defaultValue={donor?.BusinessName ?? ""}
        />
      </div>
      <div className="c-form__field">
        <label htmlFor="ContactName">Contact Name</label>
        <input
          type="text"
          id="ContactName"
          name="ContactName"
          maxLength={75}
          required
          defaultValue={donor?.ContactName ?? ""}
        />
      </div>
      <div className="c-form__field">
        <label htmlFor="ContactEmail">Email</label>
        <input
          type="text"
          id="ContactEmail"
          name="ContactEmail"
          maxLength={200}
          defaultValue={donor?.ContactEmail ?? ""}
        />
      </div>
      <div className="c-form__field">
        <label htmlFor="ContactTitle">Contact Title</label>
        <input
          type="text"
          id="ContactTitle"
          name="ContactTitle"
          maxLength={75}
          defaultValue={donor?.ContactTitle ?? ""}
        />
      </div>
      <div className="c-form__field">
        <label htmlFor="Address">Address</label>
        <input
          type="text"
          id="Address"
          name="Address"
          maxLength={75}
          defaultValue={donor?.Address ?? ""}
        />
      </div>
      <div className="c-form__field">
        <label htmlFor="City">City</label>
        <input
          type="text"
          id="City"
          name="City"
          maxLength={30}
          defaultValue={donor?.City ?? ""}
        />
      </div>
      <div className="c-form__field">
        <label htmlFor="State">State</label>
        <input
          type="text"
          id="State"
          name="State"
          maxLength={2}
          defaultValue={donor?.State ?? ""}
        />
      </div>
      <div className="c-form__field">
        <label htmlFor="ZipCode">Zip Code</label>
        <input
          type="text"
          id="ZipCode"
          name="ZipCode"
          maxLength={5}
          defaultValue={donor?.ZipCode ?? ""}
        />
      </div>
      {donor ? (
        <div className="c-form__field u-flex-row">
          <input
            type="checkbox"
            id="TaxReceipt"
            name="TaxReceipt"
            defaultChecked={Boolean(donor.TaxReceipt)}
          />
          <label htmlFor="TaxReceipt">Tax Receipt Sent</label>
        </div>
      ) : null}
      <div className="o-flex u-gap-space-200" style={{ marginTop: "var(--space-300)" }}>
        <button type="submit" className="btn btn-success">
          {donor ? "Update Donor" : "Add Donor"}
        </button>
        <Link href="/donors" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
