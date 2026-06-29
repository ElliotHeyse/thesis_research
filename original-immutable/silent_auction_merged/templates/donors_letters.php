<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Donor Letters</title>
    <style>
        body {
            margin: 0;
            font-family: DejaVu Sans, sans-serif;
        }
        .letter {
            padding: 40px;
            page-break-after: always;
        }
        .letter:last-child {
            page-break-after: auto;
        }
        .recipient-info {
            margin-bottom: 40px;
        }
        .salutation {
            margin-bottom: 20px;
        }
        .body {
            line-height: 1.6;
            text-align: justify;
        }
        .closing {
            margin-top: 40px;
        }
    </style>
</head>
<body>

<?php foreach ($donors_to_send_letters as $donor): ?>
    <div class="letter">
        <div class="recipient-info">
            <?= htmlspecialchars($donor['ContactName']) ?><br>
            <?php if (!empty($donor['BusinessName'])): ?>
                <?= htmlspecialchars($donor['BusinessName']) ?><br>
            <?php endif; ?>
            <?= htmlspecialchars($donor['Address']) ?><br>
            <?= htmlspecialchars($donor['City']) ?>, <?= htmlspecialchars($donor['State']) ?> <?= htmlspecialchars($donor['ZipCode']) ?>
        </div>

        <div class="salutation">
            Dear <?= htmlspecialchars($donor['ContactName']) ?>:
        </div>

        <div class="body">
            <p>W. H. Taylor Elementary School PTA will hold its annual Silent Auction, one of our major fundraising events. The Silent Auction provides much needed funds for many student enrichment programs and special requests from school staff. In previous years, Auction proceeds have funded classroom supplies, activities and fieldtrips, the PTA Cultural arts program, computers, and specialized reading programs. The Taylor PTA, in coordination with the Food Bank of Southeastern Virginia and Eastern Shore, helps provide children in our school at risk for hunger with backpacks full of enough food to tide the family over on weekends.</p>

            <p>Community support like yours is what helps make Taylor Elementary one of the most outstanding elementary schools in Norfolk. We plan to reach out to all Taylor families and to advertise to the greater Hampton Roads community for this year's Auction.</p>

            <p>Should you agree to make a contribution, we will be happy to display your promotional material during the Silent Auction. Additionally, all Silent Auction contributors will receive recognition in:</p>
            <ul>
                <li>Taylor Elementary PTA events and newsletter</li>
                <li>An exhibit located within our school</li>
                <li>Taylor Elementary PTA Website</li>
                <li>Taylor PTA Facebook</li>
                <li>Marketing posters placed throughout the community</li>
            </ul>

            <p>If you would like to participate in our Auction, please complete the enclosed Contribution Agreement and return it in the enclosed envelope in order to be included in the Auction Program.</p>

            <p>If you have any questions, or need additional information, please contact the Silent Auction Committee.</p>

            <p>Thank you in advance for your consideration of this request. We greatly appreciate your generosity.</p>
        </div>

        <div class="closing">
            Sincerely,<br><br><br>
            Tamara Haines<br>
            Chairman, Silent Auction Committee<br>
            W. H. Taylor Elementary School PTA<br>
            1122 W. Princess Anne Road<br>
            Norfolk, Virginia 23517
        </div>
    </div>
<?php endforeach; ?>
</body>
</html>
