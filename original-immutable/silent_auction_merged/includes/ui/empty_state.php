<?php

function render_empty_state(string $message, string $variant = 'info'): string
{
    $class = 'c-empty-state alert alert-' . ($variant === 'danger' ? 'danger' : 'info');
    return "<div class='$class'>" . htmlspecialchars($message) . "</div>";
}
