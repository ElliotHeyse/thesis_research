<?php
require_once __DIR__ . '/paths.php';
require_once __DIR__ . '/ui/subnav.php';
require_once __DIR__ . '/ui/button.php';

function render_donors_subnav(): string
{
    $base = BASE_URL;
    $currentPath = $_SERVER['REQUEST_URI'] ?? '';
    $currentPathArray = explode('/', $currentPath);

    $location = 'donors';
    $lastelement = end($currentPathArray);
    $route = $lastelement ?? '';
    $filename = explode('?', $route)[0];

    switch ($filename) {
        case 'pending_receipts.php':
            $location = 'pending';
            break;
        case 'letters.php':
        case 'letters_print.php':
            $location = 'letters';
            break;
        case 'receipts.php':
        case 'receipts_print.php':
            $location = 'receipts';
            break;
        case 'edit_donor.php':
        case 'delete_donor.php':
            $location = 'donors';
            break;
        default:
            $location = 'donors';
            break;
    }

    $tabs = [
        'donors' => ['label' => 'All Donors', 'href' => "$base/donors/index.php"],
        'pending' => ['label' => 'Pending Receipts', 'href' => "$base/donors/pending_receipts.php"],
        'letters' => ['label' => 'Letters', 'href' => "$base/donors/letters.php"],
        'receipts' => ['label' => 'Tax Receipts', 'href' => "$base/donors/receipts.php"],
    ];

    $actionHtml = '';
    if ($location === 'donors' && $filename === 'index.php') {
        $actionHtml = render_link_button('Add New Donor', "$base/donors/edit_donor.php");
    }

    return render_subnav($tabs, $location, $actionHtml);
}
