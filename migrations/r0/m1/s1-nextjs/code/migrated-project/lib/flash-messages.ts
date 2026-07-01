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
};

export function getFlashMessage(
  type: "success" | "error",
  code: string,
): string {
  if (type === "success") {
    return SUCCESS_MESSAGES[code] ?? "Operation completed successfully.";
  }
  return ERROR_MESSAGES[code] ?? "An error occurred.";
}
