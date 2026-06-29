<?php
include '../includes/page_layout.php';
include '../includes/ui/confirm_delete.php';
include '../data/db_categories.php';

$category_id = isset($_GET['CategoryID']) ? (int)$_GET['CategoryID'] : null;

if (!$category_id) {
    header('Location: ' . BASE_URL . '/lots/categories.php?error=invalid_id');
    exit();
}

$category = get_category($category_id);
if (!$category) {
    header('Location: ' . BASE_URL . '/lots/categories.php?error=notfound');
    exit();
}

if (isset($_GET['confirm']) && $_GET['confirm'] === '1') {
    if (delete_category($category_id)) {
        header('Location: ' . BASE_URL . '/lots/categories.php?success=deleted');
    } else {
        header('Location: ' . BASE_URL . '/lots/categories.php?error=delete_failed');
    }
    exit();
}

$returnUrl = BASE_URL . '/lots/edit_category.php?CategoryID=' . $category_id;
$confirmUrl = BASE_URL . '/lots/delete_category.php?CategoryID=' . $category_id . '&confirm=1';
$content = render_confirm_delete('category', $category, $returnUrl, $confirmUrl);

echo render_page('Delete Category', $content, ['subnav' => 'lots']);
