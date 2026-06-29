<?php
include '../includes/page_layout.php';
include '../data/db_auction.php';
include '../includes/ui/auction_category.php';

$items = get_items();
$category_descriptions = get_category_descriptions();

$auction_dict = (object)[];
foreach ($items as $item) {
    $category_id = $item['CategoryID'];
    if (!isset($auction_dict->{$category_id})) {
        $auction_dict->{$category_id} = [];
    }
    $auction_dict->{$category_id}[] = $item;
}

$content = "<div class='o-flex o-flex--column u-gap-space-200'>";

foreach ($category_descriptions as $category_description) {
    $categoryItems = $auction_dict->{$category_description['CategoryID']} ?? [];
    $content .= render_auction_category($category_description['Description'], $categoryItems);
}

$content .= "</div>";

echo render_page('Auction', $content);
