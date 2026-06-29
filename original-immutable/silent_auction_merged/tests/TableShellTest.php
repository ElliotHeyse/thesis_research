<?php

use PHPUnit\Framework\TestCase;

class TableShellTest extends TestCase
{
    public function testRenderTable(): void
    {
        $html = render_table('<tr><th>ID</th></tr>', '<tr><td>1</td></tr>');
        $this->assertStringContainsString("class='template-table'", $html);
        $this->assertStringContainsString('<thead>', $html);
        $this->assertStringContainsString('<tbody>', $html);
    }

    public function testRenderDataTableConnectionFailed(): void
    {
        $html = render_data_table('<tr></tr>', '', false, 'No items');
        $this->assertStringContainsString('Connection failed', $html);
        $this->assertStringContainsString('alert-danger', $html);
    }

    public function testRenderDataTableEmpty(): void
    {
        $html = render_data_table('<tr></tr>', '', [], 'No items found');
        $this->assertStringContainsString('No items found', $html);
        $this->assertStringContainsString('alert-info', $html);
    }

    public function testRenderDataTableWithData(): void
    {
        $html = render_data_table('<tr><th>ID</th></tr>', '<tr><td>1</td></tr>', [['id' => 1]], 'Empty');
        $this->assertStringContainsString('template-table', $html);
        $this->assertStringContainsString('<td>1</td>', $html);
    }
}
