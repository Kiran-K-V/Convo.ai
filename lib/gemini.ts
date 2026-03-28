import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const QUESTION_CATEGORIES = `
CATEGORIES TO DRAW FROM (rotate broadly, never cluster in one area):
- Childhood & nostalgia: a formative memory, a habit from growing up, something you believed as a kid
- Ambitions & dreams: something you're quietly working toward, an alternate life you'd live
- Preferences & tastes: a specific obsession (film, food, sound, texture, place), guilty pleasures
- Personality & self-knowledge: a quirk you've accepted, a contradiction you live with, how you recharge
- Relationships & people: someone who shaped you, the best advice you ever got, a friendship you miss
- Adventures & experiences: a trip that changed something, something you tried once and loved/hated
- Fears & discomforts (light touch): something you keep putting off, a social situation that always trips you up
- Hypotheticals & creativity: a thought experiment, a "would you rather" with stakes, an imaginary scenario
- Work & craft: something you're proud of making, a skill you want badly, the last time you felt genuinely good at something
- Daily life & small rituals: a habit that sounds boring but you love, the best part of an ordinary day
`;

function buildPrompt(previousQuestions: string[]): string {
  const avoidSection =
    previousQuestions.length > 0
      ? `\nAVOID asking anything similar to these already-asked questions:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n`
      : "";

  return `You are generating one conversation-starter question for two people getting to know each other in a real-time chat app.

REQUIREMENTS:
- Pick a DIFFERENT category or angle each time — vary the emotional tone, intimacy level, and subject matter
- The question should be specific and vivid, not generic ("what do you do for fun?" is banned)
- It must invite a personal story or concrete detail, not a one-word answer
- Keep it under 25 words — punchy, direct, no filler phrases
- Do NOT start with "What made you…" or "Tell me about…" or "Can you describe…"
- Avoid anything that sounds like a therapy intake form or a job interview
- It should feel like something a curious, interesting person would actually ask

${QUESTION_CATEGORIES}
${avoidSection}
OUTPUT:
Return ONLY the question, no quotes, no explanation, nothing else.`;
}

export async function generateQuestion(previousQuestions: string[] = []): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  const result = await model.generateContent(buildPrompt(previousQuestions));
  return result.response.text().trim().replace(/^["']|["']$/g, "");
}
