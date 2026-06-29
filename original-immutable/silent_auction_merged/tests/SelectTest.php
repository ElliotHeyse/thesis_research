<?php

use PHPUnit\Framework\TestCase;

class SelectTest extends TestCase
{
    public function testFormFieldSelect(): void
    {
        $options = [
            ['CategoryID' => 1, 'Description' => 'Art'],
            ['CategoryID' => 2, 'Description' => 'Food'],
        ];
        $html = form_field_select('Category', 'CategoryID', $options, 1, 'CategoryID', 'Description');
        $this->assertStringContainsString("class='c-form__field'", $html);
        $this->assertStringContainsString('<label for=', $html);
        $this->assertStringContainsString("value='1' selected", $html);
        $this->assertStringContainsString('Art', $html);
    }

    public function testFormFieldSelectWithError(): void
    {
        $html = form_field_select('Donor', 'DonorID', [], '', 'DonorID', 'Description', 'Donor is required.');
        $this->assertStringContainsString('c-form__error', $html);
        $this->assertStringContainsString('Donor is required.', $html);
    }

    public function testSelectLotWrapper(): void
    {
        $lots = [['LotID' => 5, 'Description' => 'Lot A']];
        $html = select_lot($lots, 42, 5);
        $this->assertStringContainsString("name='LotID[42]'", $html);
        $this->assertStringContainsString("value='5' selected", $html);
    }
}
