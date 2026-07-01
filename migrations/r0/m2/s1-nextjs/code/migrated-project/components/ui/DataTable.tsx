interface DataTableProps {
  head: React.ReactNode;
  children?: React.ReactNode;
  empty?: boolean;
  emptyMessage?: string;
}

export function DataTable({
  head,
  children,
  empty,
  emptyMessage = "No records found",
}: DataTableProps) {
  if (empty) {
    return <div className="alert alert-info c-empty-state">{emptyMessage}</div>;
  }

  return (
    <table className="template-table">
      <thead>{head}</thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function EmptyState({
  message,
  variant = "info",
}: {
  message: string;
  variant?: "info" | "success" | "danger";
}) {
  const className =
    variant === "success"
      ? "alert alert-success"
      : variant === "danger"
        ? "alert alert-danger"
        : "alert alert-info";
  return <div className={`${className} c-empty-state`}>{message}</div>;
}

export function PageIntro({ text }: { text: string }) {
  return <p className="c-page-intro">{text}</p>;
}
