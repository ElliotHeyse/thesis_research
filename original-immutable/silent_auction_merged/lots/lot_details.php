<?php
include '../includes/page_layout.php';
include '../includes/ui/lot_details.php';
include '../data/db_lots.php';

if (isset($_GET['LotID'])) {
    $lot_id = htmlentities($_GET['LotID']);
    $lot = get_lot($lot_id);
    $category = get_category($lot["CategoryID"]);
} else {
    header("Location: " . BASE_URL . "/lots/lots.php");
    exit;
}

$content = render_lot_details($lot, $category);

echo render_page('Lot ' . $lot_id, $content, ['subnav' => 'lots']);
