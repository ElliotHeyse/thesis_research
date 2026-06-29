<?php

use PHPUnit\Framework\TestCase;

class EmptyStateTest extends TestCase
{
    public function testRenderEmptyStateInfo(): void
    {
        $html = render_empty_state('No items found', 'info');
        $this->assertStringContainsString('c-empty-state', $html);
        $this->assertStringContainsString('alert-info', $html);
        $this->assertStringContainsString('No items found', $html);
    }

    public function testRenderEmptyStateDanger(): void
    {
        $html = render_empty_state('Connection failed', 'danger');
        $this->assertStringContainsString('alert-danger', $html);
    }
}
