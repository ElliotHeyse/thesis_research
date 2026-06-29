<?php
require_once __DIR__ . '/../utils/format.php';
require_once __DIR__ . '/detail_field.php';

function render_lot_details(array $lot, array $category): string
{
    $imageHtml = '';
    if (!empty($lot['Image'])) {
        $imageHtml = "<div class='c-lot-details__image-wrapper'>"
            . "<img src='" . htmlspecialchars($lot['Image']) . "' alt='Lot Image' class='c-lot-details__image'>"
            . "</div>";
    }

    $delivered = !empty($lot['Delivered']);
    $fields = [
        'Description' => htmlspecialchars($lot['Description'] ?? ''),
        'Highest Bid' => format_currency($lot['WinningBid'] ?? 0),
        'Winner' => htmlspecialchars($lot['Winner'] ?? 'No winner yet'),
        'Delivered' => [
            'value' => format_yes_no($delivered),
            'modifier' => '--' . ($delivered ? 'yes' : 'no'),
        ],
        'Category' => htmlspecialchars($category['Description'] ?? ''),
    ];

    $html = "<div class='c-lot-details o-container'>";
    $html .= "<h3 class='c-lot-details__title'>Lot " . htmlspecialchars((string)$lot['LotID']) . "</h3>";
    $html .= "<div class='c-lot-details__content'>";
    $html .= $imageHtml;
    $html .= "<div class='c-lot-details__info'>";

    foreach ($fields as $label => $field) {
        if (is_array($field)) {
            $html .= render_detail_field($label, $field['value'], $field['modifier']);
        } else {
            $html .= render_detail_field($label, $field);
        }
    }

    $html .= "</div></div></div>";
    return $html;
}
