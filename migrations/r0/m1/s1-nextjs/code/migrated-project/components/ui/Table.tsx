export function PageIntro({ children }: { children: React.ReactNode }) {
  return <p className="c-page-intro">{children}</p>;
}

export function EmptyState({
  message,
  variant = "info",
}: {
  message: string;
  variant?: "info" | "danger";
}) {
  return (
    <div className={`alert alert-${variant === "danger" ? "danger" : "info"} c-empty-state`}>
      {message}
    </div>
  );
}

export function DataTable({
  head,
  children,
  emptyMessage,
  isEmpty,
}: {
  head: React.ReactNode;
  children?: React.ReactNode;
  emptyMessage: string;
  isEmpty: boolean;
}) {
  if (isEmpty) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <table className="template-table">
      <thead>{head}</thead>
      <tbody>{children}</tbody>
    </table>
  );
}
