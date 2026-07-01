import Link from "next/link";

type ButtonVariant = "success" | "danger" | "secondary" | "primary";

const variantClass: Record<ButtonVariant, string> = {
  success: "btn-success",
  danger: "btn-danger",
  secondary: "btn-secondary",
  primary: "btn-edit",
};

export function LinkButton({
  href,
  children,
  variant = "primary",
  target,
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  target?: string;
}) {
  return (
    <Link href={href} className={`btn ${variantClass[variant]}`} target={target}>
      {children}
    </Link>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
  form,
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  form?: string;
}) {
  return (
    <button type="submit" className={`btn ${variantClass[variant]}`} form={form}>
      {children}
    </button>
  );
}

export function ActionLinks({
  links,
}: {
  links: Record<string, string>;
}) {
  return (
    <>
      {Object.entries(links).map(([label, href]) => (
        <span key={label}>
          {label === "Delete" ? (
            <Link href={href} className="btn-delete">
              {label}
            </Link>
          ) : (
            <Link href={href} className="btn-edit">
              {label}
            </Link>
          )}{" "}
        </span>
      ))}
    </>
  );
}
