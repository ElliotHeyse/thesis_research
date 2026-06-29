<?php
require_once 'db_connect.php';
?>

<?php
function get_donors()
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $donors = [];
    try {
        $sql = "SELECT * FROM donor ORDER BY BusinessName, ContactName";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $donors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $donors;
}
?>

<?php
function get_donor($donor_id)
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $donor = null;
    try {
        $sql = "SELECT * FROM donor WHERE DonorID = :donor_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':donor_id', $donor_id, PDO::PARAM_INT);
        $stmt->execute();
        $donor = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $donor;
}
?>

<?php
function get_donors_for_select()
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $donors = [];
    try {
        $sql = "SELECT DonorID, BusinessName, ContactName FROM donor ORDER BY BusinessName, ContactName";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $donors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $donors;
}
?>

<?php
function get_donors_without_receipt()
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $donors = [];
    try {
        $sql = "SELECT d.*, COUNT(i.ItemID) AS TotalItems, SUM(i.RetailValue) AS TotalValue
                FROM donor d
                INNER JOIN item i ON d.DonorID = i.DonorID
                WHERE d.TaxReceipt = 0
                GROUP BY d.DonorID
                HAVING TotalItems > 0
                ORDER BY d.ContactName, d.BusinessName";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $donors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $donors;
}
?>

<?php
function get_donors_eligible_for_receipt()
{
    $allDonors = get_donors();
    if ($allDonors === false) {
        return false;
    }

    $eligible = [];
    foreach ($allDonors as $donor) {
        $items = get_items_by_donor_id($donor['DonorID']);
        if ($items && count($items) > 0 && empty($donor['TaxReceipt'])) {
            $eligible[] = $donor;
        }
    }
    return $eligible;
}
?>

<?php
function get_items_by_donor_id($donor_id)
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $items = [];
    try {
        $sql = "SELECT * FROM item WHERE DonorID = :donor_id ORDER BY Description";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':donor_id', $donor_id, PDO::PARAM_INT);
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
function donor_has_items($donor_id)
{
    $conn = db_connect('ro');
    if (!$conn) {
        return false;
    }

    $count = 0;
    try {
        $sql = "SELECT COUNT(*) AS count FROM item WHERE DonorID = :donor_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':donor_id', $donor_id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $count = (int)($result['count'] ?? 0);
    } catch (PDOException $e) {
        return false;
    }

    $conn = null;
    return $count > 0;
}
?>

<?php
function add_donor($values)
{
    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "INSERT INTO donor (
                    BusinessName, ContactName, ContactEmail, ContactTitle,
                    Address, City, State, ZipCode, TaxReceipt
                ) VALUES (
                    :businessName, :contactName, :contactEmail, :contactTitle,
                    :address, :city, :state, :zipCode, :taxReceipt
                )";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':businessName', $values->businessName);
        $stmt->bindParam(':contactName', $values->contactName);
        $stmt->bindParam(':contactEmail', $values->contactEmail);
        $stmt->bindParam(':contactTitle', $values->contactTitle);
        $stmt->bindParam(':address', $values->address);
        $stmt->bindParam(':city', $values->city);
        $stmt->bindParam(':state', $values->state);
        $stmt->bindParam(':zipCode', $values->zipCode);
        $taxReceipt = $values->taxReceipt ?? 0;
        $stmt->bindParam(':taxReceipt', $taxReceipt, PDO::PARAM_INT);
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
function update_donor($donor_id, $values)
{
    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "UPDATE donor SET
                    BusinessName = :businessName,
                    ContactName = :contactName,
                    ContactEmail = :contactEmail,
                    ContactTitle = :contactTitle,
                    Address = :address,
                    City = :city,
                    State = :state,
                    ZipCode = :zipCode,
                    TaxReceipt = :taxReceipt
                WHERE DonorID = :donor_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':donor_id', $donor_id, PDO::PARAM_INT);
        $stmt->bindParam(':businessName', $values->businessName);
        $stmt->bindParam(':contactName', $values->contactName);
        $stmt->bindParam(':contactEmail', $values->contactEmail);
        $stmt->bindParam(':contactTitle', $values->contactTitle);
        $stmt->bindParam(':address', $values->address);
        $stmt->bindParam(':city', $values->city);
        $stmt->bindParam(':state', $values->state);
        $stmt->bindParam(':zipCode', $values->zipCode);
        $taxReceipt = $values->taxReceipt ?? 0;
        $stmt->bindParam(':taxReceipt', $taxReceipt, PDO::PARAM_INT);
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
function delete_donor($donor_id)
{
    if (donor_has_items($donor_id)) {
        return false;
    }

    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "DELETE FROM donor WHERE DonorID = :donor_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':donor_id', $donor_id, PDO::PARAM_INT);
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
function mark_receipt_sent($donor_id)
{
    $conn = db_connect('rw');
    if (!$conn) {
        return false;
    }

    try {
        $sql = "UPDATE donor SET TaxReceipt = 1 WHERE DonorID = :donor_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':donor_id', $donor_id, PDO::PARAM_INT);
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
function donor_display_name($donor)
{
    if (!empty($donor['BusinessName'])) {
        return $donor['BusinessName'];
    }
    return $donor['ContactName'] ?? '';
}
?>
