<?php
require_once __DIR__ . '/../paths.php';
include '../data/db_items.php';
include '../data/db_donors.php';
include 'form_field.php';
include 'select.php';
include 'form_actions.php';
?>

<?php
function __validate_item_form($values)
{
    $errors = (object)[];

    if (empty(trim($values->description ?? ''))) {
        $errors->description = "Description is required.";
    } elseif (strlen($values->description) > 75) {
        $errors->description = "Description cannot exceed 75 characters.";
    }

    if (!is_numeric($values->retailValue ?? '')) {
        $errors->retailValue = "Retail Value must be a number.";
    }

    if (empty($values->donorID) || !ctype_digit((string)$values->donorID)) {
        $errors->donorID = "Donor is required.";
    }

    if (!empty($values->lotID) && $values->lotID !== 'NULL' && !ctype_digit((string)$values->lotID)) {
        $errors->lotID = "Lot must be a valid selection.";
    }

    return empty((array)$errors) ? null : $errors;
}
?>

<?php
function render_item_form($item_id = null, $formWasEmpty = true, $values = null)
{
    $errors = null;
    $donors = get_donors_for_select();
    $lots = get_lot_descriptions();
    if ($donors === false) {
        $donors = [];
    }
    if ($lots === false) {
        $lots = [];
    }

    $donorOptions = [];
    foreach ($donors as $donor) {
        $label = donor_display_name($donor);
        if (!empty($donor['ContactName']) && $label !== $donor['ContactName']) {
            $label .= ' (' . $donor['ContactName'] . ')';
        } elseif (!empty($donor['ContactName'])) {
            $label = $donor['ContactName'];
        }
        $donorOptions[] = [
            'DonorID' => $donor['DonorID'],
            'Description' => $label,
        ];
    }

    if (!$formWasEmpty) {
        $errors = __validate_item_form($values);
        if (empty($errors)) {
            if (!empty($values->lotID) && $values->lotID === 'NULL') {
                $values->lotID = null;
            }
            if ($item_id) {
                $ok = update_item($item_id, $values);
                $param = $ok ? 'updated' : 'update_failed';
            } else {
                $ok = add_item($values);
                $param = $ok ? 'created' : 'create_failed';
            }
            $query = $ok ? "success=$param" : "error=$param";
            header("Location: " . BASE_URL . "/lots/items.php?$query");
            exit();
        }
    } else {
        if ($item_id) {
            $item = get_item_by_id($item_id);
            if (!$item) {
                header("Location: " . BASE_URL . "/lots/items.php?error=notfound");
                exit();
            }
            $values = (object)[
                'description' => $item['Description'] ?? '',
                'retailValue' => $item['RetailValue'] ?? '',
                'donorID' => $item['DonorID'] ?? '',
                'lotID' => $item['LotID'] ?? 'NULL',
            ];
        } else {
            $values = (object)[
                'description' => '',
                'retailValue' => '',
                'donorID' => '',
                'lotID' => 'NULL',
            ];
        }
    }

    $activeLotId = ($values->lotID === 'NULL' || $values->lotID === '' || $values->lotID === null) ? null : $values->lotID;

    $form = "<form class='c-form' action='edit_item.php' method='get'>";
    if ($item_id) {
        $form .= "<input type='hidden' name='ItemID' value='$item_id'>";
    }

    $form .= form_field("Description", "text", "Description", "Description", $values->description ?? "", $errors->description ?? "", "maxlength='75' required");
    $form .= form_field("Retail Value", "number", "RetailValue", "0.00", $values->retailValue ?? "", $errors->retailValue ?? "", "step='0.01' required");

    $form .= form_field_select('Donor', 'DonorID', $donorOptions, $values->donorID ?? '', 'DonorID', 'Description', $errors->donorID ?? '');

    $form .= form_field_select('Lot (optional)', 'LotID', $lots, $activeLotId, 'LotID', 'Description', $errors->lotID ?? '');

    $form .= render_form_actions($item_id ? 'Update Item' : 'Add Item', BASE_URL . '/lots/items.php');
    $form .= "</form>";

    return $form;
}
