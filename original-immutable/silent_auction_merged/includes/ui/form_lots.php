<?php
require_once __DIR__ . '/../paths.php';
include '../data/db_lots.php';
include 'form_field.php';
include 'select.php';
include 'form_actions.php';
?>

<?php
function __validate_lot_form($values)
{
    $errors = (object)[];

    $description = $values->description ?? '';
    if (empty($description)) {
        $errors->description = "Description is required";
    } else if (strlen($description) > 255) {
        $errors->description = "Description must be less than 255 characters";
    } else if (!is_string($description)) {
        $errors->description = "Description must be a string";
    }

    $highest_bid = $values->highest_bid ?? '';
    if (!empty($highest_bid)) {
        if (!is_numeric($highest_bid)) {
            $errors->highest_bid = "Highest bid must be a number";
        } else if ($highest_bid < 0) {
            $errors->highest_bid = "Highest bid must be greater than 0";
        }
    }

    $image = $values->image ?? '';
    if (!empty($image)) {
        if (!filter_var($image, FILTER_VALIDATE_URL)) {
            $errors->image = "Image URL must be a valid URL";
        } else if (!preg_match('/^https?:\/\/.+$/', $image)) {
            $errors->image = "Image URL must start with http:// or https://";
        }
    }

    return empty((array)$errors) ? null : $errors;
}
?>

<?php
function render_lot_form($lot_id = null, $formWasEmpty = true, $values = null)
{
    $errors = null;
    $categories = get_categories();
    $bidders = get_bidders();

    if (!$formWasEmpty) {
        $errors = __validate_lot_form($values);
        if (empty($errors)) {
            if ($lot_id) {
                update_lot($lot_id, $values);
            } else {
                add_lot($values);
            }
            header("Location: " . BASE_URL . "/lots/lots.php");
            exit();
        }
        $description = $values->description ?? '';
        $category_id = $values->category_id ?? '';
        $highest_bid = $values->highest_bid ?? '';
        $bidder_id = $values->bidder_id ?? '';
        $delivered = $values->delivered ?? '';
        $image = $values->image ?? '';
    } else {
        if ($lot_id) {
            $lot = get_lot($lot_id);
            $description = $lot["Description"];
            $category_id = $lot["CategoryID"];
            $highest_bid = $lot["WinningBid"];
            $bidder_id = $lot["WinningBidder"];
            $delivered = $lot["Delivered"];
            $image = $lot["Image"];
        } else {
            $description = "";
            $category_id = "";
            $highest_bid = "";
            $bidder_id = "";
            $delivered = "";
            $image = "";
        }
    }

    $form = "<form class='c-form' action='edit_lot.php' method='get'>";
    $form .= "<input type='hidden' name='LotID' value='$lot_id'>";

    $form .= form_field("Description", "text", "Description", "Description", $description, $errors?->description ?? "");
    $form .= form_field_select('Category', 'CategoryID', $categories, $category_id, 'CategoryID', 'Description');
    $form .= form_field("Highest Bid", "number", "HighestBid", "No highest bid yet", $highest_bid, $errors?->highest_bid ?? "", "step='0.01'");
    $form .= form_field_select('Bidder', 'BidderID', $bidders, $bidder_id, 'BidderID', 'Name');
    $form .= form_field("Delivered", "checkbox", "Delivered", "", $delivered, $errors?->delivered ?? "");
    $form .= form_field("Image URL", "text", "Image", "Image URL", $image, $errors?->image ?? "");

    $form .= render_form_actions($lot_id ? 'Update' : 'Add Lot', BASE_URL . '/lots/lots.php');
    $form .= "</form>";

    return $form;
}
