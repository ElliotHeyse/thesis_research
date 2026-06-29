<?php

use PHPUnit\Framework\TestCase;

class FormParseTest extends TestCase
{
    protected function setUp(): void
    {
        $_GET = [];
    }

    public function testParseFormGet(): void
    {
        $_GET = [
            'Description' => '  Test item  ',
            'RetailValue' => '25.00',
            'DonorID' => '5',
        ];
        $values = parse_form_get([
            'description' => 'Description',
            'retailValue' => 'RetailValue',
            'donorID' => 'DonorID',
        ]);
        $this->assertSame('Test item', $values->description);
        $this->assertSame('25.00', $values->retailValue);
        $this->assertSame('5', $values->donorID);
    }

    public function testFormWasSubmitted(): void
    {
        $_GET = ['Description' => 'x'];
        $this->assertTrue(form_was_submitted(['Description']));
        $this->assertTrue(form_was_submitted(['Description', 'Other']));
        $this->assertFalse(form_was_submitted(['Other']));
    }

    public function testParseFormGetLotBidderMapping(): void
    {
        $_GET = [
            'Description' => 'Lot A',
            'CategoryID' => '2',
            'BidderID' => '7',
            'HighestBid' => '100',
        ];
        $values = parse_form_get([
            'description' => 'Description',
            'category_id' => 'CategoryID',
            'bidder_id' => 'BidderID',
            'highest_bid' => 'HighestBid',
        ]);
        $this->assertSame('2', $values->category_id);
        $this->assertSame('7', $values->bidder_id);
    }
}
