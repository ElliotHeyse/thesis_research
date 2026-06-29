<?php
require_once __DIR__ . '/../paths.php';
require_once __DIR__ . '/../utils/format.php';
require_once __DIR__ . '/table_shell.php';
require_once __DIR__ . '/action_links.php';

function donor_row_cells(array $donor, string $columns = 'default'): string
{
    $html = '';
    if ($columns === 'select') {
        $html .= "<td><input type='checkbox' name='donorIds[]' value='" . htmlspecialchars((string)$donor['DonorID']) . "'></td>";
    }
    $html .= "<td>" . htmlspecialchars((string)$donor['DonorID']) . "</td>";
    $html .= "<td>" . format_or_dash($donor['BusinessName'] ?? null) . "</td>";
    $html .= "<td>" . format_or_dash($donor['ContactName'] ?? null) . "</td>";
    $html .= "<td>" . format_or_dash($donor['ContactEmail'] ?? null) . "</td>";
    $html .= "<td>" . format_or_dash($donor['City'] ?? null) . "</td>";
    $html .= "<td>" . format_or_dash($donor['State'] ?? null) . "</td>";
    if ($columns !== 'select') {
        $html .= "<td>" . format_yes_no(!empty($donor['TaxReceipt'])) . "</td>";
    }
    if ($columns === 'receipt') {
        $html .= "<td>" . htmlspecialchars((string)($donor['TotalItems'] ?? 0)) . "</td>";
        $html .= "<td>" . format_currency($donor['TotalValue'] ?? 0) . "</td>";
    }
    return $html;
}

function render_donor_table($donors, bool $showReceiptColumns = false): string
{
    $columns = $showReceiptColumns ? 'receipt' : 'default';
    $base = BASE_URL;

    $head = "<tr><th>ID</th><th>Business Name</th><th>Contact Name</th><th>Email</th>";
    $head .= "<th>City</th><th>State</th><th>Tax Receipt</th>";
    if ($showReceiptColumns) {
        $head .= "<th>Total Items</th><th>Total Value</th>";
    }
    $head .= "<th>Actions</th></tr>";

    $body = '';
    if (is_array($donors)) {
        foreach ($donors as $donor) {
            $id = $donor['DonorID'];
            $body .= "<tr>";
            $body .= donor_row_cells($donor, $columns);
            $body .= "<td>" . render_action_links([
                'Edit' => "$base/donors/edit_donor.php?DonorID=$id",
                'Delete' => "$base/donors/delete_donor.php?DonorID=$id",
            ]) . "</td></tr>";
        }
    }

    $emptyMsg = 'No donors found';
    return render_data_table($head, $body, $donors, $emptyMsg);
}
