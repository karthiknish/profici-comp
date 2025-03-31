import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiApi;

export const initGemini = (apiKey) => {
  geminiApi = new GoogleGenerativeAI(apiKey);
};

export const generateSeoAnalysis = async (formData) => {
  if (!geminiApi) {
    throw new Error("Gemini API not initialized. Call initGemini first.");
  }

  const model = geminiApi.getGenerativeModel({
    model: "gemini-2.5-pro-exp-03-25",
  });

  // Create prompts for each section of the report
  const seoPrompt = `Create a comprehensive SEO analysis for the website ${formData.website}, a business in the ${formData.industry} industry.
  
  Format the response in Markdown with the following structure:
  
  ## Keyword Rankings
  
  Analyze current keyword rankings, search volumes, and difficulty scores. Include a table with the following format:
  
  | Keyword | Current Ranking | Search Volume | Difficulty |
  |---------|----------------|---------------|------------|
  | [keyword] | [position] | [volume] | [difficulty] |
  
  Followed by analysis of key findings and actionable steps.
  
  ## Organic Traffic Metrics
  
  Analysis of current organic traffic, trends over time, top landing pages, etc.
  
  ## Backlink Profile Analysis
  
  Comprehensive analysis of the current backlink profile, including total backlinks, referring domains, domain authority, etc.
  
  ## Page Speed & Mobile Usability
  
  Analysis of page speed scores, mobile usability issues, and recommendations for improvement.
  
  ## Keyword Gap Analysis
  
  Comparison of keyword targeting vs. competitors.
  
  ## Technical SEO Issues
  
  Identification of critical technical SEO issues.
  
  For each section, include specific numerical data and metrics. Structure the analysis with H2 and H3 headings for clear organization, and include measurable improvement targets with expected outcomes. Emphasize actionable, data-driven recommendations.`;

  const competitorPrompt = `Analyze the following competitors: ${
    formData.competitors
  } 
  in the ${
    formData.industry
  } industry. Compare their strategies, strengths, and weaknesses 
  to ${formData.businessName || formData.website}.`;

  const marketPotentialPrompt = `Evaluate the market potential and opportunities for a ${
    formData.industry
  } 
  business like ${
    formData.businessName || formData.website
  }. Consider current market trends, 
  size of the addressable market, and growth potential.`;

  const marketCapPrompt = `Estimate the market cap or market size for the ${
    formData.industry
  } industry, 
  particularly focusing on businesses similar to ${
    formData.businessName || formData.website
  }.`;

  const recommendationsPrompt = `Based on the analysis of ${
    formData.businessName || formData.website
  }, 
  its competitors (${formData.competitors}), and the current state of the ${
    formData.industry
  } industry, 
  provide actionable recommendations for marketing strategy (both organic and social media) 
  and high-level strategies for C-suite executives. Focus on specific, data-driven recommendations.`;

  try {
    // Run all prompts in parallel for efficiency
    const [
      seoResult,
      competitorResult,
      marketPotentialResult,
      marketCapResult,
      recommendationsResult,
    ] = await Promise.all([
      model.generateContent(seoPrompt),
      model.generateContent(competitorPrompt),
      model.generateContent(marketPotentialPrompt),
      model.generateContent(marketCapPrompt),
      model.generateContent(recommendationsPrompt),
    ]);

    // Extract and return the text responses
    return {
      seoAnalysis: seoResult.response.text(),
      competitorAnalysis: competitorResult.response.text(),
      marketPotential: marketPotentialResult.response.text(),
      marketCap: marketCapResult.response.text(),
      recommendations: recommendationsResult.response.text(),
    };
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
};
