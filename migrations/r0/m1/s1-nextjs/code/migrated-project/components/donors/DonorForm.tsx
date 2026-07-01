"use client";

import { useActionState } from "react";
import { saveDonorFormAction } from "@/lib/actions/donors";
import type { DonorFormValues } from "@/lib/types";
import { LinkButton } from "@/components/ui/Button";

function FormField({
  label,
  name,
  type = "text",
  defaultValue = "",
  error,
  maxLength,
  required,
  checked,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string;
  maxLength?: number;
  required?: boolean;
  checked?: boolean;
}) {
  return (
    <div className="c-form__field">
      <label htmlFor={name}>{label}</label>
      {type === "checkbox" ? (
        <input
          type="checkbox"
          id={name}
          name={name}
          defaultChecked={checked}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          defaultValue={defaultValue}
          maxLength={maxLength}
          required={required}
        />
      )}
      {error && <span className="c-form__error">{error}</span>}
    </div>
  );
}

export function DonorForm({
  donorId,
  initialValues,
}: {
  donorId?: number;
  initialValues: DonorFormValues;
}) {
  const [state, formAction, pending] = useActionState(saveDonorFormAction, {});
  const errors = state.errors ?? {};

  return (
    <form className="c-form" action={formAction}>
      {donorId && <input type="hidden" name="donorId" value={donorId} />}
      <FormField
        label="Business Name"
        name="businessName"
        defaultValue={initialValues.businessName}
        error={errors.businessName}
        maxLength={75}
      />
      <FormField
        label="Contact Name"
        name="contactName"
        defaultValue={initialValues.contactName}
        error={errors.contactName}
        maxLength={75}
        required
      />
      <FormField
        label="Email"
        name="contactEmail"
        defaultValue={initialValues.contactEmail}
        error={errors.contactEmail}
        maxLength={200}
      />
      <FormField
        label="Contact Title"
        name="contactTitle"
        defaultValue={initialValues.contactTitle}
        error={errors.contactTitle}
        maxLength={75}
      />
      <FormField
        label="Address"
        name="address"
        defaultValue={initialValues.address}
        error={errors.address}
        maxLength={75}
      />
      <FormField
        label="City"
        name="city"
        defaultValue={initialValues.city}
        error={errors.city}
        maxLength={30}
      />
      <FormField
        label="State"
        name="state"
        defaultValue={initialValues.state}
        error={errors.state}
        maxLength={2}
      />
      <FormField
        label="Zip Code"
        name="zipCode"
        defaultValue={initialValues.zipCode}
        error={errors.zipCode}
        maxLength={5}
      />
      {donorId && (
        <FormField
          label="Tax Receipt Sent"
          name="taxReceipt"
          type="checkbox"
          checked={initialValues.taxReceipt}
        />
      )}
      <div className="o-flex u-gap-space-100">
        <button type="submit" className="btn btn-success" disabled={pending}>
          {donorId ? "Update Donor" : "Add Donor"}
        </button>
        <LinkButton href="/donors" variant="secondary">
          Cancel
        </LinkButton>
      </div>
    </form>
  );
}
