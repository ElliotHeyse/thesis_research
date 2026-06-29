<?php

function render_page_intro(string $text): string
{
    return "<p class='c-page-intro'>" . htmlspecialchars($text) . "</p>";
}
