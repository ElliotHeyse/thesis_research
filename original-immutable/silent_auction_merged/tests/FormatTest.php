<?php

use PHPUnit\Framework\TestCase;

class FormatTest extends TestCase
{
    public function testFormatOrDash(): void
    {
        $this->assertSame('-', format_or_dash(null));
        $this->assertSame('-', format_or_dash(''));
        $this->assertSame('Acme', format_or_dash('Acme'));
        $this->assertSame('&lt;script&gt;', format_or_dash('<script>'));
    }

    public function testFormatYesNo(): void
    {
        $this->assertSame('Yes', format_yes_no(true));
        $this->assertSame('No', format_yes_no(false));
        $this->assertSame('Yes', format_yes_no(1));
    }

    public function testFormatCurrency(): void
    {
        $this->assertSame('-', format_currency(null));
        $this->assertSame('-', format_currency(''));
        $this->assertSame('$12.50', format_currency(12.5));
        $this->assertSame('$1,234.56', format_currency(1234.56));
    }
}
