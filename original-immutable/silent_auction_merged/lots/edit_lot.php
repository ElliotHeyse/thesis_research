<?php
include '../includes/page_layout.php';
include '../includes/ui/form_lots.php';
include '../includes/utils/form_parse.php';

$lot_id = isset($_GET['LotID']) ? htmlentities($_GET['LotID']) : null;
$formWasEmpty = !form_was_submitted(['Description']);
$values = null;

if (!$formWasEmpty) {
    $parsed = parse_form_get([
        'description' => 'Description',
        'category_id' => 'CategoryID',
        'highest_bid' => 'HighestBid',
        'bidder_id' => 'BidderID',
        'delivered' => 'Delivered',
        'image' => 'Image',
    ]);
    $values = $parsed;
    if (!isset($_GET['Delivered'])) {
        $values->delivered = 'off';
    }
}

$content = render_lot_form($lot_id, $formWasEmpty, $values);

echo render_page('Edit Lot', $content, [
    'subnav' => 'lots',
]);
