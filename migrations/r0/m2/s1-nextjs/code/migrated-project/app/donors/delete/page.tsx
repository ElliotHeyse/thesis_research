import Link from "next/link";
import { redirect } from "next/navigation";
import { DonorsSubnav } from "@/components/layout/DonorsSubnav";
import { formatOrDash } from "@/lib/format";
import { getDonor } from "@/lib/db/donors";
import { deleteDonorAction } from "../actions";

export default async function DeleteDonorPage({
  searchParams,
}: {
  searchParams: Promise<{ DonorID?: string; confirm?: string }>;
}) {
  const params = await searchParams;
  const donorId = params.DonorID ? Number(params.DonorID) : null;

  if (!donorId) {
    redirect("/donors?error=invalid_id");
  }

  const donor = await getDonor(donorId);
  if (!donor) {
    redirect("/donors?error=notfound");
  }

  if (params.confirm === "1") {
    await deleteDonorAction(donorId);
  }

  return (
    <>
      <DonorsSubnav pathname="/donors/delete" />
      <div className="o-flex o-flex--column u-gap-space-200">
        <h2>Confirm Deletion</h2>
        <p style={{ textAlign: "center", marginBottom: "30px" }}>
          <strong>Are you sure you want to delete this donor?</strong>
          <br />
          This action cannot be undone.
        </p>
        <div>
          <p>
            <strong>Donor ID:</strong> {donor.DonorID}
          </p>
          <p>
            <strong>Business Name:</strong>{" "}
            {formatOrDash(donor.BusinessName)}
          </p>
          <p>
            <strong>Contact Name:</strong> {donor.ContactName}
          </p>
          <p>
            <strong>Email:</strong> {formatOrDash(donor.ContactEmail)}
          </p>
          <p>
            <strong>City:</strong> {formatOrDash(donor.City)}
          </p>
        </div>
        <div className="o-flex u-gap-space-100">
          <Link
            href={`/donors/delete?DonorID=${donorId}&confirm=1`}
            className="btn btn-danger"
          >
            Yes, Delete Permanently
          </Link>
          <Link href="/donors" className="btn btn-secondary">
            No, Cancel
          </Link>
        </div>
      </div>
    </>
  );
}
