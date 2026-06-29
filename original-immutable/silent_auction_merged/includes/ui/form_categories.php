<?php
require_once __DIR__ . '/../paths.php';
include '../data/db_categories.php';
include 'form_field.php';
include 'form_actions.php';
?>

<?php
function __validate_category_form($values)
{
    $errors = (object)[];

    // description
    try {
        $description = $values->description;
    } catch (Exception $e) {
        $description = "";
    }
    if (empty($description)) {
        $errors->description = "Description is required";
    } else if (strlen($description) > 255) {
        $errors->description = "Description must be less than 255 characters";
    } else if (!is_string($description)) {
        $errors->description = "Description must be a string";
    }

    return empty((array)$errors) ? null : $errors;
}
?>

<?php
function render_category_form($category_id = null, $formWasEmpty = True, $values = null)
{
    if (!$formWasEmpty) {
        $errors = __validate_category_form($values);
        if (empty($errors)) {
            if ($category_id) {
                update_category($category_id, $values);
            } else {
                add_category($values);
            }
            header("Location: " . BASE_URL . "/lots/categories.php");
            exit();
        } else {
            $description = $values->description;
        }
    } else {
        if ($category_id) {
            $category = get_category($category_id);
            $description = $category["Description"];
        } else {
            $category = null;
            $description = "";
        }
    }

    $form = "
    <form class='c-form' action='edit_category.php' method='get'>
        <input type='hidden' name='CategoryID' value='$category_id'>";

    $form .= form_field("Description", "text", "Description", "Description", $description, ($errors->description ?? ""));

    $form .= render_form_actions($category_id ? 'Update' : 'Add Category', BASE_URL . '/lots/categories.php');
    $form .= "</form>";

    return $form;
}
?>
