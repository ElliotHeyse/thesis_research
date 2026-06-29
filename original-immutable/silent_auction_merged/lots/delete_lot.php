<?php
include '../includes/page_layout.php';
include '../includes/ui/confirm_delete.php';
include '../data/db_lots.php';

$lot_id = isset($_GET['LotID']) ? (int)$_GET['LotID'] : null;

if (!$lot_id) {
    header('Location: ' . BASE_URL . '/lots/lots.php?error=invalid_id');
    exit();
}

$lot = get_lot($lot_id);
if (!$lot) {
    header('Location: ' . BASE_URL . '/lots/lots.php?error=notfound');
    exit();
}

if (isset($_GET['confirm']) && $_GET['confirm'] === '1') {
    if (delete_lot($lot_id)) {
        header('Location: ' . BASE_URL . '/lots/lots.php?success=deleted');
    } else {
        header('Location: ' . BASE_URL . '/lots/lots.php?error=delete_failed');
    }
    exit();
}

$returnUrl = BASE_URL . '/lots/edit_lot.php?LotID=' . $lot_id;
$confirmUrl = BASE_URL . '/lots/delete_lot.php?LotID=' . $lot_id . '&confirm=1';
$content = render_confirm_delete('lot', $lot, $returnUrl, $confirmUrl);

echo render_page('Delete Lot', $content, ['subnav' => 'lots']);
