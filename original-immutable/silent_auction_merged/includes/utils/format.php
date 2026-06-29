<?php

function format_or_dash($value): string
{
    if ($value === null || $value === '') {
        return '-';
    }
    return htmlspecialchars((string)$value);
}

function format_yes_no($bool): string
{
    return $bool ? 'Yes' : 'No';
}

function format_currency($amount): string
{
    if ($amount === null || $amount === '') {
        return '-';
    }
    return '$' . number_format((float)$amount, 2);
}
