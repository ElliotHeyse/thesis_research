<?php
require_once __DIR__ . '/paths.php';
require_once __DIR__ . '/ui/subnav.php';
require_once __DIR__ . '/ui/button.php';

function render_lots_subnav(): string
{
    $base = BASE_URL;
    $currentPath = $_SERVER['REQUEST_URI'] ?? '';
    $currentPathArray = explode('/', $currentPath);

    $location = '';
    $sublocation = '';

    $lastelement = end($currentPathArray);
    $route = $lastelement ?? '';
    $filename = explode('?', $route)[0];
    switch ($filename) {
        case 'items.php':
            $location = 'items';
            break;
        case 'edit_item.php':
            $location = 'items';
            $sublocation = 'edit_item';
            break;
        case 'delete_item.php':
            $location = 'items';
            $sublocation = 'delete_item';
            break;
        case 'lots.php':
            $location = 'lots';
            break;
        case 'edit_lot.php':
            $location = 'lots';
            $sublocation = 'edit_lot';
            break;
        case 'delete_lot.php':
            $location = 'lots';
            $sublocation = 'edit_lot';
            break;
        case 'lot_details.php':
            $location = 'lots';
            $sublocation = 'lot_details';
            break;
        case 'categories.php':
            $location = 'categories';
            break;
        case 'edit_category.php':
            $location = 'categories';
            $sublocation = 'edit_category';
            break;
        case 'delete_category.php':
            $location = 'categories';
            $sublocation = 'edit_category';
            break;
        default:
            $location = 'items';
            break;
    }

    $tabs = [
        'items' => ['label' => 'Items', 'href' => "$base/lots/items.php"],
        'lots' => ['label' => 'Lots', 'href' => "$base/lots/lots.php"],
        'categories' => ['label' => 'Categories', 'href' => "$base/lots/categories.php"],
    ];

    $actionHtml = '';
    switch ($location) {
        case 'items':
            if ($sublocation !== 'edit_item' && $sublocation !== 'delete_item') {
                $actionHtml = render_link_button('Add New Item', "$base/lots/edit_item.php");
                $actionHtml .= ' ' . render_submit_button('Save Changes', 'success', [
                    'form' => 'items-lot-form',
                    'name' => 'save_lot_changes',
                ]);
            }
            break;
        case 'lots':
            if ($sublocation === 'edit_lot') {
                $lotId = isset($_GET['LotID']) ? (int)$_GET['LotID'] : 0;
                if ($lotId) {
                    $actionHtml = render_link_button('Delete Lot', "$base/lots/delete_lot.php?LotID=$lotId", 'danger');
                }
            } elseif ($sublocation !== 'lot_details') {
                $actionHtml = render_link_button('Add New Lot', "$base/lots/edit_lot.php");
            }
            break;
        case 'categories':
            if ($sublocation === 'edit_category') {
                $categoryId = isset($_GET['CategoryID']) ? (int)$_GET['CategoryID'] : 0;
                if ($categoryId) {
                    $actionHtml = render_link_button('Delete Category', "$base/lots/delete_category.php?CategoryID=$categoryId", 'danger');
                }
            } else {
                $actionHtml = render_link_button('Add New Category', "$base/lots/edit_category.php");
            }
            break;
    }

    return render_subnav($tabs, $location, $actionHtml);
}
