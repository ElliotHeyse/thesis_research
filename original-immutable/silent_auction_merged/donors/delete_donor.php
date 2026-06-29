<?php
include '../includes/page_layout.php';
include '../includes/ui/confirm_delete.php';
include '../data/db_donors.php';

$donor_id = isset($_GET['DonorID']) ? (int)$_GET['DonorID'] : null;

if (!$donor_id) {
    header("Location: " . BASE_URL . "/donors/index.php?error=invalid_id");
    exit();
}

$donor = get_donor($donor_id);
if (!$donor) {
    header("Location: " . BASE_URL . "/donors/index.php?error=notfound");
    exit();
}

if (isset($_GET['confirm']) && $_GET['confirm'] === '1') {
    if (delete_donor($donor_id)) {
        header("Location: " . BASE_URL . "/donors/index.php?success=deleted");
    } else {
        header("Location: " . BASE_URL . "/donors/index.php?error=has_items");
    }
    exit();
}

$returnUrl = BASE_URL . "/donors/index.php";
$confirmUrl = BASE_URL . "/donors/delete_donor.php?DonorID=$donor_id&confirm=1";
$content = render_confirm_delete('donor', $donor, $returnUrl, $confirmUrl);

echo render_page('Delete Donor', $content, ['subnav' => 'donors']);
