<?php
include '../includes/page_layout.php';
include '../includes/ui/table.php';
include '../data/db_lots.php';

try {
    $lots = get_lots();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

$content = render_lots_table($lots ?? false);

echo render_page('Lots', $content, ['subnav' => 'lots', 'flash' => true]);
