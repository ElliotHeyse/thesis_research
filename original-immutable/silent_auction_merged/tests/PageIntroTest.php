<?php

use PHPUnit\Framework\TestCase;

class PageIntroTest extends TestCase
{
    public function testRenderPageIntro(): void
    {
        $html = render_page_intro('Select donors to generate letters.');
        $this->assertStringContainsString('c-page-intro', $html);
        $this->assertStringContainsString('Select donors to generate letters.', $html);
    }
}
