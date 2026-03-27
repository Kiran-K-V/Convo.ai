import { Session } from "@/types";

const STORAGE_KEY = "samsarikam-session";

export function getOrCreateSession(): Session {
  if (typeof window === "undefined") {
    return { userId: "", userName: null };
  }
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  const session: Session = { userId: crypto.randomUUID(), userName: null };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function updateSession(updates: Partial<Session>): Session {
  const current = getOrCreateSession();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
