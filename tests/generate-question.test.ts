import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { config } from "dotenv";

config({ path: ".env.local" });

// ─── Unit: generateQuestion() from lib/gemini ────────────────────────────────

describe("lib/gemini – generateQuestion()", () => {
  it("returns a non-empty string", async () => {
    const { generateQuestion } = await import("../lib/gemini");
    const result = await generateQuestion();
    expect(typeof result).toBe("string");
    expect(result.trim().length).toBeGreaterThan(10);
  }, 30_000);

  it("returns a question (ends with ?) or at least reads like one", async () => {
    const { generateQuestion } = await import("../lib/gemini");
    const result = await generateQuestion();
    // The model is prompted to return only the question text
    const isQuestion =
      result.includes("?") ||
      /^(what|when|how|why|who|where|which|tell|describe|share)/i.test(result);
    expect(isQuestion).toBe(true);
  }, 30_000);

  it("does not include preamble or quotes", async () => {
    const { generateQuestion } = await import("../lib/gemini");
    const result = await generateQuestion();
    // Prompt says: no preamble, no quotes, no explanation
    expect(result).not.toMatch(/^(here is|sure|of course|question:|certainly)/i);
    expect(result).not.toMatch(/^["'"]/);
  }, 30_000);
});

// ─── Unit: API route – mocked (no real network) ──────────────────────────────

describe("POST /api/generate-question – route logic (mocked)", () => {
  const mockTrigger = vi.fn().mockResolvedValue(undefined);
  const mockGenerateQuestion = vi.fn().mockResolvedValue("What moment made you feel most alive?");

  beforeEach(() => {
    vi.resetModules();
    vi.doMock("../lib/gemini", () => ({ generateQuestion: mockGenerateQuestion }));
    vi.doMock("../lib/pusher-server", () => ({
      pusherServer: { trigger: mockTrigger },
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 and ok:true on valid input", async () => {
    const { POST } = await import("../app/api/generate-question/route");

    const req = new Request("http://localhost/api/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomCode: "TEST01",
        requesterId: "user-abc",
        requesterName: "Alice",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("calls generateQuestion exactly once", async () => {
    const { POST } = await import("../app/api/generate-question/route");

    const req = new Request("http://localhost/api/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomCode: "TEST01",
        requesterId: "user-abc",
        requesterName: "Alice",
      }),
    });

    await POST(req);
    expect(mockGenerateQuestion).toHaveBeenCalledTimes(1);
  });

  it("triggers pusher with correct event and channel", async () => {
    const { POST } = await import("../app/api/generate-question/route");

    const req = new Request("http://localhost/api/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomCode: "TEST01",
        requesterId: "user-abc",
        requesterName: "Alice",
      }),
    });

    await POST(req);

    expect(mockTrigger).toHaveBeenCalledTimes(1);
    const [channel, event, payload] = mockTrigger.mock.calls[0];
    expect(channel).toBe("presence-room-TEST01");
    expect(event).toBe("message:new");
    expect(payload.type).toBe("question");
    expect(payload.content).toBe("What moment made you feel most alive?");
    expect(payload.senderId).toBe("system");
    expect(typeof payload.id).toBe("string");
    expect(typeof payload.timestamp).toBe("number");
  });

  it("returns 400 when roomCode is missing", async () => {
    const { POST } = await import("../app/api/generate-question/route");

    const req = new Request("http://localhost/api/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requesterId: "user-abc" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when requesterId is missing", async () => {
    const { POST } = await import("../app/api/generate-question/route");

    const req = new Request("http://localhost/api/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode: "TEST01" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 when generateQuestion throws", async () => {
    mockGenerateQuestion.mockRejectedValueOnce(new Error("Gemini API error"));
    const { POST } = await import("../app/api/generate-question/route");

    const req = new Request("http://localhost/api/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomCode: "TEST01",
        requesterId: "user-abc",
        requesterName: "Alice",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("returns 500 when pusher trigger throws", async () => {
    mockTrigger.mockRejectedValueOnce(new Error("Pusher error"));
    const { POST } = await import("../app/api/generate-question/route");

    const req = new Request("http://localhost/api/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomCode: "TEST01",
        requesterId: "user-abc",
        requesterName: "Alice",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
