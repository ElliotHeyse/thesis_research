<?php
function render_flash_messages()
{
    $html = "";
    if (isset($_GET['success'])) {
        $messages = [
            'created' => 'Record created successfully.',
            'updated' => 'Record updated successfully.',
            'deleted' => 'Record deleted successfully.',
            'receipts_sent' => 'Tax receipts generated and donors marked as sent.',
            'letters_generated' => 'Donor letters generated successfully.',
        ];
        $msg = $messages[$_GET['success']] ?? 'Operation completed successfully.';
        $html .= "<div class='alert alert-success'>" . htmlspecialchars($msg) . "</div>";
    }
    if (isset($_GET['error'])) {
        $messages = [
            'has_items' => 'Cannot delete donor with associated items.',
            'notfound' => 'Record not found.',
            'delete_failed' => 'Failed to delete record.',
            'invalid_id' => 'Invalid ID provided.',
            'update_failed' => 'Failed to update record.',
            'no_selection' => 'Please select at least one donor.',
            'create_failed' => 'Failed to create record.',
        ];
        $msg = $messages[$_GET['error']] ?? 'An error occurred.';
        $html .= "<div class='alert alert-danger'>" . htmlspecialchars($msg) . "</div>";
    }
    return $html;
}
