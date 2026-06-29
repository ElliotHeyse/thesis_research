<?php
include '../includes/page_layout.php';
include '../includes/ui/page_intro.php';
include '../includes/ui/select_donors.php';
include '../data/db_donors.php';

$donors = get_donors_eligible_for_receipt();
$content = render_page_intro('Select donors with donated items who have not yet received a tax receipt.');
$content .= render_donor_select_table($donors, BASE_URL . '/donors/receipts_print.php', 'Generate Tax Receipts');

echo render_page('Tax Receipts', $content, ['subnav' => 'donors', 'flash' => true]);
