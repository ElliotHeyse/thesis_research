import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Donor } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  recipient: { marginBottom: 40 },
  salutation: { marginBottom: 20 },
  body: { lineHeight: 1.6, textAlign: "justify" },
  paragraph: { marginBottom: 10 },
  closing: { marginTop: 40 },
});

function DonorLetterPage({ donor }: { donor: Donor }) {
  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.recipient}>
        <Text>{donor.ContactName}</Text>
        {donor.BusinessName ? <Text>{donor.BusinessName}</Text> : null}
        <Text>{donor.Address}</Text>
        <Text>
          {donor.City}, {donor.State} {donor.ZipCode}
        </Text>
      </View>
      <Text style={styles.salutation}>Dear {donor.ContactName}:</Text>
      <View style={styles.body}>
        <Text style={styles.paragraph}>
          W. H. Taylor Elementary School PTA will hold its annual Silent Auction,
          one of our major fundraising events. The Silent Auction provides much
          needed funds for many student enrichment programs and special requests
          from school staff. In previous years, Auction proceeds have funded
          classroom supplies, activities and fieldtrips, the PTA Cultural arts
          program, computers, and specialized reading programs. The Taylor PTA,
          in coordination with the Food Bank of Southeastern Virginia and Eastern
          Shore, helps provide children in our school at risk for hunger with
          backpacks full of enough food to tide the family over on weekends.
        </Text>
        <Text style={styles.paragraph}>
          Community support like yours is what helps make Taylor Elementary one
          of the most outstanding elementary schools in Norfolk. We plan to reach
          out to all Taylor families and to advertise to the greater Hampton
          Roads community for this year&apos;s Auction.
        </Text>
        <Text style={styles.paragraph}>
          Should you agree to make a contribution, we will be happy to display
          your promotional material during the Silent Auction. Additionally, all
          Silent Auction contributors will receive recognition in: Taylor
          Elementary PTA events and newsletter; an exhibit located within our
          school; Taylor Elementary PTA Website; Taylor PTA Facebook; and
          marketing posters placed throughout the community.
        </Text>
        <Text style={styles.paragraph}>
          If you would like to participate in our Auction, please complete the
          enclosed Contribution Agreement and return it in the enclosed envelope
          in order to be included in the Auction Program.
        </Text>
        <Text style={styles.paragraph}>
          If you have any questions, or need additional information, please
          contact the Silent Auction Committee.
        </Text>
        <Text style={styles.paragraph}>
          Thank you in advance for your consideration of this request. We greatly
          appreciate your generosity.
        </Text>
      </View>
      <View style={styles.closing}>
        <Text>Sincerely,</Text>
        <Text>{"\n\n"}</Text>
        <Text>Tamara Haines</Text>
        <Text>Chairman, Silent Auction Committee</Text>
        <Text>W. H. Taylor Elementary School PTA</Text>
        <Text>1122 W. Princess Anne Road</Text>
        <Text>Norfolk, Virginia 23517</Text>
      </View>
    </Page>
  );
}

export function DonorLettersDocument({ donors }: { donors: Donor[] }) {
  return (
    <Document>
      {donors.map((donor) => (
        <DonorLetterPage key={donor.DonorID} donor={donor} />
      ))}
    </Document>
  );
}
