<?php
include '../includes/page_layout.php';
include '../includes/ui/form_categories.php';
include '../includes/utils/form_parse.php';

$category_id = isset($_GET['CategoryID']) ? htmlentities($_GET['CategoryID']) : null;
$formWasEmpty = !form_was_submitted(['Description']);
$values = null;

if (!$formWasEmpty) {
    $parsed = parse_form_get(['description' => 'Description']);
    $values = $parsed;
}

$content = render_category_form($category_id, $formWasEmpty, $values);

echo render_page('Edit Category', $content, [
    'subnav' => 'lots',
]);
