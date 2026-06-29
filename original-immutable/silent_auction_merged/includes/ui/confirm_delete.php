<?php
require_once __DIR__ . '/../paths.php';
require_once __DIR__ . '/../utils/format.php';
require_once __DIR__ . '/button.php';

const ENTITY_DELETE_FIELDS = [
    'donor' => [
        'Donor ID' => 'DonorID',
        'Business Name' => 'BusinessName',
        'Contact Name' => 'ContactName',
        'Email' => 'ContactEmail',
        'City' => 'City',
    ],
    'item' => [
        'Item ID' => 'ItemID',
        'Description' => 'Description',
        'Retail Value' => ['key' => 'RetailValue', 'format' => 'currency'],
        'Donor ID' => 'DonorID',
    ],
    'lot' => [
        'Lot ID' => 'LotID',
        'Description' => 'Description',
        'Category ID' => 'CategoryID',
    ],
    'category' => [
        'Category ID' => 'CategoryID',
        'Description' => 'Description',
    ],
];

function __format_delete_value($entity, $fieldConfig): string
{
    if (is_array($fieldConfig)) {
        $key = $fieldConfig['key'];
        $value = $entity[$key] ?? null;
        if (($fieldConfig['format'] ?? '') === 'currency') {
            return format_currency($value ?? 0);
        }
        return htmlspecialchars((string)($value ?? 'N/A'));
    }
    return htmlspecialchars((string)($entity[$fieldConfig] ?? 'N/A'));
}

function render_confirm_delete(string $entityType, array $entity, string $returnUrl, string $confirmUrl): string
{
    $fields = ENTITY_DELETE_FIELDS[$entityType] ?? [];

    $html = "<div class='confirm-container'>";
    $html .= "<h2 class='confirm-title'>Confirm Deletion</h2>";
    $html .= "<p style='text-align: center; margin-bottom: 30px;'>";
    $html .= "<strong>Are you sure you want to delete this " . htmlspecialchars($entityType) . "?</strong><br>";
    $html .= "This action cannot be undone.</p>";
    $html .= "<div class='entity-details'>";

    foreach ($fields as $label => $fieldConfig) {
        $value = __format_delete_value($entity, $fieldConfig);
        $html .= "<p><strong>" . htmlspecialchars($label) . ":</strong> " . $value . "</p>";
    }

    $html .= "</div>";
    $html .= "<div class='button-group'>";
    $html .= render_link_button('Yes, Delete Permanently', $confirmUrl, 'danger');
    $html .= ' ';
    $html .= render_link_button('No, Cancel', $returnUrl, 'secondary');
    $html .= "</div></div>";

    return $html;
}
