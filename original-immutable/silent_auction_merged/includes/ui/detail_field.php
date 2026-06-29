<?php

function render_detail_field(string $label, string $value, string $modifier = ''): string
{
    $valueClass = 'c-lot-details__value';
    if ($modifier !== '') {
        $valueClass .= ' c-lot-details__value' . htmlspecialchars($modifier);
    }
    return "<div class='c-lot-details__field'>"
        . "<span class='c-lot-details__label'>" . htmlspecialchars($label) . ":</span> "
        . "<span class='$valueClass'>" . $value . "</span>"
        . "</div>";
}

function render_detail_panel(string $title, array $fields): string
{
    $html = "<div class='c-lot-details o-container'>";
    $html .= "<h3 class='c-lot-details__title'>" . htmlspecialchars($title) . "</h3>";
    $html .= "<div class='c-lot-details__content'><div class='c-lot-details__info'>";

    foreach ($fields as $label => $field) {
        if (is_array($field)) {
            $value = $field['value'] ?? '';
            $modifier = $field['modifier'] ?? '';
            $html .= render_detail_field($label, $value, $modifier);
        } else {
            $html .= render_detail_field($label, (string)$field);
        }
    }

    $html .= "</div></div></div>";
    return $html;
}
