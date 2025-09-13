import { NextResponse } from "next/server";
import { getClientIp, rateLimitCheck } from "@/lib/rateLimit";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

export const runtime = "nodejs";

const ChatMessageSchema = z.object({ sender: z.enum(["user", "bot"]), text: z.string().min(1).max(5000) });
const BodySchema = z.object({ message: z.string().min(1).max(5000), history: z.array(ChatMessageSchema).optional() });

export async function POST(request) {
  try {
    const ip = getClientIp(request.headers);
    const rl = await rateLimitCheck({ key: `chat-stream:${ip}`, windowMs: 60_000, max: 20 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again shortly." }, { status: 429, headers: { "Retry-After": String(Math.ceil(rl.reset / 1000)) } });
    }

    const raw = await request.text();
    if (raw.length > 100_000) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }
    let parsed;
    try { parsed = raw ? JSON.parse(raw) : {}; } catch { return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 }); }
    const { message, history } = BodySchema.parse(parsed || {});

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const gemini = new GoogleGenerativeAI(apiKey);
    const model = gemini.getGenerativeModel({ model: modelName });

    const historyString = (history || [])
      .slice(-6)
      .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");
    const prompt = `You are the Profici Assistant.\n\nConversation History:\n${historyString}\n\nUser: ${message}\nAssistant:`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Streaming support: call generateContent and stream chunks as SSE data
          const result = await model.generateContentStream({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (e) {
          controller.enqueue(encoder.encode(`event: error\n` + `data: ${JSON.stringify({ error: e?.message || String(e) })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-store",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

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
