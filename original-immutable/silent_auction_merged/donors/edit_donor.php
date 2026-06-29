<?php
include '../includes/page_layout.php';
include '../includes/ui/form_donors.php';
include '../includes/utils/form_parse.php';

$donor_id = isset($_GET['DonorID']) ? (int)$_GET['DonorID'] : null;
$formWasEmpty = !form_was_submitted(['ContactName', 'BusinessName']);
$values = null;

if (!$formWasEmpty) {
    $parsed = parse_form_get([
        'businessName' => 'BusinessName',
        'contactName' => 'ContactName',
        'contactEmail' => 'ContactEmail',
        'contactTitle' => 'ContactTitle',
        'address' => 'Address',
        'city' => 'City',
        'state' => 'State',
        'zipCode' => 'ZipCode',
        'taxReceipt' => 'TaxReceipt',
    ]);
    $values = $parsed;
    if (!isset($_GET['TaxReceipt'])) {
        $values->taxReceipt = 'off';
    }
}

$content = render_donor_form($donor_id, $formWasEmpty, $values);

echo render_page($donor_id ? 'Edit Donor' : 'Add Donor', $content, ['subnav' => 'donors']);
