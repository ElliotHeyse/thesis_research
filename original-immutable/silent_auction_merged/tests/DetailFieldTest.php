<?php

use PHPUnit\Framework\TestCase;

class DetailFieldTest extends TestCase
{
    public function testRenderDetailField(): void
    {
        $html = render_detail_field('Description', 'Test item', '--yes');
        $this->assertStringContainsString('c-lot-details__field', $html);
        $this->assertStringContainsString('Description:', $html);
        $this->assertStringContainsString('Test item', $html);
        $this->assertStringContainsString('--yes', $html);
    }

    public function testRenderDetailPanel(): void
    {
        $html = render_detail_panel('Lot 1', [
            'Description' => 'A painting',
            'Delivered' => ['value' => 'Yes', 'modifier' => '--yes'],
        ]);
        $this->assertStringContainsString('Lot 1', $html);
        $this->assertStringContainsString('A painting', $html);
        $this->assertStringContainsString('--yes', $html);
    }
}
