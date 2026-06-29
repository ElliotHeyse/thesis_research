<?php
include '../includes/page_layout.php';
include '../includes/ui/page_intro.php';
include '../includes/ui/table_donors.php';
include '../data/db_donors.php';

$donors = get_donors_without_receipt();
$content = render_page_intro('Donors with donated items who have not yet received a tax receipt.');
$content .= render_donor_table($donors, true);

echo render_page('Pending Receipts', $content, ['subnav' => 'donors', 'flash' => true]);
