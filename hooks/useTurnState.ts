"use client";

import { useState, useCallback, useRef } from "react";

export function useTurnState(myUserId: string) {
  const [currentTurnUserId, setCurrentTurnUserId] = useState<string | null>(null);
  const [hasRespondedSinceLastQuestion, setHasRespondedSinceLastQuestion] =
    useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const lastQuestionTimeRef = useRef(0);

  const isMyTurn = currentTurnUserId === myUserId;

  const onTurnChanged = useCallback((newTurnUserId: string) => {
    setCurrentTurnUserId(newTurnUserId);
    setHasRespondedSinceLastQuestion(false);
  }, []);

  const onMessageSent = useCallback(() => {
    setHasRespondedSinceLastQuestion(true);
  }, []);

  const onQuestionGenerated = useCallback(() => {
    setHasRespondedSinceLastQuestion(false);
    lastQuestionTimeRef.current = Date.now();
    setCooldownUntil(Date.now() + 3000);
    setIsGenerating(false);
  }, []);

  const startGenerating = useCallback(() => {
    setIsGenerating(true);
  }, []);

  const isCoolingDown = Date.now() < cooldownUntil;

  return {
    currentTurnUserId,
    isMyTurn,
    hasRespondedSinceLastQuestion,
    isCoolingDown,
    isGenerating,
    onTurnChanged,
    onMessageSent,
    onQuestionGenerated,
    startGenerating,
  };
}
