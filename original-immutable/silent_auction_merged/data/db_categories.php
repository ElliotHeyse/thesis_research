<?php
require_once 'db_connect.php';
?>

<?php
function get_categories()
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $categories = [];

    // get categories
    try {
        $sql = "SELECT * FROM category;";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $categories = array_merge($categories, $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $categories;
}
?>

<?php
function get_category($category_id)
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $category = null;

    try {
        $sql = "SELECT * FROM category WHERE CategoryID = :category_id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':category_id', $category_id, PDO::PARAM_INT);
        $stmt->execute();
        $category = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $category;
}
?>

<?php
function add_category($values)
{
    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "INSERT INTO category (Description) VALUES (:description);";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':description', $values->description, PDO::PARAM_STR);
        $stmt->execute();
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
}
?>

<?php
function update_category($category_id, $values)
{
    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "UPDATE category SET Description = :description WHERE CategoryID = :category_id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':description', $values->description, PDO::PARAM_STR);
        $stmt->bindParam(':category_id', $category_id, PDO::PARAM_INT);
        $stmt->execute();
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return true;
}
?>

<?php
function delete_category($category_id)
{
    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "DELETE FROM category WHERE CategoryID = :category_id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':category_id', $category_id, PDO::PARAM_INT);
        $stmt->execute();
    } catch (PDOException $e) {
        return false;
    }
    $conn = null;
}
?>