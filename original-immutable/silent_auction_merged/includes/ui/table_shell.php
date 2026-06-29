<?php

require_once __DIR__ . '/empty_state.php';

function render_table(string $headHtml, string $bodyHtml): string
{
    return "<table class='template-table'><thead>$headHtml</thead><tbody>$bodyHtml</tbody></table>";
}

function render_data_table(string $headHtml, string $bodyHtml, $data, string $emptyMessage): string
{
    if ($data === false) {
        return render_empty_state('Connection failed', 'danger');
    }
    if (empty($data)) {
        return render_empty_state($emptyMessage, 'info');
    }
    return render_table($headHtml, $bodyHtml);
}
