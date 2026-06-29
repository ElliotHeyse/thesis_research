<?php
ob_start();

include '../includes/paths.php';
include '../data/db_donors.php';
include '../includes/utils/pdf.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_POST['donorIds'])) {
    discard_buffered_output();
    header('Location: ' . BASE_URL . '/donors/letters.php?error=no_selection');
    exit();
}

$donors_to_send_letters = [];
foreach ($_POST['donorIds'] as $donorId) {
    $donor = get_donor((int)$donorId);
    if ($donor) {
        $donors_to_send_letters[] = $donor;
    }
}

if (empty($donors_to_send_letters)) {
    discard_buffered_output();
    header('Location: ' . BASE_URL . '/donors/letters.php?error=no_selection');
    exit();
}

$html = render_template_to_html(__DIR__ . '/../templates/donors_letters.php', [
    'donors_to_send_letters' => $donors_to_send_letters,
]);

stream_pdf($html, 'donor-letters.pdf');
