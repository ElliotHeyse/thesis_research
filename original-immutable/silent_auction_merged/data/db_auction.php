<?php
require_once 'db_connect.php';
?>

<?php
function get_items()
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $items = [];

    // get items, inlude category id (join lots)
    try {
        $sql = "SELECT i.ItemID, i.Description, i.RetailValue, l.CategoryID
            FROM item i
            LEFT JOIN lot l ON i.LotID = l.LotID;";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $items = array_merge($items, $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage(); // ! remove in production
        // TODO: handle error (design)
    }

    $conn = null;
    return $items;
}
?>

<?php
function get_category_descriptions()
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $category_descriptions = [];
    try {
        $sql = "SELECT CategoryID, Description FROM category;";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $category_descriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage(); // ! remove in production
        // TODO: handle error (design)
    }

    $conn = null;
    return $category_descriptions;
}
?>
