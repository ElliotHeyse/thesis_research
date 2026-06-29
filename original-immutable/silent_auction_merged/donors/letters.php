<?php
include '../includes/page_layout.php';
include '../includes/ui/page_intro.php';
include '../includes/ui/select_donors.php';
include '../data/db_donors.php';

$donors = get_donors();
$content = render_page_intro('Select donors to generate solicitation letters.');
$content .= render_donor_select_table($donors, BASE_URL . '/donors/letters_print.php', 'Generate Letters');

echo render_page('Donor Letters', $content, ['subnav' => 'donors', 'flash' => true]);
