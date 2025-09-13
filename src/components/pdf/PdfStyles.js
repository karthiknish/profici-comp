import { StyleSheet } from "@react-pdf/renderer";

// --- Define Profici Brand Colors ---
export const proficiColors = {
  primary: "#1A202C", // Very Dark Gray (almost black)
  secondary: "#4A5568", // Medium Slate Gray
  accent: "#3182CE", // Blue
  background: "#FFFFFF",
  text: "#2D3748", // Dark Gray
  border: "#E2E8F0", // Light Gray Border
  muted: "#718096", // Muted Gray
  tableHeaderBg: "#EDF2F7", // Very Light Gray-Blue for Header
  tableEvenRowBg: "#F7FAFC", // Lighter Gray-Blue for Even Rows
  slideBg: "#F7FAFC", // Optional: Light background for content area to mimic slide
  error: "#E53E3E", // Red for errors
  strength: "#2F855A", // Dark Green for strengths
  weakness: "#C53030", // Dark Red for weaknesses
};

// --- Define Styles ---
export const styles = StyleSheet.create({
  // Page & Layout
  landscapePage: {
    flexDirection: "column",
    backgroundColor: proficiColors.background,
    paddingHorizontal: 40,
    paddingVertical: 30,
    fontFamily: "Helvetica", // Ensure base font is Helvetica
    fontSize: 10,
    color: proficiColors.text,
    lineHeight: 1.5,
  },
  slideContentArea: {
    flex: 1, // Take up available space between header/footer
    paddingTop: 50, // Space for fixed header
    paddingBottom: 35, // Space for footer and page number
  },
  // Fixed header repeated on content pages
  contentHeader: {
    position: "absolute",
    top: 15,
    left: 40,
    right: 40,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: proficiColors.border,
  },
  contentHeaderTitle: {
    fontSize: 10,
    color: proficiColors.secondary,
  },
  contentHeaderSub: {
    fontSize: 9,
    color: proficiColors.muted,
  },
  section: { marginBottom: 20 }, // Increased spacing between sections
  // Headers & Titles
  header: {
    // Report Header on Title Page
    textAlign: "center",
    marginBottom: 25,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: proficiColors.primary,
  },
  reportTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: proficiColors.primary,
    fontFamily: "Helvetica-Bold",
  },
  subHeader: { fontSize: 14, color: proficiColors.secondary, marginBottom: 5 },
  dateText: { fontSize: 10, color: proficiColors.muted },
  brandingTitleContainer: { textAlign: "center", marginVertical: 30 },
  brandingTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: proficiColors.primary,
    fontFamily: "Helvetica-Bold",
  },
  // Section Title (H2 equivalent)
  sectionTitle: {
    fontSize: 16, // Slightly smaller
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    marginBottom: 10, // Reduced margin
    paddingBottom: 5, // Reduced padding
    borderBottomWidth: 1,
    borderBottomColor: proficiColors.border,
    color: proficiColors.primary,
    fontFamily: "Helvetica-Bold", // Use the standard bold variant
  },
  // Sub-headings (H3 equivalent)
  h3: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: proficiColors.primary,
    marginBottom: 6,
    marginTop: 12, // Keep top margin for separation
  },
  // Sub-sub-headings (H4 equivalent) - New Style
  h4: {
    fontSize: 10,
    fontWeight: "bold", // Keep bold
    fontFamily: "Helvetica-Bold",
    color: proficiColors.secondary, // Muted color for less emphasis than H3
    marginBottom: 4, // Consistent small margin below H4
    marginTop: 8, // Consistent spacing above H4
  },
  // Basic Text & Lists
  paragraph: {
    marginBottom: 4, // Further reduced margin for tighter text blocks
    fontSize: 10,
    // color: proficiColors.text, // Inherited from page
    // lineHeight: 1.5, // Inherited from page
  },
  bold: { fontFamily: "Helvetica-Bold", fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  link: { color: proficiColors.accent, textDecoration: "underline" },
  list: { marginLeft: 15, marginBottom: 4 },
  listItem: { flexDirection: "row", marginBottom: 3, alignItems: "flex-start" },
  listItemBullet: {
    width: 10,
    fontSize: 10,
    marginRight: 5,
    marginTop: 1.5,
    // Use default font; emojis are resolved via Font.registerEmojiSource
  },
  listItemText: { flex: 1, fontSize: 10, lineHeight: 1.4 },
  // Table Styles - More refined
  table: {
    display: "table",
    width: "100%", // Full width for better alignment
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: proficiColors.border,
    marginBottom: 8, // Reduced margin
    borderRadius: 3, // Added border radius
    overflow: "hidden", // Needed for border radius
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: proficiColors.border,
  },
  tableHeaderRow: {
    backgroundColor: proficiColors.tableHeaderBg,
    borderBottomWidth: 1, // Thicker bottom border for header
    borderColor: proficiColors.secondary,
  },
  tableColHeader: {
    // Removed individual borders, rely on row/table borders
    padding: 5, // Adjusted padding
    flexGrow: 1,
    flexBasis: 0,
    backgroundColor: proficiColors.tableHeaderBg,
  },
  tableCol: {
    padding: 4, // Slightly reduced padding for cells
    flexGrow: 1,
    flexBasis: 0,
    borderLeftWidth: 0.5, // Add subtle vertical borders back
    borderLeftColor: proficiColors.border,
  },
  tableColFirst: {
    // Style for the first column to remove left border
    padding: 4,
    flexGrow: 1,
    flexBasis: 0,
    borderLeftWidth: 0,
  },
  tableCellHeader: {
    margin: 0,
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: proficiColors.primary,
    textAlign: "left",
  },
  tableCell: { margin: 0, fontSize: 9, textAlign: "left", lineHeight: 1.3 }, // Reduced line height in cells
  tableEvenRow: { backgroundColor: proficiColors.tableEvenRowBg },
  // Footer & Page Number
  footer: {
    position: "absolute",
    bottom: 15,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: proficiColors.muted,
    borderTopWidth: 0.5,
    borderTopColor: proficiColors.border,
    paddingTop: 5,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 15,
    left: 0,
    right: 40,
    textAlign: "right",
    color: proficiColors.muted,
  },
  // Misc
  errorText: { color: proficiColors.error, fontSize: 10, fontStyle: "italic" },
  notesText: {
    fontStyle: "italic",
    fontSize: 9,
    color: proficiColors.muted,
    marginTop: 3,
  },
  // Specific styles for Executive Summary elements (can be reused)
  execSummaryItem: {
    // Used for wrapping KVP in sections like Exec Summary
    marginBottom: 6, // Reduced margin
  },
  execSummaryLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: proficiColors.secondary,
    marginBottom: 2,
  },
  execSummaryValue: {
    fontSize: 10,
  },
  execSummaryList: {
    // Keep specific list styling if needed, otherwise default list style applies
    marginLeft: 10,
    marginBottom: 4,
  },
  strengthItem: { color: proficiColors.strength },
  weaknessItem: { color: proficiColors.weakness },
  recommendationItem: {
    // Keep specific styling for recommendations
    flexDirection: "row",
    marginBottom: 3,
  },
  recommendationText: {
    flex: 1,
    fontSize: 10,
  },
  recommendationImpact: {
    fontSize: 9, // Slightly smaller impact text
    fontFamily: "Helvetica-Bold",
    color: proficiColors.accent,
    marginLeft: 4,
  },
  // Style for simple Key-Value pairs rendered by PdfSection
  keyValueContainer: {
    flexDirection: "row",
    marginBottom: 3,
  },
  keyText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    width: "40%", // Adjust width as needed
    marginRight: 5,
  },
  valueText: {
    flex: 1,
    fontSize: 10,
  },
});
