<?php
if (!defined('BASE_URL')) {
    require_once __DIR__ . '/../includes/paths.php';
}

$retailValue = floatval($item['RetailValue'] ?? 0);
$startingBid = isset($startingBid) ? $startingBid : ($retailValue > 0 ? ($retailValue * 0.5) : 10.00);
$bidIncrement = isset($bidIncrement) ? $bidIncrement : 5.00;
$numberOfBidRows = isset($numberOfBidRows) ? $numberOfBidRows : 15;
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Bidding Sheet - Item <?= htmlspecialchars($item['ItemID']) ?></title>
    <style>
        body {
            margin: 0;
            font-family: DejaVu Sans, sans-serif;
        }

        .bidding-sheet {
            padding: 40px;
        }

        .header-table {
            width: 100%;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
        }

        .header-table td {
            vertical-align: top;
        }

        .item-number {
            font-size: 28px;
            font-weight: bold;
            color: #333;
        }

        .header-text {
            text-align: right;
        }

        .header-text h1 {
            margin: 0;
            font-size: 18px;
        }

        .header-text h2 {
            margin: 0;
            font-size: 16px;
            font-weight: normal;
        }

        .item-info {
            margin-bottom: 25px;
        }

        .info-row {
            margin-bottom: 12px;
            font-size: 14px;
        }

        .info-label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
        }

        .bidding-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .bidding-table th {
            background-color: #f5f5f5;
            border: 1px solid #333;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }

        .bidding-table td {
            border: 1px solid #333;
            padding: 10px;
            height: 40px;
        }
    </style>
</head>

<body>

    <div class="bidding-sheet">
        <table class="header-table">
            <tr>
                <td>
                    <div class="item-number">Item #<?= htmlspecialchars($item['ItemID']) ?></div>
                </td>
                <td class="header-text">
                    <h1>Norfolk Public Schools</h1>
                    <h1>W. H. Taylor Elementary School</h1>
                    <h2>Home of the Owls</h2>
                    <h2>Parent Teacher Association</h2>
                </td>
            </tr>
        </table>

        <div class="item-info">
            <?php if (!empty($item['LotID']) && !empty($lot)): ?>
                <div class="info-row">
                    <span class="info-label">Lot #:</span>
                    <span><?= htmlspecialchars($lot['LotID']) ?></span>
                </div>
            <?php elseif (!empty($item['LotID'])): ?>
                <div class="info-row">
                    <span class="info-label">Lot #:</span>
                    <span><?= htmlspecialchars($item['LotID']) ?></span>
                </div>
            <?php else: ?>
                <div class="info-row">
                    <span class="info-label">Lot #:</span>
                    <span>N/A</span>
                </div>
            <?php endif; ?>

            <div class="info-row">
                <span class="info-label">Item Description:</span>
                <span><?= htmlspecialchars($item['Description'] ?? 'N/A') ?></span>
            </div>

            <?php if (!empty($category)): ?>
                <div class="info-row">
                    <span class="info-label">Category:</span>
                    <span><?= htmlspecialchars($category['Description']) ?></span>
                </div>
            <?php endif; ?>

            <div class="info-row">
                <span class="info-label">Donated by:</span>
                <span>
                    <?php
                    $donorName = 'N/A';
                    if (!empty($item['BusinessName'])) {
                        $donorName = htmlspecialchars($item['BusinessName']);
                    } elseif (!empty($item['ContactName'])) {
                        $donorName = htmlspecialchars($item['ContactName']);
                    }
                    echo $donorName;
                    ?>
                </span>
            </div>

            <div class="info-row">
                <span class="info-label">Retail Value:</span>
                <span>$<?= number_format($retailValue, 2) ?></span>
            </div>

            <div class="info-row">
                <span class="info-label">Starting Bid:</span>
                <span>$<?= number_format($startingBid, 2) ?></span>
            </div>

            <div class="info-row">
                <span class="info-label">Bid Increment:</span>
                <span>$<?= number_format($bidIncrement, 2) ?></span>
            </div>
        </div>

        <table class="bidding-table">
            <thead>
                <tr>
                    <th style="width: 150px;">Bidder Number</th>
                    <th>Bid Amount</th>
                </tr>
            </thead>
            <tbody>
                <?php for ($i = 0; $i < $numberOfBidRows; $i++): ?>
                    <tr>
                        <td></td>
                        <td></td>
                    </tr>
                <?php endfor; ?>
            </tbody>
        </table>
    </div>

</body>

</html>
