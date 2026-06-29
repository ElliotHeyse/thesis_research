<?php

use PHPUnit\Framework\TestCase;

class ActionLinksTest extends TestCase
{
    public function testRenderActionLinks(): void
    {
        $html = render_action_links([
            'Edit' => '/edit',
            'Delete' => '/delete',
        ]);
        $this->assertStringContainsString("<a href='/edit'>Edit</a>", $html);
        $this->assertStringContainsString("<a href='/delete'>Delete</a>", $html);
        $this->assertStringContainsString(' | ', $html);
    }
}
