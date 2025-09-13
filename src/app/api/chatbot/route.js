import { NextResponse } from "next/server";
import { rateLimitCheck, getClientIp } from "@/lib/rateLimit";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectToDatabase } from "@/lib/mongodb"; // Import the connect function
import { z } from "zod";

export const runtime = "nodejs";

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

const ChatMessageSchema = z.object({
  sender: z.enum(["user", "bot"]),
  text: z.string().min(1).max(5000),
});
const BodySchema = z.object({
  message: z.string().min(1, "Message is required").max(5000),
  history: z.array(ChatMessageSchema).optional(),
});

export async function POST(request) {
  // Basic env guard
  if (!geminiApiKey || !MONGODB_DB_NAME) {
    return NextResponse.json(
      { error: "Chatbot API is not configured correctly." },
      { status: 500 }
    );
  }

  try {
    // Rate limit per IP
    const ip = getClientIp(request.headers);
    const rl = await rateLimitCheck({
      key: `chat:${ip}`,
      windowMs: 60_000,
      max: 12,
    }); // 12 req/min
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(rl.reset / 1000)) },
        }
      );
    }

    // Size guard
    const raw = await request.text();
    if (raw.length > 100_000) {
      return NextResponse.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }
    let parsed;
    try {
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    const { message, history } = BodySchema.parse(parsed || {});

    // --- Gemini Interaction ---
    const geminiApi = new GoogleGenerativeAI(geminiApiKey);
    const model = geminiApi.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    });

    // Simple prompt construction (can be made more sophisticated)
    // Combine context, limited history, and the new message
    const historyString = (history || [])
      .slice(-6) // Limit history context
      .map(
        (msg) => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`
      )
      .join("\n");

    // Construct the prompt using the refined context
    const promptContent = `${PROFICI_CONTEXT}\n\nConversation History:\n${historyString}\n\nUser: ${message}\nAssistant:`;

    // Redact detailed prompt in logs to avoid leaking history
    console.log("Chatbot API: promptLen=", promptContent.length);
    const result = await model.generateContent(promptContent);
    const botResponseText =
      (typeof result?.response?.text === "function"
        ? result.response.text()
        : "") || "Sorry, I couldn't process that.";
    console.log("Chatbot API: responseLen=", botResponseText.length);

    // --- MongoDB Interaction ---
    try {
      // mongoClient = await clientPromise; // Remove old client promise usage
      // db = mongoClient.db(MONGODB_DB_NAME); // Remove old db assignment
      const { db } = await connectToDatabase();
      const interactionsCollection = db.collection("chat_interactions");

      const interaction = {
        userMessage: message,
        history: (history || []).slice(-6),
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
    const res = NextResponse.json({ reply: botResponseText });
    res.headers.set("Cache-Control", "no-store");
    return res;
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

// Optional: allow CORS preflight if needed later
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    },
  });
}
