import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const defaultPalette = {
  primary: "#1976d2",
  secondary: "#0d47a1",
  accent: "#bbdefb",
  text: "#263238",
  background: "#ffffff",
};

const createStyles = (palette) =>
  StyleSheet.create({
    page: {
      paddingTop: 28,
      paddingBottom: 28,
      paddingHorizontal: 28,
      backgroundColor: palette.background,
      color: palette.text,
      fontSize: 10.5,
      fontFamily: "Helvetica",
      lineHeight: 1.4,
    },
    header: {
      borderBottomWidth: 2,
      borderBottomColor: palette.primary,
      paddingBottom: 12,
      marginBottom: 14,
    },
    name: {
      fontSize: 24,
      fontFamily: "Helvetica-Bold",
      color: palette.primary,
      marginBottom: 4,
    },
    title: {
      fontSize: 12,
      color: palette.secondary,
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    contactItem: {
      fontSize: 9,
      color: "#4b5563",
    },
    section: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      color: palette.primary,
      marginBottom: 6,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: palette.accent,
    },
    sectionBody: {
      gap: 6,
    },
    summary: {
      fontSize: 10.5,
      lineHeight: 1.5,
    },
    item: {
      marginBottom: 8,
      paddingBottom: 6,
      borderBottomWidth: 0.5,
      borderBottomColor: "#e5e7eb",
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 8,
      marginBottom: 2,
    },
    itemTitleBlock: {
      flexGrow: 1,
      flexShrink: 1,
    },
    itemTitle: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      color: palette.secondary,
    },
    itemSubtitle: {
      fontSize: 10,
      color: "#374151",
      marginTop: 1,
    },
    itemMeta: {
      fontSize: 9,
      color: "#6b7280",
      textAlign: "right",
      width: 120,
      flexShrink: 0,
    },
    description: {
      fontSize: 10,
      color: palette.text,
      lineHeight: 1.45,
      marginTop: 4,
    },
    bulletList: {
      marginTop: 5,
      gap: 3,
    },
    bulletRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 5,
    },
    bullet: {
      width: 8,
      fontFamily: "Helvetica-Bold",
      color: palette.primary,
    },
    bulletText: {
      flex: 1,
      fontSize: 9.8,
      lineHeight: 1.4,
    },
    skillGroup: {
      marginBottom: 5,
    },
    skillLabel: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: palette.secondary,
      marginBottom: 2,
    },
    skillText: {
      fontSize: 9.6,
      color: palette.text,
      lineHeight: 1.4,
    },
    projectLink: {
      color: palette.primary,
      fontSize: 9,
      marginTop: 3,
      textDecoration: "none",
    },
    footerNote: {
      marginTop: 10,
      fontSize: 8.5,
      color: "#6b7280",
    },
  });

