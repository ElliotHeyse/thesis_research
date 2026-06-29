<?php

use PHPUnit\Framework\TestCase;

class SubnavTest extends TestCase
{
    public function testRenderSubnavActiveTab(): void
    {
        $tabs = [
            'items' => ['label' => 'Items', 'href' => '/lots/items.php'],
            'lots' => ['label' => 'Lots', 'href' => '/lots/lots.php'],
        ];
        $html = render_subnav($tabs, 'lots');
        $this->assertStringContainsString('c-lot-subnav--active', $html);
        $this->assertStringContainsString("href='/lots/lots.php' class='c-lot-subnav c-lot-subnav--active'", $html);
        $this->assertStringContainsString("href='/lots/items.php' class='c-lot-subnav'", $html);
        $this->assertStringNotContainsString("href='/lots/items.php' class='c-lot-subnav c-lot-subnav--active'", $html);
    }

    public function testRenderSubnavWithAction(): void
    {
        $tabs = ['donors' => ['label' => 'All Donors', 'href' => '/donors/']];
        $html = render_subnav($tabs, 'donors', "<a href='/add'>Add</a>");
        $this->assertStringContainsString("href='/add'", $html);
    }
}
