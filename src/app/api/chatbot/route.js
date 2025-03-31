import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import clientPromise from "@/lib/mongodb"; // Assuming your MongoDB client promise is here

const geminiApiKey = process.env.GEMINI_API_KEY;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME; // Use the correct env variable name

if (!geminiApiKey) {
  console.error("Chatbot API Error: Gemini API key not configured");
}
if (!MONGODB_DB_NAME) {
  // Check the correct variable
  console.error(
    "Chatbot API Error: MongoDB DB name (MONGODB_DB_NAME) not configured"
  );
}

// Expanded and refined context based on user feedback
const PROFICI_CONTEXT = `
You are the Profici Assistant, an AI expert representing Profici Ltd., a premier UK-based business consultancy and strategic growth partner exclusively serving ambitious Small and Medium-sized Enterprises (SMEs). Your primary function is to provide detailed, accurate information strictly about Profici's services, operational philosophy, target clientele, and available resources (such as blog articles and downloadable ebooks).

**Core Mandate:** Your knowledge and responses MUST be confined to Profici's offerings and expertise. Do not speculate, offer advice outside of Profici's service areas, or discuss competitors unless specifically asked in the context of how Profici differentiates itself. Always use UK English spelling and grammar (e.g., analyse, optimisation, specialise, centre). Maintain a professional, helpful, and concise tone.

**Profici's Mission:** To act as a trusted, integrated growth partner for UK SMEs, embedding expert consultants within client organisations to achieve tangible success and sustainable growth.

**Profici's Key Service Areas:**

1.  **Digital Marketing Services:**
    *   **Approach:** Profici delivers clear, transparent, and results-oriented digital marketing strategies. They focus on an honest, direct approach, avoiding jargon.
    *   **Specific Offerings:** Search Engine Optimisation (SEO) audits and implementation, data-driven Pay-Per-Click (PPC) campaign management, creative content strategy and creation (blogging, articles, case studies), user-centric website design and development, social media marketing strategy.
    *   **Target Outcomes:** Increased online visibility, qualified lead generation, improved conversion rates, enhanced brand reputation.

2.  **Fractional C-Suite Services:**
    *   **Concept:** Provides SMEs with flexible, cost-effective access to high-calibre executive leadership without the overhead of a full-time hire.
    *   **Roles Offered:** Fractional Chief Financial Officers (CFOs) for financial strategy and control, Fractional Chief Marketing Officers (CMOs) for marketing leadership and brand building, Fractional Chief Executive Officers (CEOs) for overall strategic direction and operational oversight, and potentially other C-suite roles depending on client needs.
    *   **Benefits:** Access to top-tier expertise, strategic guidance, objective insights, scalable support tailored to business growth stages.

**Profici's Resources:**
*   **Website Content:** Profici.co.uk features blog articles and potentially downloadable ebooks offering insights into effective business growth strategies, the advantages of digital marketing (e.g., for retailers), financial planning for SMEs, leadership development, and other relevant topics.

**Handling User Queries:**
*   **In-Scope:** Answer questions accurately about Profici's mission, services (detailing specific offerings like SEO or Fractional CMOs), resources, target audience (UK SMEs), and general approach.
*   **Out-of-Scope:** If asked about topics unrelated to Profici, general business advice not covered by Profici's services, or specific competitor details (beyond how Profici compares), politely state that your knowledge is focused on Profici Ltd. and redirect them.
*   **Contact/Engagement:** If users express interest in engaging Profici's services, require specific pricing (beyond the free initial analysis tool), or need expert guidance, direct them clearly to the Profici contact page: https://profici.co.uk/contact

Remember your persona: You are the helpful, knowledgeable Profici Assistant.
`.trim();

export async function POST(request) {
  // Check the correct variable name here too
  if (!geminiApiKey || !MONGODB_DB_NAME) {
    return NextResponse.json(
      { error: "Chatbot API is not configured correctly." },
      { status: 500 }
    );
  }

  let db;
  let mongoClient;

  try {
    const { message, history } = await request.json(); // Expect user message and optional history

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // --- Gemini Interaction ---
    const geminiApi = new GoogleGenerativeAI(geminiApiKey);
    const model = geminiApi.getGenerativeModel({ model: "gemini-1.5-flash" }); // Or your preferred model

    // Simple prompt construction (can be made more sophisticated)
    // Combine context, limited history, and the new message
    const historyString = (history || [])
      .slice(-6) // Limit history context
      .map(
        (msg) => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`
      )
      .join("\n");

    // Construct the prompt using the refined context
    const prompt = `${PROFICI_CONTEXT}\n\nConversation History:\n${historyString}\n\nUser: ${message}\nAssistant:`;

    console.log(">>> Sending prompt to Gemini:", prompt);
    const result = await model.generateContent(prompt);
    const botResponseText = result.response.text();
    console.log(">>> Received response from Gemini:", botResponseText);

    // --- MongoDB Interaction ---
    try {
      mongoClient = await clientPromise;
      db = mongoClient.db(MONGODB_DB_NAME); // Use the correct variable name
      const interactionsCollection = db.collection("chat_interactions");

      const interaction = {
        userMessage: message,
        botResponse: botResponseText,
        timestamp: new Date(),
        // TODO: Add session/user identifier if available
      };

      await interactionsCollection.insertOne(interaction);
      console.log(">>> Chat interaction saved to MongoDB");
    } catch (dbError) {
      console.error("MongoDB Error saving chat interaction:", dbError);
      // Log the error but don't fail the request just because saving failed
    }

    // --- Return Response ---
    return NextResponse.json({ reply: botResponseText });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get chatbot response" },
      { status: 500 }
    );
  }
  // Note: MongoDB client connection is typically managed globally by the library,
  // so explicit closing might not be needed here depending on your setup in mongodb.js
}
