// src/app/api/analysis/prompts/seoSections/pageSpeedMobile.js
export const getPageSpeedMobileStructure = (
  isMobileFriendly,
  competitorsString
) => ({
  coreWebVitalsContext: "UK",
  summary: [
    {
      metric: "PageSpeed Score (Est.)",
      desktopValue: "[0-100 Estimate]",
      mobileValue: "[0-100 Estimate]",
      mobileRating: "[Good/Needs Improvement/Poor Estimate]",
    },
    {
      metric: "Largest Contentful Paint (LCP)",
      desktopValue: "[s Estimate]",
      mobileValue: "[s Estimate]",
      mobileRating: "[Good/Needs Improvement/Poor Estimate]",
    },
    {
      metric: "First Input Delay (FID) / Interaction to Next Paint (INP)",
      desktopValue: "[ms Estimate]",
      mobileValue: "[ms Estimate]",
      mobileRating: "[Good/Needs Improvement/Poor Estimate]",
    },
    {
      metric: "Cumulative Layout Shift (CLS)",
      desktopValue: "[score Estimate]",
      mobileValue: "[score Estimate]",
      mobileRating: "[Good/Needs Improvement/Poor Estimate]",
    },
  ],
  mobileFriendlyScore:
    "[" + isMobileFriendly + "] (Consider viewport optimisation)",
  topSpeedIssuesUK: [
    "[Issue 1 Estimate based on mobile speed flags]", // Removed Insites name
    "[Issue 2 Estimate]",
    "[Issue 3 Estimate]",
  ],
  speedVsCompetitorsUK:
    "[Faster/Slower than " +
    (competitorsString || "[Competitor Estimate]") +
    " Estimate]",
});
