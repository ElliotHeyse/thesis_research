<?php

function render_link_button(string $label, string $href, string $variant = 'success', array $attrs = []): string
{
    $class = 'btn btn-' . htmlspecialchars($variant);
    $attrStr = '';
    foreach ($attrs as $key => $value) {
        $attrStr .= ' ' . htmlspecialchars($key) . "='" . htmlspecialchars((string)$value) . "'";
    }
    return "<a href='" . htmlspecialchars($href) . "' class='$class'$attrStr>" . htmlspecialchars($label) . "</a>";
}

function render_submit_button(string $label, string $variant = 'success', array $attrs = []): string
{
    $class = 'btn btn-' . htmlspecialchars($variant);
    $attrStr = '';
    foreach ($attrs as $key => $value) {
        $attrStr .= ' ' . htmlspecialchars($key) . "='" . htmlspecialchars((string)$value) . "'";
    }
    return "<button type='submit' class='$class'$attrStr>" . htmlspecialchars($label) . "</button>";
}
