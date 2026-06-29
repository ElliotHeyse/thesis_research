<?php

function render_form_actions(string $submitLabel, ?string $cancelUrl = null): string
{
    $html = "<button type='submit'>" . htmlspecialchars($submitLabel) . "</button>";
    if ($cancelUrl !== null) {
        $html .= " <a href='" . htmlspecialchars($cancelUrl) . "'>Cancel</a>";
    }
    return $html;
}
