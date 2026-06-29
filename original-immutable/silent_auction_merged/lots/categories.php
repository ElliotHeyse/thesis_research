<?php
include '../includes/page_layout.php';
include '../includes/ui/table.php';
include '../data/db_categories.php';

try {
    $categories = get_categories();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

$content = render_categories_table($categories ?? false);

echo render_page('Lots', $content, ['subnav' => 'lots', 'flash' => true]);
