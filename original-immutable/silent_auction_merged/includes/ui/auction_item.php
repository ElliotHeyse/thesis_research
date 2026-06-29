<?php
require_once __DIR__ . '/../utils/format.php';

function render_auction_item(array $item): string
{
    $result = "<div>";
    $result .= "<h4>" . htmlspecialchars($item['Description'] ?? '') . "</h4>";
    $result .= "<p>Retail Value: " . format_currency($item['RetailValue'] ?? null) . "</p>";
    $result .= "</div>";
    return $result;
}
