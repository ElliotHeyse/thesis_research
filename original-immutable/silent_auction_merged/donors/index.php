<?php
include '../includes/page_layout.php';
include '../includes/ui/table_donors.php';
include '../data/db_donors.php';

$donors = get_donors();
$content = render_donor_table($donors);

echo render_page('Donors', $content, ['subnav' => 'donors', 'flash' => true]);
