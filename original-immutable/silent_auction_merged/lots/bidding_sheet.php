<?php
ob_start();

/**
 * Bidding Sheet Generator
 * Generates a PDF bidding sheet for a specific item
 */

include '../data/db_items.php';
include '../includes/paths.php';
include '../includes/utils/pdf.php';

if (!isset($_GET['ItemID'])) {
    discard_buffered_output();
    header('Location: ' . BASE_URL . '/lots/items.php');
    exit;
}

$item_id = htmlentities($_GET['ItemID']);

$item = get_item_by_id($item_id);
if (!$item) {
    discard_buffered_output();
    header('Location: ' . BASE_URL . '/lots/items.php');
    exit;
}

$lot = null;
$category = null;
if (!empty($item['LotID'])) {
    $lot = get_lot_for_bidding_sheet($item['LotID']);

    if ($lot && !empty($lot['CategoryID'])) {
        $category = get_category_for_bidding_sheet($lot['CategoryID']);
    }
}

$retailValue = floatval($item['RetailValue'] ?? 0);
if (isset($_GET['startingBid'])) {
    $startingBid = floatval($_GET['startingBid']);
} else {
    $startingBid = $retailValue > 0 ? ($retailValue * 0.5) : 10.00;
}

$bidIncrement = isset($_GET['bidIncrement']) ? floatval($_GET['bidIncrement']) : 5.00;
$numberOfBidRows = isset($_GET['rows']) ? intval($_GET['rows']) : 15;

$html = render_template_to_html(__DIR__ . '/../utils/bidding_sheet.php', [
    'item' => $item,
    'lot' => $lot,
    'category' => $category,
    'startingBid' => $startingBid,
    'bidIncrement' => $bidIncrement,
    'numberOfBidRows' => $numberOfBidRows,
]);

stream_pdf($html, 'bidding-sheet-item-' . $item_id . '.pdf');
