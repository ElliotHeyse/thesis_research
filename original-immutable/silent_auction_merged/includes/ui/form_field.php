<?php
function __input_text($name, $placeholder, $value, $attributes)
{
    $input = "<input type='text' name='" . $name . "' placeholder='" . $placeholder . "' value='" . $value . "'";
    if (!empty($attributes)) {
        return $input . " " . $attributes . ">";
    } else {
        return $input . ">";
    }
}

function __input_number($name, $placeholder, $value, $attributes)
{

    $input = "<input type='number' name='" . $name . "' placeholder='" . $placeholder . "' value='" . $value . "'";
    if (!empty($attributes)) {
        return $input . " " . $attributes . ">";
    } else {
        return $input . ">";
    }
}

function __input_checkbox($name, $value, $attributes)
{
    // TODO: fix on/off issue when submitted
    $hidden = "<input type='hidden' name='" . $name . "' value='off'>";
    $input = "<input type='checkbox' name='" . $name . "'" . ($value == 'on' ? " checked" : "") . "'";
    if (!empty($attributes)) {
        return $hidden . $input . " " . $attributes . ">";
    } else {
        return $hidden . $input . ">";
    }
}
?>

<?php
function form_field($label, $type, $name, $placeholder = "", $value = "", $error = "", $attributes = "")
{
    $result = "<div class='c-form__field" . ($type == "checkbox" ? " u-flex-row" : "") . "'>";
    $result .= "<label for='" . $name . "'>" . $label . "</label>";
    switch ($type) {
        case "number":
            $result .= __input_number($name, $placeholder, $value, $attributes);
            break;
        case "checkbox":
            $result .= __input_checkbox($name, $value, $attributes);
            break;
        default:
            $result .= __input_text($name, $placeholder, $value, $attributes);
            break;
    }
    if (!empty($error)) {
        $result .= "<span class='c-form__error'>" . $error . "</span>";
    }
    $result .= "</div>";

    return $result;
}
?>
