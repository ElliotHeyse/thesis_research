<?php
require_once __DIR__ . '/../paths.php';
require_once __DIR__ . '/table_donors.php';
require_once __DIR__ . '/button.php';

function render_donor_select_table($donors, string $formAction, string $submitLabel): string
{
    if ($donors === false) {
        require_once __DIR__ . '/empty_state.php';
        return render_empty_state('Connection failed', 'danger');
    }
    if (empty($donors)) {
        require_once __DIR__ . '/empty_state.php';
        return render_empty_state('No donors found', 'info');
    }

    $html = "<form action='" . htmlspecialchars($formAction) . "' method='post'>";
    $html .= "<table class='template-table'><thead><tr>";
    $html .= "<th>Select</th><th>ID</th><th>Business Name</th><th>Contact Name</th>";
    $html .= "<th>Email</th><th>City</th><th>State</th>";
    $html .= "</tr></thead><tbody>";

    foreach ($donors as $donor) {
        $html .= "<tr>" . donor_row_cells($donor, 'select') . "</tr>";
    }

    $html .= "</tbody></table>";
    $html .= "<div class='form-actions' style='margin-top: 20px;'>";
    $html .= render_submit_button($submitLabel);
    $html .= "</div></form>";

    return $html;
}
