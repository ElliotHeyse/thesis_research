<?php
include '../includes/page_layout.php';
include '../includes/ui/confirm_delete.php';
include '../data/db_items.php';

$item_id = isset($_GET['ItemID']) ? (int)$_GET['ItemID'] : null;

if (!$item_id) {
    header("Location: " . BASE_URL . "/lots/items.php?error=invalid_id");
    exit();
}

$item = get_item_by_id($item_id);
if (!$item) {
    header("Location: " . BASE_URL . "/lots/items.php?error=notfound");
    exit();
}

if (isset($_GET['confirm']) && $_GET['confirm'] === '1') {
    if (delete_item($item_id)) {
        header("Location: " . BASE_URL . "/lots/items.php?success=deleted");
    } else {
        header("Location: " . BASE_URL . "/lots/items.php?error=delete_failed");
    }
    exit();
}

$returnUrl = BASE_URL . "/lots/items.php";
$confirmUrl = BASE_URL . "/lots/delete_item.php?ItemID=$item_id&confirm=1";
$content = render_confirm_delete('item', $item, $returnUrl, $confirmUrl);

echo render_page('Delete Item', $content, ['subnav' => 'lots']);
