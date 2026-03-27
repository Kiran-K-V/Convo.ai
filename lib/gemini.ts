import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const QUESTION_PROMPT = `You are designing a single question that maximizes emotional closeness between two people using proven psychological principles.

The question MUST:
- Trigger personal storytelling (not opinions or hypotheticals)
- Encourage specific memories (a moment, event, or experience)
- Gently invite vulnerability, but feel safe and non-threatening
- Contain emotional contrast (e.g., fear vs growth, past vs present, expectation vs reality)
- Reveal something about identity, values, or inner world
- Be open-ended with no obvious or short answer
- Be phrased in second person ("you")

Guidelines from psychology:
- Optimize for reciprocal self-disclosure (the answer should naturally invite the other person to share too)
- Avoid surface-level or generic prompts
- Avoid sounding scripted, clinical, or “deep for the sake of deep”
- The question should feel like it came from a deeply curious, emotionally intelligent friend

Output:
Return ONLY one question , nothing else..`;

export async function generateQuestion(): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  const result = await model.generateContent(QUESTION_PROMPT);
  const response = result.response;
  return response.text().trim();
}
