<?php
ob_start();

include '../includes/paths.php';
include '../data/db_donors.php';
include '../includes/utils/pdf.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_POST['donorIds'])) {
    discard_buffered_output();
    header('Location: ' . BASE_URL . '/donors/receipts.php?error=no_selection');
    exit();
}

$donors_and_items_to_send_receipts = [];
foreach ($_POST['donorIds'] as $donorId) {
    $donorId = (int)$donorId;
    $donor = get_donor($donorId);
    if ($donor) {
        $items = get_items_by_donor_id($donorId);
        $donors_and_items_to_send_receipts[] = [
            'donor' => $donor,
            'items' => $items,
        ];
        mark_receipt_sent($donorId);
    }
}

if (empty($donors_and_items_to_send_receipts)) {
    discard_buffered_output();
    header('Location: ' . BASE_URL . '/donors/receipts.php?error=no_selection');
    exit();
}

$html = render_template_to_html(__DIR__ . '/../templates/tax_receipts.php', [
    'donors_and_items_to_send_receipts' => $donors_and_items_to_send_receipts,
    'logoPath' => resolve_asset_path('assets/Tiger-icon-hi-res.webp'),
]);

stream_pdf($html, 'tax-receipts.pdf');