const safeText = (value) => (value == null ? "" : String(value).trim());

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return safeText(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const formatRange = (startDate, endDate, current) => {
  const start = formatDate(startDate);
  const end = current ? "Present" : formatDate(endDate);
  if (start && end) return `${start} - ${end}`;
  return start || end || "";
};

const renderBullets = (items, styles) => {
  const bulletItems = Array.isArray(items)
    ? items.map((item) => safeText(item)).filter(Boolean)
    : [];

  if (!bulletItems.length) return null;

  return (
    <View style={styles.bulletList}>
      {bulletItems.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const ResumePdfDocument = ({ resumeData, colorScheme }) => {
  const palette = { ...defaultPalette, ...(colorScheme || {}) };
  const styles = createStyles(palette);

  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = [],
    references = [],
  } = resumeData || {};

  const contactItems = [
    safeText(personalInfo.email),
    safeText(personalInfo.phone),
    safeText(personalInfo.location),
    safeText(personalInfo.linkedin),
    safeText(personalInfo.github),
    safeText(personalInfo.website || personalInfo.portfolio),
  ].filter(Boolean);

  return (
    <Document title={`${safeText(personalInfo.fullName) || "Resume"}`}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.name}>{safeText(personalInfo.fullName) || "Your Name"}</Text>
          {safeText(personalInfo.jobTitle) ? (
            <Text style={styles.title}>{safeText(personalInfo.jobTitle)}</Text>
          ) : null}
          <View style={styles.contactRow}>
            {contactItems.map((item, index) => (
              <Text key={`${item}-${index}`} style={styles.contactItem}>
                {item}
              </Text>
            ))}
          </View>
        </View>

        {safeText(personalInfo.summary) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.summary}>{safeText(personalInfo.summary)}</Text>
          </View>
        ) : null}

        {experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.sectionBody}>
              {experience.map((item, index) => (
                <View key={`exp-${index}`} style={styles.item} wrap={false}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemTitleBlock}>
                      <Text style={styles.itemTitle}>{safeText(item.position) || "Position"}</Text>
                      <Text style={styles.itemSubtitle}>
                        {[safeText(item.company), safeText(item.location)].filter(Boolean).join(" | ")}
                      </Text>
                    </View>
                    <Text style={styles.itemMeta}>
                      {formatRange(item.startDate, item.endDate, item.current)}
                    </Text>
                  </View>
                  {safeText(item.description) ? (
                    <Text style={styles.description}>{safeText(item.description)}</Text>
                  ) : null}
                  {renderBullets(item.responsibilities, styles)}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <View style={styles.sectionBody}>
              {projects.map((item, index) => (
                <View key={`project-${index}`} style={styles.item} wrap={false}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemTitleBlock}>
                      <Text style={styles.itemTitle}>{safeText(item.title) || "Project"}</Text>
                      {safeText(item.technologies) ? (
                        <Text style={styles.itemSubtitle}>{safeText(item.technologies)}</Text>
                      ) : null}
                    </View>
                    <Text style={styles.itemMeta}>
                      {formatRange(item.startDate, item.endDate, item.current)}
                    </Text>
                  </View>
                  {safeText(item.description) ? (
                    <Text style={styles.description}>{safeText(item.description)}</Text>
                  ) : null}
                  {safeText(item.link) ? (
                    <Link src={safeText(item.link)} style={styles.projectLink}>
                      {safeText(item.link)}
                    </Link>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.sectionBody}>
              {education.map((item, index) => (
                <View key={`edu-${index}`} style={styles.item} wrap={false}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemTitleBlock}>
                      <Text style={styles.itemTitle}>
                        {safeText(item.degree) || "Degree"}
                        {safeText(item.field) ? ` in ${safeText(item.field)}` : ""}
                      </Text>
                      <Text style={styles.itemSubtitle}>
                        {[safeText(item.institution), safeText(item.location)].filter(Boolean).join(" | ")}
                      </Text>
                    </View>
                    <Text style={styles.itemMeta}>
                      {formatRange(item.startDate, item.endDate, false)}
                    </Text>
                  </View>
                  {safeText(item.description) ? (
                    <Text style={styles.description}>{safeText(item.description)}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.sectionBody}>
              {skills.map((category, index) => {
                const skillList = Array.isArray(category.skills)
                  ? category.skills.map((item) => safeText(item)).filter(Boolean).join(", ")
                  : safeText(category.skills);

                if (!safeText(category.name) && !skillList) return null;

                return (
                  <View key={`skill-${index}`} style={styles.skillGroup}>
                    {safeText(category.name) ? (
                      <Text style={styles.skillLabel}>{safeText(category.name)}</Text>
                    ) : null}
                    {skillList ? <Text style={styles.skillText}>{skillList}</Text> : null}
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {references.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>References</Text>
            <View style={styles.sectionBody}>
              {references.map((item, index) => (
                <View key={`ref-${index}`} style={styles.item} wrap={false}>
                  <Text style={styles.itemTitle}>{safeText(item.name) || "Reference"}</Text>
                  <Text style={styles.itemSubtitle}>
                    {[
                      safeText(item.position),
                      safeText(item.company),
                      safeText(item.contact),
                      safeText(item.email),
                    ]
                      .filter(Boolean)
                      .join(" | ")}
                  </Text>
                  {safeText(item.relationship) ? (
                    <Text style={styles.description}>{safeText(item.relationship)}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Text style={styles.footerNote}>
          Generated by ForteFolio PDF Export
        </Text>
      </Page>
    </Document>
  );
};

export const downloadResumePdf = async ({ resumeData, colorScheme, fileName }) => {
  const blob = await pdf(
    <ResumePdfDocument resumeData={resumeData} colorScheme={colorScheme} />
  ).toBlob();

  saveAs(blob, fileName || "Resume.pdf");
};

export default ResumePdfDocument;