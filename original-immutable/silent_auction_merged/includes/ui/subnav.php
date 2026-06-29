<?php

function render_subnav(array $tabs, string $activeKey, ?string $actionHtml = null): string
{
    $html = "<div class='o-flex o-flex--justify-between o-flex--align-center'>";
    $html .= "<div class='c-lot-nav-links'>";

    foreach ($tabs as $key => $tab) {
        $active = ($key === $activeKey) ? ' c-lot-subnav--active' : '';
        $href = htmlspecialchars($tab['href']);
        $label = htmlspecialchars($tab['label']);
        $html .= "<a href='$href' class='c-lot-subnav$active'>$label</a>";
    }

    $html .= "</div>";

    if ($actionHtml !== null && $actionHtml !== '') {
        $html .= $actionHtml;
    }

    $html .= "</div>";
    return $html;
}
