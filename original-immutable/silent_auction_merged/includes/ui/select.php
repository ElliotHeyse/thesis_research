<?php

function __select(
    string $label,
    string $name,
    array $options,
    $active_option_id,
    string $id_key_name,
    string $description_key_name,
    array $config = []
): string {
    $emptyValue = $config['emptyValue'] ?? 'NULL';
    $cssClass = $config['cssClass'] ?? '';
    $dataAttrs = $config['dataAttrs'] ?? [];
    $useNameAsId = $config['useNameAsId'] ?? false;

    $classAttr = $cssClass ? " class='" . htmlspecialchars($cssClass) . "'" : '';
    $dataAttrStr = '';
    foreach ($dataAttrs as $key => $value) {
        $dataAttrStr .= ' ' . htmlspecialchars($key) . "='" . htmlspecialchars((string)$value) . "'";
    }

    $idAttr = $useNameAsId ? " id='" . htmlspecialchars($name) . "'" : '';
    $result = "<select name='" . htmlspecialchars($name) . "'$classAttr$dataAttrStr$idAttr>";

    $isEmpty = ($active_option_id === null || $active_option_id === '' || $active_option_id === $emptyValue || $active_option_id === -1 || $active_option_id === '-1');
    $defaultLabel = $config['emptyLabel'] ?? ('--- No ' . strtolower($label) . ' selected ---');
    $default_option = "<option value='" . htmlspecialchars((string)$emptyValue) . "'";
    $default_option .= $isEmpty ? " selected" : "";
    $default_option .= ">" . htmlspecialchars($defaultLabel) . "</option>";
    $result .= $default_option;

    foreach ($options as $option) {
        $optionId = $option[$id_key_name];
        $selected = ($optionId == $active_option_id && !$isEmpty) ? " selected" : "";
        $result .= "<option value='" . htmlspecialchars((string)$optionId) . "'$selected>";
        $result .= htmlspecialchars((string)$option[$description_key_name]);
        $result .= "</option>";
    }
    $result .= "</select>";
    return $result;
}

function form_field_select(
    string $label,
    string $name,
    array $options,
    $activeId,
    string $idKey,
    string $labelKey,
    string $error = '',
    ?string $emptyLabel = null,
    array $config = []
): string {
    if ($emptyLabel !== null) {
        $config['emptyLabel'] = $emptyLabel;
    }
    $result = "<div class='c-form__field'>";
    $result .= "<label for='" . htmlspecialchars($name) . "'>" . htmlspecialchars($label) . "</label>";
    $result .= __select($label, $name, $options, $activeId, $idKey, $labelKey, $config);
    if (!empty($error)) {
        $result .= "<span class='c-form__error'>" . htmlspecialchars($error) . "</span>";
    }
    $result .= "</div>";
    return $result;
}
