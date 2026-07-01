import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Donor, Item } from "@/lib/types";
import { donorDisplayName } from "@/lib/utils/format";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", marginBottom: 40 },
  logo: { width: 80 },
  headerText: { flex: 1, textAlign: "right" },
  headerTitle: { fontSize: 14, marginBottom: 2 },
  headerSub: { fontSize: 12 },
  date: { marginBottom: 20 },
  paragraph: { marginBottom: 10, lineHeight: 1.5 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 5,
  },
  footer: { marginTop: 40, textAlign: "center", fontSize: 10, color: "#555" },
  signature: { marginTop: 60 },
});

function ReceiptPage({
  donor,
  items,
  logoPath,
}: {
  donor: Donor;
  items: Item[];
  logoPath?: string;
}) {
  const totalValue = items.reduce(
    (sum, item) => sum + Number(item.RetailValue),
    0,
  );
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.headerRow}>
        <View>
          {logoPath ? <Image src={logoPath} style={styles.logo} /> : null}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Norfolk Public Schools</Text>
          <Text style={styles.headerTitle}>W. H. Taylor Elementary School</Text>
          <Text style={styles.headerSub}>Home of the Owls</Text>
          <Text style={styles.headerSub}>Parent Teacher Association</Text>
          <Text style={styles.headerSub}>1122 W. Princess Anne Road</Text>
          <Text style={styles.headerSub}>Norfolk, Virginia 23507</Text>
        </View>
      </View>
      <Text style={styles.date}>{today}</Text>
      <Text style={styles.paragraph}>Dear {donor.ContactName}:</Text>
      <Text style={styles.paragraph}>
        Thank you for your support of W. H. Taylor&apos;s PTA. Because of your
        generous donation, our PTA was able to help fund many important services
        for our school, as well as Taylor Families.
      </Text>
      <Text style={styles.paragraph}>
        We acknowledge the receipt of your donation that you generously
        contributed to the W. H. Taylor PTA.
      </Text>
      <Text style={styles.paragraph}>
        Donor: {donorDisplayName(donor)}
      </Text>
      <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Donated Items:</Text>
      {items.map((item) => (
        <View key={item.ItemID} style={styles.itemRow}>
          <Text>{item.Description}</Text>
          <Text>Value: ${Number(item.RetailValue).toFixed(2)}</Text>
        </View>
      ))}
      <View style={styles.itemRow}>
        <Text style={{ fontWeight: "bold" }}>Total:</Text>
        <Text style={{ fontWeight: "bold" }}>${totalValue.toFixed(2)}</Text>
      </View>
      <View style={styles.footer}>
        <Text>
          W. H. Taylor Elementary School PTA is a non-profit 501 (c)(3)
          organization. Your gift(s) are tax deductible.
        </Text>
        <Text>No goods or services were received in return for this donation.</Text>
      </View>
      <View style={styles.signature}>
        <Text>Sincerely,</Text>
        <Text>{"\n\n"}</Text>
        <Text>Tamara Haines</Text>
        <Text>W. H. Taylor PTA Silent Auction Chairperson</Text>
      </View>
    </Page>
  );
}

export function TaxReceiptsDocument({
  receipts,
  logoPath,
}: {
  receipts: { donor: Donor; items: Item[] }[];
  logoPath?: string;
}) {
  return (
    <Document>
      {receipts.map(({ donor, items }) => (
        <ReceiptPage
          key={donor.DonorID}
          donor={donor}
          items={items}
          logoPath={logoPath}
        />
      ))}
    </Document>
  );
}
