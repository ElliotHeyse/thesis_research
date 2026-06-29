<?php

use PHPUnit\Framework\TestCase;

class ConfirmDeleteTest extends TestCase
{
    public function testRenderConfirmDeleteDonor(): void
    {
        $donor = [
            'DonorID' => 1,
            'BusinessName' => 'Acme Corp',
            'ContactName' => 'Jane Doe',
            'ContactEmail' => 'jane@acme.com',
            'City' => 'Austin',
        ];
        $html = render_confirm_delete('donor', $donor, '/cancel', '/confirm');
        $this->assertStringContainsString('Confirm Deletion', $html);
        $this->assertStringContainsString('Acme Corp', $html);
        $this->assertStringContainsString('Jane Doe', $html);
        $this->assertStringContainsString("href='/confirm'", $html);
        $this->assertStringContainsString('btn-danger', $html);
    }

    public function testRenderConfirmDeleteItem(): void
    {
        $item = [
            'ItemID' => 10,
            'Description' => 'Gift basket',
            'RetailValue' => 50,
            'DonorID' => 3,
        ];
        $html = render_confirm_delete('item', $item, '/cancel', '/confirm');
        $this->assertStringContainsString('Gift basket', $html);
        $this->assertStringContainsString('$50.00', $html);
    }
}
