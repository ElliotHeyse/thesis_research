<?php
include 'auction_item.php';
?>

<?php
function render_auction_category($category_name, $items)
{
    $result = "<h3>" . $category_name . "</h3>";
    $result .= "<ul>";
    foreach ($items as $item) {
        $result .= "<li>" . render_auction_item($item) . "</li>";
    }
    $result .= "</ul>";
    return $result;
}
?>
