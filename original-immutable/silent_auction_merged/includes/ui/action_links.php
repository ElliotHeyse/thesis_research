<?php

function render_action_links(array $links): string
{
    $parts = [];
    foreach ($links as $label => $href) {
        $parts[] = "<a href='" . htmlspecialchars($href) . "'>" . htmlspecialchars($label) . "</a>";
    }
    return implode(' | ', $parts);
}
