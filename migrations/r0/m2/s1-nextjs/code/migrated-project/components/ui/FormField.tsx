import Link from "next/link";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "number" | "email" | "url" | "checkbox";
  placeholder?: string;
  defaultValue?: string | number;
  error?: string;
  required?: boolean;
  maxLength?: number;
  step?: string;
  checked?: boolean;
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder = "",
  defaultValue = "",
  error,
  required,
  maxLength,
  step,
  checked,
}: FormFieldProps) {
  if (type === "checkbox") {
    return (
      <div className="c-form__field u-flex-row">
        <label htmlFor={name}>{label}</label>
        <input type="hidden" name={name} value="off" />
        <input
          type="checkbox"
          id={name}
          name={name}
          value="on"
          defaultChecked={checked}
        />
        {error && <span className="c-form__error">{error}</span>}
      </div>
    );
  }

  return (
    <div className="c-form__field">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        maxLength={maxLength}
        step={step}
      />
      {error && <span className="c-form__error">{error}</span>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: { value: string | number; label: string }[];
  defaultValue?: string | number | null;
  error?: string;
  required?: boolean;
  allowEmpty?: boolean;
  emptyLabel?: string;
}

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  error,
  required,
  allowEmpty,
  emptyLabel = "— None —",
}: SelectFieldProps) {
  return (
    <div className="c-form__field">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? (allowEmpty ? "" : undefined)}
        required={required}
      >
        {allowEmpty && <option value="">{emptyLabel}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="c-form__error">{error}</span>}
    </div>
  );
}

interface FormActionsProps {
  submitLabel: string;
  cancelHref?: string;
}

export function FormActions({ submitLabel, cancelHref }: FormActionsProps) {
  return (
    <div className="o-flex o-flex--column u-gap-space-100">
      <button type="submit">{submitLabel}</button>
      {cancelHref && (
        <Link href={cancelHref} className="btn btn-secondary">
          Cancel
        </Link>
      )}
    </div>
  );
}
