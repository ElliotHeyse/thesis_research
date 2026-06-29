<?php
require_once __DIR__ . '/header.php';
require_once __DIR__ . '/footer.php';
require_once __DIR__ . '/flash_messages.php';
require_once __DIR__ . '/lots_subnav.php';
require_once __DIR__ . '/donors_subnav.php';

function render_page(string $title, string $content, array $options = []): string
{
    $subnav = $options['subnav'] ?? null;
    $flash = $options['flash'] ?? false;

    $html = render_header($title);

    if ($subnav === 'lots') {
        $html .= render_lots_subnav();
    } elseif ($subnav === 'donors') {
        $html .= render_donors_subnav();
    }

    if ($flash) {
        $html .= render_flash_messages();
    }

    $html .= $content;
    $html .= render_footer();

    return $html;
}
