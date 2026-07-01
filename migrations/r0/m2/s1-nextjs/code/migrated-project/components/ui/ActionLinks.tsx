import Link from "next/link";

interface ActionLinksProps {
  links: Record<string, string>;
}

export function ActionLinks({ links }: ActionLinksProps) {
  return (
    <>
      {Object.entries(links).map(([label, href]) => (
        <Link
          key={label}
          href={href}
          className={label === "Delete" ? "btn-delete" : "btn-edit"}
        >
          {label}
        </Link>
      ))}
    </>
  );
}
