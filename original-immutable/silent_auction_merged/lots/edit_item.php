<?php
include '../includes/page_layout.php';
include '../includes/ui/form_items.php';
include '../includes/utils/form_parse.php';

$item_id = isset($_GET['ItemID']) ? (int)$_GET['ItemID'] : null;
$formWasEmpty = !form_was_submitted(['Description']);
$values = null;

if (!$formWasEmpty) {
    $parsed = parse_form_get([
        'description' => 'Description',
        'retailValue' => 'RetailValue',
        'donorID' => 'DonorID',
        'lotID' => 'LotID',
    ]);
    $values = (object)[
        'description' => $parsed->description ?? '',
        'retailValue' => $parsed->retailValue ?? '',
        'donorID' => $parsed->donorID ?? '',
        'lotID' => $parsed->lotID ?? 'NULL',
    ];
}

$content = render_item_form($item_id, $formWasEmpty, $values);

echo render_page($item_id ? 'Edit Item' : 'Add Item', $content, ['subnav' => 'lots']);
