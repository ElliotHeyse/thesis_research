<?php
include '../includes/page_layout.php';
include '../includes/paths.php';
include '../includes/ui/table.php';
include '../data/db_items.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_lot_changes'])) {
    $postedLots = $_POST['LotID'] ?? [];
    if (!is_array($postedLots)) {
        header('Location: ' . BASE_URL . '/lots/items.php?error=update_failed');
        exit();
    }

    $items = get_items();
    if ($items === false) {
        header('Location: ' . BASE_URL . '/lots/items.php?error=update_failed');
        exit();
    }

    $itemsById = [];
    foreach ($items as $item) {
        $itemsById[$item['ItemID']] = $item;
    }

    $modifiedItems = [];
    foreach ($postedLots as $itemId => $newLotId) {
        if (!is_numeric($itemId) || !is_numeric($newLotId)) {
            continue;
        }
        if (!isset($itemsById[$itemId])) {
            continue;
        }

        $currentLotId = $itemsById[$itemId]['LotID'] ?? null;
        $currentNormalized = ($currentLotId === null || $currentLotId === '') ? -1 : (int)$currentLotId;
        $newNormalized = (int)$newLotId;

        if ($currentNormalized !== $newNormalized) {
            $modifiedItems[] = [
                'itemID' => (int)$itemId,
                'newLotID' => $newNormalized,
            ];
        }
    }

    if (!empty($modifiedItems)) {
        try {
            modify_items($modifiedItems);
        } catch (Exception $e) {
            header('Location: ' . BASE_URL . '/lots/items.php?error=update_failed');
            exit();
        }
    }

    header('Location: ' . BASE_URL . '/lots/items.php?success=updated');
    exit();
}

try {
    $items = get_items();
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}

try {
    $lot_descriptions = get_lot_descriptions();
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}

$content = render_items_table($items, $lot_descriptions ?? []);

echo render_page('Items', $content, [
    'subnav' => 'lots',
    'flash' => true,
]);
