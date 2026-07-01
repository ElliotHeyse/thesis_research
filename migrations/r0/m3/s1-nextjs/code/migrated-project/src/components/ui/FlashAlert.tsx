const SUCCESS_MESSAGES: Record<string, string> = {
  created: "Record created successfully.",
  updated: "Record updated successfully.",
  deleted: "Record deleted successfully.",
  receipts_sent: "Tax receipts generated and donors marked as sent.",
  letters_generated: "Donor letters generated successfully.",
};

const ERROR_MESSAGES: Record<string, string> = {
  has_items: "Cannot delete donor with associated items.",
  notfound: "Record not found.",
  delete_failed: "Failed to delete record.",
  invalid_id: "Invalid ID provided.",
  update_failed: "Failed to update record.",
  no_selection: "Please select at least one donor.",
  create_failed: "Failed to create record.",
  validation: "Please correct the errors in the form.",
};

export function FlashAlert({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  if (success) {
    const msg = SUCCESS_MESSAGES[success] ?? "Operation completed successfully.";
    return <div className="alert alert-success">{msg}</div>;
  }
  if (error) {
    const msg = ERROR_MESSAGES[error] ?? "An error occurred.";
    return <div className="alert alert-danger">{msg}</div>;
  }
  return null;
}
