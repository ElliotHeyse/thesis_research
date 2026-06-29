<?php

use PHPUnit\Framework\TestCase;

class PdfUtilTest extends TestCase
{
    public function testResolveAssetPathReturnsExistingFile(): void
    {
        require_once dirname(__DIR__) . '/includes/utils/pdf.php';

        $path = resolve_asset_path('assets/Tiger-icon-hi-res.webp');
        $this->assertNotSame('', $path);
        $this->assertFileExists($path);
    }

    public function testResolveAssetPathReturnsEmptyForMissingFile(): void
    {
        require_once dirname(__DIR__) . '/includes/utils/pdf.php';

        $path = resolve_asset_path('assets/does-not-exist.webp');
        $this->assertSame('', $path);
    }
}
