<?php
require_once __DIR__ . '/../paths.php';
include '../data/db_donors.php';
include 'form_field.php';
include 'form_actions.php';
?>

<?php
function __validate_donor_form($values, $isEdit = false)
{
    $errors = (object)[];

    if (strlen($values->businessName ?? '') > 75) {
        $errors->businessName = "Business Name cannot exceed 75 characters.";
    }
    if (empty(trim($values->contactName ?? ''))) {
        $errors->contactName = "Contact Name is required.";
    } elseif (strlen($values->contactName) > 75) {
        $errors->contactName = "Contact Name cannot exceed 75 characters.";
    }
    if (strlen($values->contactTitle ?? '') > 75) {
        $errors->contactTitle = "Contact Title cannot exceed 75 characters.";
    }
    if (strlen($values->address ?? '') > 75) {
        $errors->address = "Address cannot exceed 75 characters.";
    }
    if (strlen($values->city ?? '') > 30) {
        $errors->city = "City cannot exceed 30 characters.";
    }
    if (strlen($values->state ?? '') > 2) {
        $errors->state = "State cannot exceed 2 characters.";
    }
    if (strlen($values->zipCode ?? '') > 5) {
        $errors->zipCode = "Zip Code cannot exceed 5 characters.";
    }
    if (!empty($values->contactEmail)) {
        if (strlen($values->contactEmail) > 200) {
            $errors->contactEmail = "Email cannot exceed 200 characters.";
        } elseif (!filter_var($values->contactEmail, FILTER_VALIDATE_EMAIL)) {
            $errors->contactEmail = "Invalid email format.";
        }
    }
    if (!empty($values->zipCode) && !ctype_digit($values->zipCode)) {
        $errors->zipCode = "Zip Code must be numeric.";
    }

    return empty((array)$errors) ? null : $errors;
}
?>

<?php
function render_donor_form($donor_id = null, $formWasEmpty = true, $values = null)
{
    $errors = null;

    if (!$formWasEmpty) {
        $errors = __validate_donor_form($values, (bool)$donor_id);
        if (empty($errors)) {
            $values->taxReceipt = ($values->taxReceipt ?? 'off') === 'on' ? 1 : 0;
            if ($donor_id) {
                $ok = update_donor($donor_id, $values);
                $param = $ok ? 'updated' : 'update_failed';
            } else {
                $ok = add_donor($values);
                $param = $ok ? 'created' : 'create_failed';
            }
            $query = $ok ? "success=$param" : "error=$param";
            header("Location: " . BASE_URL . "/donors/index.php?$query");
            exit();
        }
    } else {
        if ($donor_id) {
            $donor = get_donor($donor_id);
            if (!$donor) {
                header("Location: " . BASE_URL . "/donors/index.php?error=notfound");
                exit();
            }
            $values = (object)[
                'businessName' => $donor['BusinessName'] ?? '',
                'contactName' => $donor['ContactName'] ?? '',
                'contactEmail' => $donor['ContactEmail'] ?? '',
                'contactTitle' => $donor['ContactTitle'] ?? '',
                'address' => $donor['Address'] ?? '',
                'city' => $donor['City'] ?? '',
                'state' => $donor['State'] ?? '',
                'zipCode' => $donor['ZipCode'] ?? '',
                'taxReceipt' => !empty($donor['TaxReceipt']) ? 'on' : 'off',
            ];
        } else {
            $values = (object)[
                'businessName' => '',
                'contactName' => '',
                'contactEmail' => '',
                'contactTitle' => '',
                'address' => '',
                'city' => '',
                'state' => '',
                'zipCode' => '',
                'taxReceipt' => 'off',
            ];
        }
    }

    $form = "<form class='c-form' action='edit_donor.php' method='get'>";
    if ($donor_id) {
        $form .= "<input type='hidden' name='DonorID' value='$donor_id'>";
    }

    $form .= form_field("Business Name", "text", "BusinessName", "Business Name", $values->businessName ?? "", $errors->businessName ?? "", "maxlength='75'");
    $form .= form_field("Contact Name", "text", "ContactName", "Contact Name", $values->contactName ?? "", $errors->contactName ?? "", "maxlength='75' required");
    $form .= form_field("Email", "text", "ContactEmail", "Email", $values->contactEmail ?? "", $errors->contactEmail ?? "", "maxlength='200'");
    $form .= form_field("Contact Title", "text", "ContactTitle", "Contact Title", $values->contactTitle ?? "", $errors->contactTitle ?? "", "maxlength='75'");
    $form .= form_field("Address", "text", "Address", "Address", $values->address ?? "", $errors->address ?? "", "maxlength='75'");
    $form .= form_field("City", "text", "City", "City", $values->city ?? "", $errors->city ?? "", "maxlength='30'");
    $form .= form_field("State", "text", "State", "State", $values->state ?? "", $errors->state ?? "", "maxlength='2'");
    $form .= form_field("Zip Code", "text", "ZipCode", "Zip Code", $values->zipCode ?? "", $errors->zipCode ?? "", "maxlength='5'");

    if ($donor_id) {
        $form .= form_field("Tax Receipt Sent", "checkbox", "TaxReceipt", "", $values->taxReceipt ?? "off", "");
    }

    $form .= render_form_actions($donor_id ? 'Update Donor' : 'Add Donor', BASE_URL . '/donors/index.php');
    $form .= "</form>";

    return $form;
}
