<?php

use PHPUnit\Framework\TestCase;

class FormActionsTest extends TestCase
{
    public function testRenderFormActionsWithCancel(): void
    {
        $html = render_form_actions('Save', '/cancel');
        $this->assertStringContainsString("type='submit'", $html);
        $this->assertStringContainsString('Save', $html);
        $this->assertStringContainsString("href='/cancel'", $html);
        $this->assertStringContainsString('Cancel', $html);
    }

    public function testRenderFormActionsWithoutCancel(): void
    {
        $html = render_form_actions('Submit');
        $this->assertStringContainsString('Submit', $html);
        $this->assertStringNotContainsString('Cancel', $html);
    }
}
