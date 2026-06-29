<?php

function parse_form_get(array $fieldMap): object
{
    $values = (object)[];
    foreach ($fieldMap as $prop => $getKey) {
        if (isset($_GET[$getKey])) {
            $values->{$prop} = is_string($_GET[$getKey]) ? trim($_GET[$getKey]) : $_GET[$getKey];
        }
    }
    return $values;
}

function form_was_submitted(array $triggerKeys): bool
{
    foreach ($triggerKeys as $key) {
        if (isset($_GET[$key])) {
            return true;
        }
    }
    return false;
}
