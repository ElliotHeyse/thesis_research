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

    // get items without lot id
    try {
        $sql1 = "SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID, d.BusinessName, l.Description AS 'LotDescription'
            FROM item i
            LEFT JOIN donor d ON i.DonorID = d.DonorID
            LEFT JOIN lot l ON i.LotID = l.LotID
            WHERE i.LotID IS NULL
            ORDER BY i.ItemID ASC;";

        $stmt1 = $conn->prepare($sql1);
        $stmt1->execute();
        $items = array_merge($items, $stmt1->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        return false;
    }

    // get items with lot id
    try {
        $sql2 = "SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID, d.BusinessName, l.Description AS 'LotDescription'
            FROM item i
            LEFT JOIN donor d ON i.DonorID = d.DonorID
            LEFT JOIN lot l ON i.LotID = l.LotID
            WHERE i.LotID IS NOT NULL
            ORDER BY i.ItemID ASC;";

        $stmt2 = $conn->prepare($sql2);
        $stmt2->execute();
        $items = array_merge($items, $stmt2->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $items;
}
?>

<?php
function get_lot_descriptions()
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $lot_descriptions = [];
    try {
        $sql = "SELECT LotID, Description FROM lot;";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $lot_descriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $lot_descriptions;
}
?>

<?php
function get_items_by_lot_id($lot_id)
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $items = [];

    try {
        $sql = "SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID, 
                       d.BusinessName, d.ContactName
                FROM item i
                LEFT JOIN donor d ON i.DonorID = d.DonorID
                WHERE i.LotID = :lot_id
                ORDER BY i.ItemID ASC;";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':lot_id', $lot_id, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $items;
}
?>

<?php
function get_item_by_id($item_id)
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $item = null;

    try {
        $sql = "SELECT i.ItemID, i.Description, i.RetailValue, i.DonorID, i.LotID,
                       d.BusinessName, d.ContactName, d.ContactEmail, d.ContactTitle,
                       l.Description AS LotDescription, l.CategoryID
                FROM item i
                LEFT JOIN donor d ON i.DonorID = d.DonorID
                LEFT JOIN lot l ON i.LotID = l.LotID
                WHERE i.ItemID = :item_id;";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':item_id', $item_id, PDO::PARAM_INT);
        $stmt->execute();
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $item;
}
?>

<?php
/**
 * Get lot information by lot ID
 * Used by bidding sheet generation
 */
function get_lot_for_bidding_sheet($lot_id)
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $lot = null;

    try {
        $sql = "SELECT LotID, Description, CategoryID, WinningBid, WinningBidder, Delivered, Image
                FROM lot
                WHERE LotID = :lot_id;";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':lot_id', $lot_id, PDO::PARAM_INT);
        $stmt->execute();
        $lot = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $lot;
}
?>

<?php
/**
 * Get category information by category ID
 * Used by bidding sheet generation
 */
function get_category_for_bidding_sheet($category_id)
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $category = null;

    try {
        $sql = "SELECT CategoryID, Description
                FROM category
                WHERE CategoryID = :category_id;";

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
function modify_items($modifiedItems)
{
    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    $itemIDs = [];
    $params = [];
    $sql = "UPDATE item SET LotID = CASE";
    $paramIndex = 1;

    foreach ($modifiedItems as $modifiedItem) {
        $itemID = $modifiedItem['itemID'];
        $newLotID = $modifiedItem['newLotID'];

        // Use placeholder for ItemID in WHEN clause
        $sql .= " WHEN ItemID = :item_id_$paramIndex THEN ";
        $params["item_id_$paramIndex"] = $itemID;

        if ($newLotID == -1) {
            $sql .= "NULL";
        } else {
            // Use placeholder for newLotID
            $sql .= ":lot_id_$paramIndex";
            $params["lot_id_$paramIndex"] = $newLotID;
        }

        $itemIDs[] = $itemID;
        $paramIndex++;
    }

    $sql .= " ELSE LotID END WHERE ItemID IN (";

    // Build placeholders for IN clause
    $inPlaceholders = [];
    foreach ($itemIDs as $index => $itemID) {
        $placeholder = ":in_item_$index";
        $inPlaceholders[] = $placeholder;
        $params["in_item_$index"] = $itemID;
    }

    $sql .= implode(", ", $inPlaceholders);
    $sql .= ");";

    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
}
?>

<?php
function add_item($values)
{
    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "INSERT INTO item (Description, RetailValue, DonorID, LotID)
                VALUES (:description, :retailValue, :donorID, :lotID)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':description', $values->description);
        $stmt->bindParam(':retailValue', $values->retailValue);
        $stmt->bindParam(':donorID', $values->donorID, PDO::PARAM_INT);
        $lotID = (!empty($values->lotID) && $values->lotID !== 'NULL') ? (int)$values->lotID : null;
        if ($lotID === null) {
            $stmt->bindValue(':lotID', null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(':lotID', $lotID, PDO::PARAM_INT);
        }
        $stmt->execute();
    } catch (PDOException $e) {
        $conn = null;
        return false;
    }

    $conn = null;
    return true;
}
?>

<?php
function update_item($item_id, $values)
{
    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "UPDATE item SET
                    Description = :description,
                    RetailValue = :retailValue,
                    DonorID = :donorID,
                    LotID = :lotID
                WHERE ItemID = :item_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':item_id', $item_id, PDO::PARAM_INT);
        $stmt->bindParam(':description', $values->description);
        $stmt->bindParam(':retailValue', $values->retailValue);
        $stmt->bindParam(':donorID', $values->donorID, PDO::PARAM_INT);
        $lotID = (!empty($values->lotID) && $values->lotID !== 'NULL') ? (int)$values->lotID : null;
        if ($lotID === null) {
            $stmt->bindValue(':lotID', null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(':lotID', $lotID, PDO::PARAM_INT);
        }
        $stmt->execute();
    } catch (PDOException $e) {
        $conn = null;
        return false;
    }

    $conn = null;
    return true;
}
?>

<?php
function delete_item($item_id)
{
    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "DELETE FROM item WHERE ItemID = :item_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':item_id', $item_id, PDO::PARAM_INT);
        $stmt->execute();
    } catch (PDOException $e) {
        $conn = null;
        return false;
    }

    $conn = null;
    return true;
}
?>
