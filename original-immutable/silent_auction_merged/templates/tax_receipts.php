<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tax Receipts</title>
    <style>
        body {
            margin: 0;
            font-family: DejaVu Sans, sans-serif;
        }
        .receipt {
            padding: 40px;
            page-break-after: always;
        }
        .receipt:last-child {
            page-break-after: auto;
        }
        .header-table {
            width: 100%;
            margin-bottom: 40px;
        }
        .header-table td {
            vertical-align: top;
        }
        .logo {
            width: 100px;
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
        .header-text h3 {
            margin: 0;
            font-size: 14px;
            font-weight: normal;
        }
        .items-table {
            width: 100%;
            margin-top: 10px;
            border-collapse: collapse;
        }
        .items-table td {
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }
        .footer-note {
            margin-top: 40px;
            text-align: center;
            font-size: 0.9em;
            color: #555;
        }
        .signature {
            margin-top: 60px;
        }
    </style>
</head>
<body>

<?php foreach ($donors_and_items_to_send_receipts as $data):
    $donor = $data['donor'];
    $items = $data['items'];
    $totalValue = 0;
?>

    <div class="receipt">
        <table class="header-table">
            <tr>
                <td>
                    <?php if (!empty($logoPath)): ?>
                        <img src="<?= htmlspecialchars($logoPath) ?>" alt="Logo" class="logo">
                    <?php endif; ?>
                </td>
                <td class="header-text">
                    <h1>Norfolk Public Schools</h1>
                    <h1>W. H. Taylor Elementary School</h1>
                    <h2>Home of the Owls</h2>
                    <h2>Parent Teacher Association</h2>
                    <h3>1122 W. Princess Anne Road</h3>
                    <h3>Norfolk, Virginia 23507</h3>
                </td>
            </tr>
        </table>

        <div style="margin-bottom: 20px;"><?= date('F j, Y') ?></div>

        <div style="margin-bottom: 20px;">
            Dear <?= htmlspecialchars($donor['ContactName']) ?>:
        </div>

        <div style="margin-bottom: 20px; line-height: 1.5;">
            <p>Thank you for your support of W. H. Taylor's PTA. Because of your generous donation, our PTA was able to help fund many important services for our school, as well as Taylor Families.</p>
            <p>We acknowledge the receipt of your donation that you generously contributed to the W. H. Taylor PTA.</p>
            <p><strong>Donor: <?= htmlspecialchars($donor['BusinessName'] ?: $donor['ContactName']) ?></strong></p>
        </div>

        <div>
            <strong>Donated Items:</strong>
            <table class="items-table">
                <?php foreach ($items as $item):
                    $totalValue += $item['RetailValue'];
                ?>
                <tr>
                    <td><?= htmlspecialchars($item['Description']) ?></td>
                    <td style="text-align: right;">Value: $<?= number_format($item['RetailValue'], 2) ?></td>
                </tr>
                <?php endforeach; ?>
                <tr>
                    <td style="padding-top: 10px;"><strong>Total:</strong></td>
                    <td style="text-align: right; padding-top: 10px;"><strong>$<?= number_format($totalValue, 2) ?></strong></td>
                </tr>
            </table>
        </div>

        <div class="footer-note">
            <p>W. H. Taylor Elementary School PTA is a non-profit 501 (c)(3) organization. Your gift(s) are tax deductible.</p>
            <p>No goods or services were received in return for this donation.</p>
        </div>

        <div class="signature">
            Sincerely,<br><br><br>
            Tamara Haines<br>
            W. H. Taylor PTA Silent Auction Chairperson<br>
        </div>
    </div>

<?php endforeach; ?>
</body>
</html>
