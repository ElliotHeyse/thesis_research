<?php

require_once __DIR__ . '/select.php';

function select_lot(array $lot_descriptions, $item_id, $active_lot_id): string
{
    if (empty($active_lot_id)) {
        $active_lot_id = -1;
    }

    return __select(
        'lot',
        'LotID[' . $item_id . ']',
        $lot_descriptions,
        $active_lot_id,
        'LotID',
        'Description',
        [
            'emptyValue' => '-1',
            'emptyLabel' => '--- No lot selected ---',
        ]
    );
}
