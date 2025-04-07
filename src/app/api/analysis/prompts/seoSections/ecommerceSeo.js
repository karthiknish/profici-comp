// src/app/api/analysis/prompts/seoSections/ecommerceSeo.js
export const getEcommerceSeoStructure = (isEcommerce, competitorsString) => ({
  applicable: isEcommerce,
  summary: isEcommerce
    ? [
        {
          metric: "Product Page Score (Est.)",
          scoreOrStatus: "[1-100 Estimate]",
          notes: "[Key issues/strengths Estimate, e.g., missing schema]",
        },
        {
          metric: "Category Page Score (Est.)",
          scoreOrStatus: "[1-100 Estimate]",
          notes: "[Key issues/strengths Estimate, e.g., thin content]",
        },
        {
          metric: "Product Schema Coverage (Est.)",
          scoreOrStatus: "[% Estimate]",
          notes: "[Errors? Yes/No Estimate]",
        },
        {
          metric: "Faceted Navigation (Est.)",
          scoreOrStatus: "[Good/Fair/Poor Estimate]",
          notes: "[Impact on crawl budget/UX Estimate]",
        },
      ]
    : "N/A - Not detected as an e-commerce site.",
  ecommerceVsCompetitorsUK: isEcommerce
    ? "[Key differences vs " +
      (competitorsString || "[Competitor Estimate]") +
      " in UK e-commerce SEO Estimate]"
    : null,
});
