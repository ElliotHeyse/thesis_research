<?php

require_once __DIR__ . '/../paths.php';

function discard_buffered_output(): void
{
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
}

function resolve_asset_path(string $relativePath): string
{
    $fullPath = realpath(__DIR__ . '/../../' . ltrim($relativePath, '/'));
    if (!$fullPath) {
        return '';
    }

    return str_replace('\\', '/', $fullPath);
}

function render_template_to_html(string $templatePath, array $vars = []): string
{
    extract($vars, EXTR_SKIP);
    ob_start();
    include $templatePath;
    return (string)ob_get_clean();
}

function stream_pdf(string $html, string $filename): void
{
    require_once __DIR__ . '/../../vendor/autoload.php';

    $options = new Dompdf\Options();
    $options->set('isRemoteEnabled', false);

    $dompdf = new Dompdf\Dompdf($options);
    $dompdf->loadHtml($html);
    $dompdf->setPaper('letter', 'portrait');

    ob_start();
    $dompdf->render();
    ob_end_clean();

    $pdf = $dompdf->output();

    discard_buffered_output();

    $safeFilename = str_replace(["\n", "'"], '', basename($filename, '.pdf')) . '.pdf';

    header('Content-Type: application/pdf');
    header('Content-Length: ' . strlen($pdf));
    header('Content-Disposition: attachment; filename="' . $safeFilename . '"');

    echo $pdf;
    exit;
}
