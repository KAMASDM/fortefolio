import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
  pdf,
  Font,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import {
  documentData,
  getDocumentSections,
} from "../../../services/resumeDocument";
import regularFont from "@fontsource/poppins/files/poppins-latin-400-normal.woff";
import boldFont from "@fontsource/poppins/files/poppins-latin-600-normal.woff";

Font.register({
  family: "ResumePoppins",
  fonts: [
    { src: regularFont, fontWeight: 400 },
    { src: boldFont, fontWeight: 600 },
  ],
});
const styles = StyleSheet.create({
  page: {
    padding: 38,
    paddingBottom: 46,
    fontFamily: "ResumePoppins",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#253047",
  },
  header: { borderBottomWidth: 2, paddingBottom: 12, marginBottom: 14 },
  name: { fontSize: 24, fontWeight: 600 },
  title: { fontSize: 12, marginBottom: 5 },
  contact: { flexDirection: "row", flexWrap: "wrap", gap: 8, fontSize: 8 },
  heading: { fontSize: 11, fontWeight: 600, marginTop: 10, marginBottom: 5 },
  item: { marginBottom: 9 },
  itemTitle: { fontWeight: 600 },
  meta: { fontSize: 8, color: "#596579" },
  line: { marginTop: 3 },
  link: { fontSize: 8, color: "#3451a1" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 38,
    right: 38,
    textAlign: "right",
    fontSize: 8,
    color: "#596579",
  },
});
export const ResumePdfDocument = ({
  resumeData,
  colorScheme,
  presentation = {},
}) => {
  const info = documentData(resumeData, presentation).personalInfo;
  const color = colorScheme?.primary || "#6155b5";
  return (
    <Document
      title={info.fullName || "Resume"}
      author={info.fullName || undefined}
      language="en"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={[styles.header, { borderBottomColor: color }]}>
          <Text style={[styles.name, { color }]}>
            {info.fullName || "Resume"}
          </Text>
          {info.jobTitle && <Text style={styles.title}>{info.jobTitle}</Text>}
          <View style={styles.contact}>
            {[info.email, info.phone, info.location]
              .filter(Boolean)
              .map((value, i) => (
                <Text key={i}>{value}</Text>
              ))}
          </View>
          <View style={styles.contact}>
            {[info.linkedin, info.github, info.website]
              .filter(Boolean)
              .map((url, i) => (
                <Link key={i} src={url} style={styles.link}>
                  {url}
                </Link>
              ))}
          </View>
        </View>
        {info.summary && (
          <>
            <Text style={[styles.heading, { color }]} minPresenceAhead={30}>
              Profile
            </Text>
            <Text>{info.summary}</Text>
          </>
        )}
        {getDocumentSections(resumeData, presentation).map((section) => (
          <View key={section.key}>
            <Text style={[styles.heading, { color }]} minPresenceAhead={45}>
              {section.title}
            </Text>
            {section.items.map((item, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemTitle} minPresenceAhead={20}>
                  {item.title}
                </Text>
                {item.subtitle && <Text>{item.subtitle}</Text>}
                {item.meta && <Text style={styles.meta}>{item.meta}</Text>}
                {item.lines.map((line, i) => (
                  <Text key={i} style={styles.line} orphans={2} widows={2}>
                    {section.key === "experience" ? `• ${line}` : line}
                  </Text>
                ))}
                {item.link && (
                  <Link src={item.link} style={styles.link}>
                    {item.link}
                  </Link>
                )}
              </View>
            ))}
          </View>
        ))}
        <Text
          fixed
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
};
export const downloadResumePdf = async ({
  resumeData,
  colorScheme,
  presentation,
  fileName = "resume.pdf",
}) => {
  const blob = await pdf(
    <ResumePdfDocument
      resumeData={resumeData}
      colorScheme={colorScheme}
      presentation={presentation}
    />,
  ).toBlob();
  saveAs(blob, fileName);
};
