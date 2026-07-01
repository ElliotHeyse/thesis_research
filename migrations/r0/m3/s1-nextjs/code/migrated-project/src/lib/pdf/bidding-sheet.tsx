import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { BiddingSheetData } from "@/lib/services/item.service";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  headerRow: {
    flexDirection: "row",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#333",
  },
  itemNumber: { fontSize: 22, fontWeight: "bold" },
  headerText: { flex: 1, textAlign: "right" },
  headerTitle: { fontSize: 14, marginBottom: 2 },
  headerSub: { fontSize: 12 },
  infoRow: { flexDirection: "row", marginBottom: 8, fontSize: 12 },
  infoLabel: { width: 130, fontWeight: "bold" },
  table: { marginTop: 20 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#333",
  },
  tableHeaderCell: { padding: 10, fontWeight: "bold", borderRightWidth: 1, borderColor: "#333" },
  tableRow: { flexDirection: "row", borderWidth: 1, borderTopWidth: 0, borderColor: "#333", minHeight: 36 },
  tableCell: { padding: 10, borderRightWidth: 1, borderColor: "#333" },
});

export function BiddingSheetDocument({ data }: { data: BiddingSheetData }) {
  const { item, lot, category, startingBid, bidIncrement, rows } = data;
  const retailValue = Number(item.RetailValue ?? 0);
  const donorName =
    item.BusinessName || item.ContactName || "N/A";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerRow}>
          <Text style={styles.itemNumber}>Item #{item.ItemID}</Text>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Norfolk Public Schools</Text>
            <Text style={styles.headerTitle}>W. H. Taylor Elementary School</Text>
            <Text style={styles.headerSub}>Home of the Owls</Text>
            <Text style={styles.headerSub}>Parent Teacher Association</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Lot #:</Text>
          <Text>{item.LotID ?? "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Item Description:</Text>
          <Text>{item.Description ?? "N/A"}</Text>
        </View>
        {category ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category:</Text>
            <Text>{category.Description}</Text>
          </View>
        ) : null}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Donated by:</Text>
          <Text>{donorName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Retail Value:</Text>
          <Text>${retailValue.toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Starting Bid:</Text>
          <Text>${startingBid.toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Bid Increment:</Text>
          <Text>${bidIncrement.toFixed(2)}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: 150 }]}>Bidder Number</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, borderRightWidth: 0 }]}>Bid Amount</Text>
          </View>
          {Array.from({ length: rows }).map((_, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: 150 }]}> </Text>
              <Text style={[styles.tableCell, { flex: 1, borderRightWidth: 0 }]}> </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
