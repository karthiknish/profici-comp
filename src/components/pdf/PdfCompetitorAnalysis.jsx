import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "./PdfStyles";
import { PdfTable, JsonList, FormattedText } from "./PdfRenderHelpers";

// Helper: Build a PdfTable from array of objects or {headers, rows}
const BuildTable = ({ data }) => {
  if (!data) return null;

  // Explicit structure
  if (Array.isArray(data.headers) && Array.isArray(data.rows)) {
    return <PdfTable headers={data.headers} rows={data.rows} />;
  }

  // Array of objects with consistent keys
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
    const headers = Object.keys(data[0]);
    const consistent = data.every(
      (row) => typeof row === "object" && row !== null &&
        JSON.stringify(Object.keys(row)) === JSON.stringify(headers)
    );
    if (consistent) {
      return <PdfTable headers={headers} rows={data} />;
    }
  }

  // Single object with {headers, rows} embedded
  if (
    typeof data === "object" && data !== null &&
    Array.isArray(data.headers) && Array.isArray(data.rows)
  ) {
    return <PdfTable headers={data.headers} rows={data.rows} />;
  }

  return null;
};

const SectionBlock = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.h3}>{title}</Text>
    {children}
  </View>
);

const KeyValue = ({ label, value }) => {
  const rendered = FormattedText({ text: value, style: styles.valueText });
  if (!rendered) return null;
  return (
    <View style={styles.keyValueContainer}>
      <Text style={styles.keyText}>{label}: </Text>
      {rendered}
    </View>
  );
};

const PdfCompetitorAnalysis = ({ data }) => {
  if (!data) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 Competitor Analysis</Text>
        <Text style={styles.errorText}>No data provided.</Text>
      </View>
    );
  }
  if (data.error) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 Competitor Analysis</Text>
        <Text style={styles.errorText}>Error: {data.error}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>👥 Competitor Analysis</Text>

      {/* Overview */}
      {(data.competitorOverview || data.overview) && (
        <SectionBlock title="Overview">
          <BuildTable data={data.competitorOverview || data.overview} />
        </SectionBlock>
      )}

      {/* Digital Presence */}
      {data.digitalPresence && (
        <SectionBlock title={data.digitalPresence.title || "Digital Presence"}>
          <BuildTable data={data.digitalPresence} />
          {data.digitalPresence.notes && (
            <FormattedText style={styles.notesText} text={data.digitalPresence.notes} />
          )}
        </SectionBlock>
      )}

      {/* Pricing Strategy */}
      {data.pricingStrategy && (
        <SectionBlock title={data.pricingStrategy.title || "Pricing Strategy"}>
          <BuildTable data={data.pricingStrategy} />
          {data.pricingStrategy.summary && (
            <FormattedText style={styles.paragraph} text={data.pricingStrategy.summary} />
          )}
        </SectionBlock>
      )}

      {/* Marketing Channels */}
      {data.marketingChannels && (
        <SectionBlock title={data.marketingChannels.title || "Marketing Channels"}>
          <BuildTable data={data.marketingChannels} />
          {data.marketingChannels.gapOpportunities?.opportunities?.length > 0 && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.h4}>
                {data.marketingChannels.gapOpportunities.title || "Channel Gap Opportunities"}
              </Text>
              <JsonList
                items={data.marketingChannels.gapOpportunities.opportunities.map(
                  (o) => `${o.channel}: ${o.rationale}`
                )}
                bullet="🔍"
              />
            </View>
          )}
        </SectionBlock>
      )}

      {/* Apollo Data Comparison */}
      {data.apolloComparison?.competitorData?.length > 0 && (
        <SectionBlock title="Data Comparison (Apollo vs. Observations)">
          <View>
            {data.apolloComparison.competitorData.map((entry, idx) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <Text style={styles.h4}>{entry.name || `Competitor ${idx + 1}`}</Text>
                {entry.confirmations?.length > 0 && (
                  <View>
                    <Text style={styles.keyText}>Confirmations</Text>
                    <JsonList items={entry.confirmations} bullet="✅" />
                  </View>
                )}
                {entry.discrepancies?.length > 0 && (
                  <View>
                    <Text style={styles.keyText}>Discrepancies</Text>
                    <JsonList items={entry.discrepancies} bullet="⚠️" />
                  </View>
                )}
                {entry.insights?.length > 0 && (
                  <View>
                    <Text style={styles.keyText}>New Insights</Text>
                    <JsonList items={entry.insights} bullet="💡" />
                  </View>
                )}
              </View>
            ))}
          </View>
        </SectionBlock>
      )}

      {/* Key Differences */}
      {data.keyDifferences && (
        <SectionBlock title={data.keyDifferences.title || "Key Differences"}>
          <KeyValue label="Digital Presence" value={data.keyDifferences.digitalPresence} />
          <KeyValue label="Pricing" value={data.keyDifferences.pricing} />
          <KeyValue label="Marketing Channels" value={data.keyDifferences.marketingChannels} />
          {data.keyDifferences.overall && (
            <FormattedText style={[styles.paragraph, { fontStyle: "italic" }]} text={data.keyDifferences.overall} />
          )}
        </SectionBlock>
      )}

      {/* SWOT Analysis */}
      {data.swotAnalysis && (
        <SectionBlock title={data.swotAnalysis.title || "SWOT Analysis"}>
          {Array.isArray(data.swotAnalysis.strengths) && data.swotAnalysis.strengths.length > 0 && (
            <View>
              <Text style={styles.h4}>Strengths</Text>
              <JsonList items={data.swotAnalysis.strengths} bullet="✅" />
            </View>
          )}
          {Array.isArray(data.swotAnalysis.weaknesses) && data.swotAnalysis.weaknesses.length > 0 && (
            <View>
              <Text style={styles.h4}>Weaknesses</Text>
              <JsonList items={data.swotAnalysis.weaknesses} bullet="❌" />
            </View>
          )}
          {Array.isArray(data.swotAnalysis.opportunities) && data.swotAnalysis.opportunities.length > 0 && (
            <View>
              <Text style={styles.h4}>Opportunities</Text>
              <JsonList items={data.swotAnalysis.opportunities} bullet="🎯" />
            </View>
          )}
          {Array.isArray(data.swotAnalysis.threats) && data.swotAnalysis.threats.length > 0 && (
            <View>
              <Text style={styles.h4}>Threats</Text>
              <JsonList items={data.swotAnalysis.threats} bullet="⚠️" />
            </View>
          )}
        </SectionBlock>
      )}

      {/* Advantage Opportunities */}
      {data.advantageOpportunities?.opportunities?.length > 0 && (
        <SectionBlock title={data.advantageOpportunities.title || "Competitive Advantage Opportunities"}>
          <JsonList
            items={data.advantageOpportunities.opportunities.map((o) => ({
              text: `${o.description || "Opportunity"} - ${o.action || "Action TBD"}`,
            }))}
            bullet="🎯"
          />
        </SectionBlock>
      )}
    </View>
  );
};

export default PdfCompetitorAnalysis;
