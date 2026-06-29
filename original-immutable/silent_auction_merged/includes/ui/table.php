<?php
require_once __DIR__ . '/../paths.php';
require_once __DIR__ . '/../utils/format.php';
require_once __DIR__ . '/table_shell.php';
require_once __DIR__ . '/action_links.php';
require_once __DIR__ . '/button.php';
include 'select_lot.php';

function render_items_table($items, $lot_descriptions): string
{
    $base = BASE_URL;
    $head = "<tr>";
    $head .= "<th>Item ID</th><th>Description</th><th>Retail Value</th><th>Donor</th>";
    $head .= "<th>Lot</th><th>Actions</th><th>Download Bidding Sheet</th>";
    $head .= "</tr>";

    $body = '';
    if (is_array($items)) {
        foreach ($items as $item) {
            $item_id = $item['ItemID'];
            $body .= "<tr>";
            $body .= "<td>" . htmlspecialchars((string)$item_id) . "</td>";
            $body .= "<td>" . format_or_dash($item['Description'] ?? null) . "</td>";
            $body .= "<td>" . format_or_dash($item['RetailValue'] ?? null) . "</td>";
            $body .= "<td>" . format_or_dash($item['BusinessName'] ?? null) . "</td>";
            $body .= "<td>" . select_lot($lot_descriptions, $item_id, $item['LotID']) . "</td>";
            $body .= "<td>" . render_action_links([
                'Edit' => "$base/lots/edit_item.php?ItemID=$item_id",
                'Delete' => "$base/lots/delete_item.php?ItemID=$item_id",
            ]) . "</td>";
            $body .= "<td>" . render_link_button(
                'Download Bidding Sheet',
                "$base/lots/bidding_sheet.php?ItemID=$item_id",
                'success',
                ['target' => '_blank']
            ) . "</td>";
            $body .= "</tr>";
        }
    }

    $table = render_data_table($head, $body, $items, 'No items found');
    if ($items === false || empty($items)) {
        return $table;
    }

    return "<form id='items-lot-form' method='post' action='items.php'>$table</form>";
}

function render_lots_table($lots): string
{
    $base = BASE_URL;
    $head = "<tr>";
    $head .= "<th>Lot ID</th><th>Description</th><th>Highest Bid</th><th>Winner</th>";
    $head .= "<th>Delivered</th><th>Category</th><th>Edit Lot</th><th>View Lot</th>";
    $head .= "</tr>";

    $body = '';
    if (is_array($lots)) {
        foreach ($lots as $lot) {
            $lot_id = $lot['LotID'];
            $body .= "<tr>";
            $body .= "<td>" . htmlspecialchars((string)$lot_id) . "</td>";
            $body .= "<td>" . format_or_dash($lot['Description'] ?? null) . "</td>";
            $body .= "<td>" . format_currency($lot['WinningBid'] ?? null) . "</td>";
            $body .= "<td>" . format_or_dash($lot['Winner'] ?? null) . "</td>";
            $body .= "<td>" . format_yes_no(!empty($lot['Delivered'])) . "</td>";
            $body .= "<td>" . format_or_dash($lot['Category'] ?? null) . "</td>";
            $body .= "<td><a href='$base/lots/edit_lot.php?LotID=$lot_id'>Edit</a></td>";
            $body .= "<td><a href='$base/lots/lot_details.php?LotID=$lot_id'>View</a></td>";
            $body .= "</tr>";
        }
    }

    return render_data_table($head, $body, $lots, 'No lots found');
}

function render_categories_table($categories): string
{
    $base = BASE_URL;
    $head = "<tr><th>Category ID</th><th>Description</th><th>Edit Category</th></tr>";

    $body = '';
    if (is_array($categories)) {
        foreach ($categories as $category) {
            $category_id = $category['CategoryID'];
            $body .= "<tr>";
            $body .= "<td>" . htmlspecialchars((string)$category_id) . "</td>";
            $body .= "<td>" . format_or_dash($category['Description'] ?? null) . "</td>";
            $body .= "<td><a href='$base/lots/edit_category.php?CategoryID=$category_id'>Edit</a></td>";
            $body .= "</tr>";
        }
    }

    return render_data_table($head, $body, $categories, 'No categories found');
}
