import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const QUESTION_PROMPT = `You are a thoughtful conversation facilitator. Generate a single open-ended question that sparks genuine human connection and self-reflection.

The question should:
- Invite personal storytelling, not trivia or facts
- Be warm, curious, and non-threatening
- Explore themes like: childhood memories, values, fears, dreams, relationships, identity, joy, loss, or growth
- Be phrased in second-person ("What is a moment when...", "When did you last feel...", "What does [X] mean to you?")
- Be 1-2 sentences max
- Feel like something a deeply curious, kind friend would ask

Do NOT ask political/religious questions, "would you rather" questions, or anything with a short obvious answer.

Return ONLY the question text. No preamble, no quotes, no explanation.`;

export async function generateQuestion(): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  const result = await model.generateContent(QUESTION_PROMPT);
  const response = result.response;
  return response.text().trim();
}
