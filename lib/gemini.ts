import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const QUESTION_PROMPT = `You are generating a single question that helps two people connect naturally and comfortably.

The question MUST:

* Be easy to answer within a few seconds (no pressure or overthinking)
* Invite a short personal story or experience (not opinions or abstract thinking)
* Feel warm, casual, and safe — like something you'd ask a friend
* Encourage follow-up conversation naturally
* Be relatable (daily life, small moments, simple memories)

Avoid:

* Deep, heavy, or emotionally intense phrasing
* Big life questions (identity, purpose, fears, etc.)
* Anything that feels like an interview or therapy

Goal:
The question should start light but leave room for the conversation to naturally go deeper if both people want.

Output:
Return ONLY one question (1–2 sentences max), nothing else.
`;

export async function generateQuestion(): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  const result = await model.generateContent(QUESTION_PROMPT);
  const response = result.response;
  return response.text().trim();
}
