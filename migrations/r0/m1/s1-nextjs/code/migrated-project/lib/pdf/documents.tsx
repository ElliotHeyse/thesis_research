import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { Donor, Item } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 11 },
  letter: { marginBottom: 20 },
  recipient: { marginBottom: 30 },
  salutation: { marginBottom: 15 },
  body: { lineHeight: 1.6, textAlign: "justify" },
  closing: { marginTop: 30 },
  paragraph: { marginBottom: 10 },
  listItem: { marginLeft: 15, marginBottom: 4 },
});

export function DonorLettersDocument({ donors }: { donors: Donor[] }) {
  return (
    <Document>
      {donors.map((donor) => (
        <Page key={donor.DonorID} size="LETTER" style={styles.page}>
          <View style={styles.letter}>
            <View style={styles.recipient}>
              <Text>{donor.ContactName}</Text>
              {donor.BusinessName ? <Text>{donor.BusinessName}</Text> : null}
              <Text>{donor.Address}</Text>
              <Text>
                {donor.City}, {donor.State} {donor.ZipCode}
              </Text>
            </View>
            <Text style={styles.salutation}>
              Dear {donor.ContactName}:
            </Text>
            <View style={styles.body}>
              <Text style={styles.paragraph}>
                W. H. Taylor Elementary School PTA will hold its annual Silent
                Auction, one of our major fundraising events. The Silent Auction
                provides much needed funds for many student enrichment programs
                and special requests from school staff.
              </Text>
              <Text style={styles.paragraph}>
                Community support like yours is what helps make Taylor Elementary
                one of the most outstanding elementary schools in Norfolk.
              </Text>
              <Text style={styles.paragraph}>
                Should you agree to make a contribution, we will be happy to
                display your promotional material during the Silent Auction.
              </Text>
              <Text style={styles.paragraph}>
                If you would like to participate in our Auction, please complete
                the enclosed Contribution Agreement and return it in the enclosed
                envelope in order to be included in the Auction Program.
              </Text>
              <Text style={styles.paragraph}>
                Thank you in advance for your consideration of this request. We
                greatly appreciate your generosity.
              </Text>
            </View>
            <View style={styles.closing}>
              <Text>Sincerely,</Text>
              <Text> </Text>
              <Text>Tamara Haines</Text>
              <Text>Chairman, Silent Auction Committee</Text>
              <Text>W. H. Taylor Elementary School PTA</Text>
              <Text>1122 W. Princess Anne Road</Text>
              <Text>Norfolk, Virginia 23517</Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}

export function TaxReceiptsDocument({
  data,
  logoPath,
}: {
  data: { donor: Donor; items: Item[] }[];
  logoPath?: string;
}) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Document>
      {data.map(({ donor, items }) => {
        const totalValue = items.reduce(
          (sum, item) => sum + Number(item.RetailValue),
          0,
        );
        return (
          <Page key={donor.DonorID} size="LETTER" style={styles.page}>
            <View style={{ flexDirection: "row", marginBottom: 30 }}>
              {logoPath ? (
                <Image src={logoPath} style={{ width: 80, height: 80 }} />
              ) : null}
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text>Norfolk Public Schools</Text>
                <Text>W. H. Taylor Elementary School</Text>
                <Text>Home of the Owls</Text>
                <Text>Parent Teacher Association</Text>
                <Text>1122 W. Princess Anne Road</Text>
                <Text>Norfolk, Virginia 23507</Text>
              </View>
            </View>
            <Text style={{ marginBottom: 15 }}>{today}</Text>
            <Text style={{ marginBottom: 15 }}>
              Dear {donor.ContactName}:
            </Text>
            <Text style={styles.paragraph}>
              Thank you for your support of W. H. Taylor&apos;s PTA. Because of
              your generous donation, our PTA was able to help fund many
              important services for our school, as well as Taylor Families.
            </Text>
            <Text style={styles.paragraph}>
              Donor: {donor.BusinessName || donor.ContactName}
            </Text>
            <Text style={{ marginTop: 10, marginBottom: 5 }}>
              Donated Items:
            </Text>
            {items.map((item) => (
              <View
                key={item.ItemID}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #eee",
                  paddingVertical: 4,
                }}
              >
                <Text>{item.Description}</Text>
                <Text>
                  Value: ${Number(item.RetailValue).toFixed(2)}
                </Text>
              </View>
            ))}
            <Text style={{ marginTop: 10 }}>
              Total: ${totalValue.toFixed(2)}
            </Text>
            <Text style={{ marginTop: 30, textAlign: "center", fontSize: 9 }}>
              W. H. Taylor Elementary School PTA is a non-profit 501 (c)(3)
              organization. Your gift(s) are tax deductible.
            </Text>
            <View style={styles.closing}>
              <Text>Sincerely,</Text>
              <Text> </Text>
              <Text>Tamara Haines</Text>
              <Text>W. H. Taylor PTA Silent Auction Chairperson</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
}

export function BiddingSheetDocument({
  item,
  lot,
  category,
  startingBid,
  bidIncrement,
  numberOfBidRows,
}: {
  item: Item;
  lot: { LotID: number } | null;
  category: { Description: string } | null;
  startingBid: number;
  bidIncrement: number;
  numberOfBidRows: number;
}) {
  const donorName =
    item.BusinessName || item.ContactName || "N/A";
  const rows = Array.from({ length: numberOfBidRows }, (_, i) => i);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottom: "2px solid #333",
            paddingBottom: 15,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Item #{item.ItemID}
          </Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text>Norfolk Public Schools</Text>
            <Text>W. H. Taylor Elementary School</Text>
            <Text>Home of the Owls</Text>
            <Text>Parent Teacher Association</Text>
          </View>
        </View>
        <Text>Lot #: {lot ? lot.LotID : "N/A"}</Text>
        <Text>Item Description: {item.Description ?? "N/A"}</Text>
        {category ? <Text>Category: {category.Description}</Text> : null}
        <Text>Donated by: {donorName}</Text>
        <Text>Retail Value: ${Number(item.RetailValue).toFixed(2)}</Text>
        <Text>Starting Bid: ${startingBid.toFixed(2)}</Text>
        <Text>Bid Increment: ${bidIncrement.toFixed(2)}</Text>
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              border: "1px solid #333",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Text style={{ width: "40%", padding: 8 }}>Bidder Number</Text>
            <Text style={{ width: "60%", padding: 8 }}>Bid Amount</Text>
          </View>
          {rows.map((i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                border: "1px solid #333",
                minHeight: 30,
              }}
            >
              <Text style={{ width: "40%", padding: 8 }}> </Text>
              <Text style={{ width: "60%", padding: 8 }}> </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
