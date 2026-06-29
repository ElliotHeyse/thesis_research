<?php

use PHPUnit\Framework\TestCase;

class ButtonTest extends TestCase
{
    public function testRenderLinkButton(): void
    {
        $html = render_link_button('Add', '/test', 'success');
        $this->assertStringContainsString("class='btn btn-success'", $html);
        $this->assertStringContainsString("href='/test'", $html);
        $this->assertStringContainsString('Add', $html);
    }

    public function testRenderLinkButtonWithAttrs(): void
    {
        $html = render_link_button('Open', '/sheet', 'success', ['target' => '_blank']);
        $this->assertStringContainsString("target='_blank'", $html);
    }

    public function testRenderSubmitButton(): void
    {
        $html = render_submit_button('Save', 'success');
        $this->assertStringContainsString("type='submit'", $html);
        $this->assertStringContainsString("class='btn btn-success'", $html);
        $this->assertStringContainsString('Save', $html);
    }
}
