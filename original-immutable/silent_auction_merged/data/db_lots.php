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
        echo "Error: " . $e->getMessage(); // ! remove in production
        // TODO: handle error (design)
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

    try {
        $sql = "SELECT Description FROM category WHERE CategoryID = :category_id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':category_id', $category_id, PDO::PARAM_INT);
        $stmt->execute();
        $category = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage(); // ! remove in production
        // TODO: handle error (design)
    }

    $conn = null;
    return $category;
}
?>

<?php
function get_lots()
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $lots = [];

    // get lots with winner and category
    try {
        $sql = "SELECT l.LotID, l.Description, l.WinningBid, w.Name AS 'Winner', l.Delivered, c.Description AS 'Category'
            FROM lot l
            LEFT JOIN bidder w ON l.WinningBidder = w.BidderID
            LEFT JOIN category c ON l.CategoryID = c.CategoryID
            ORDER BY l.LotID ASC;";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $lots = array_merge($lots, $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage(); // ! remove in production
        // TODO: handle error (design)
    }

    $conn = null;
    return $lots;
}
?>

<?php
function get_lot($lot_id)
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    // get lot with winner and category
    try {
        $sql = "SELECT LotID, Description, CategoryID, WinningBid, WinningBidder, Delivered, Image
            FROM lot
            WHERE LotID = :lot_id;";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':lot_id', $lot_id, PDO::PARAM_INT);
        $stmt->execute();
        $lot = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage(); // ! remove in production
        // TODO: handle error (design)
    }

    $conn = null;
    return $lot;
}
?>

<?php
function get_bidders()
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $bidders = [];

    // get bidders
    try {
        $sql = "SELECT BidderID, Name FROM bidder;";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $bidders = array_merge($bidders, $stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage(); // ! remove in production
        // TODO: handle error (design)
    }

    $conn = null;
    return $bidders;
}
?>





<?php
function add_lot($values)
{
    echo "<br>STACKTRACE: add_lot()"; // ! remove in production
    echo "<br>DEBUG: values: " . json_encode($values); // ! remove in production
    $adjusted_values = (object)[];
    $adjusted_values->description = $values->description;

    // Convert empty strings, "NULL" strings, and falsy values to actual NULL
    $adjusted_values->category_id = (empty($values->category_id) || $values->category_id === "NULL" ? null : (int)$values->category_id);
    $adjusted_values->highest_bid = (empty($values->highest_bid) || $values->highest_bid === "NULL" ? null : (float)$values->highest_bid);
    $adjusted_values->bidder_id = (empty($values->bidder_id) || $values->bidder_id === "NULL" ? null : (int)$values->bidder_id);
    $adjusted_values->delivered = ($values->delivered == "on" ? "1" : "0");
    $adjusted_values->image = (empty($values->image) || $values->image === "NULL" ? null : $values->image);
    // echo "<br>DEBUG: adjusted_values: " . json_encode($adjusted_values); // ! remove in production

    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "INSERT INTO lot (Description, CategoryID, WinningBid, WinningBidder, Delivered, Image) VALUES (:description, :category_id, :highest_bid, :winning_bidder_id, :delivered, :image);";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':description', $adjusted_values->description, PDO::PARAM_STR);

        // Handle NULL values properly with PDO
        if ($adjusted_values->category_id === null) {
            $stmt->bindValue(':category_id', null, PDO::PARAM_NULL);
        } else {
            $stmt->bindParam(':category_id', $adjusted_values->category_id, PDO::PARAM_INT);
        }

        if ($adjusted_values->highest_bid === null) {
            $stmt->bindValue(':highest_bid', null, PDO::PARAM_NULL);
        } else {
            $stmt->bindParam(':highest_bid', $adjusted_values->highest_bid, PDO::PARAM_STR);
        }

        if ($adjusted_values->bidder_id === null) {
            $stmt->bindValue(':winning_bidder_id', null, PDO::PARAM_NULL);
        } else {
            $stmt->bindParam(':winning_bidder_id', $adjusted_values->bidder_id, PDO::PARAM_INT);
        }

        $stmt->bindParam(':delivered', $adjusted_values->delivered, PDO::PARAM_INT);
        $stmt->bindParam(':image', $adjusted_values->image, PDO::PARAM_STR);
        $stmt->execute();
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage(); // ! remove in production
        // TODO: handle error (design)
    }
    $conn = null;
}
?>

<?php
function update_lot($lot_id, $values)
{
    echo "<br>STACKTRACE: update_lot()"; // ! remove in production
    echo "<br>DEBUG: values: " . json_encode($values); // ! remove in production
    $adjusted_values = (object)[];
    $adjusted_values->description = $values->description;

    // Convert empty strings, "NULL" strings, and falsy values to actual NULL
    $adjusted_values->category_id = (empty($values->category_id) || $values->category_id === "NULL" ? null : (int)$values->category_id);
    $adjusted_values->highest_bid = (empty($values->highest_bid) || $values->highest_bid === "NULL" ? null : (float)$values->highest_bid);
    $adjusted_values->bidder_id = (empty($values->bidder_id) || $values->bidder_id === "NULL" ? null : (int)$values->bidder_id);
    $adjusted_values->delivered = ($values->delivered == "on" ? "1" : "0");
    $adjusted_values->image = (empty($values->image) || $values->image === "NULL" ? null : $values->image);

    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "UPDATE lot SET Description = :description, CategoryID = :category_id, WinningBid = :highest_bid, WinningBidder = :winning_bidder_id, Delivered = :delivered, Image = :image WHERE LotID = :lot_id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':description', $adjusted_values->description, PDO::PARAM_STR);
        $stmt->bindParam(':category_id', $adjusted_values->category_id, PDO::PARAM_INT);
        $stmt->bindParam(':highest_bid', $adjusted_values->highest_bid, PDO::PARAM_STR);
        $stmt->bindParam(':winning_bidder_id', $adjusted_values->bidder_id, PDO::PARAM_INT);
        $stmt->bindParam(':delivered', $adjusted_values->delivered, PDO::PARAM_INT);
        $stmt->bindParam(':image', $adjusted_values->image, PDO::PARAM_STR);
        $stmt->bindParam(':lot_id', $lot_id, PDO::PARAM_INT);
        $stmt->execute();
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage(); // ! remove in production
        // TODO: handle error (design)
    }
    $conn = null;
}
?>

<?php
function delete_lot($lot_id)
{
    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "DELETE FROM lot WHERE LotID = :lot_id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':lot_id', $lot_id, PDO::PARAM_INT);
        $stmt->execute();
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage(); // ! remove in production
        // TODO: handle error (design)
    }
    $conn = null;
}
?>
