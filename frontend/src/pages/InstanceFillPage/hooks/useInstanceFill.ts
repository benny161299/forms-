import { useState } from "react";
import type { IInstance, AnswerValue } from "../../../types/instance.types";
import type { ISection } from "../../../types/schema.types";

export function computeInitialSectionIndex(
  sections?: ISection[],
  answers?: Record<string, AnswerValue>
): number {
  if (!sections || sections.length <= 1 || !answers || Object.keys(answers).length === 0) {
    return 0;
  }

  let lastSectionWithAnswers = 0;
  for (let i = 0; i < sections.length; i++) {
    const hasAnyAnswer = sections[i].questions.some((q) => answers[q.id] !== undefined);
    if (hasAnyAnswer) {
      lastSectionWithAnswers = i;
    }
  }

  const sectionQuestions = sections[lastSectionWithAnswers].questions;
  const isSectionComplete = sectionQuestions
    .filter((q) => q.required)
    .every((q) => answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== "");

  if (isSectionComplete && lastSectionWithAnswers + 1 < sections.length) {
    return lastSectionWithAnswers + 1;
  }

  return lastSectionWithAnswers;
}

export function useInstanceFill(
  initialData?: Partial<IInstance> | null,
  sections?: ISection[]
) {
  const [prevId, setPrevId] = useState<string | undefined>(undefined);
  const [hasRestoredSection, setHasRestoredSection] = useState(false);

  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  if (initialData?._id && initialData._id !== prevId) {
    setPrevId(initialData._id);
    setInstanceId(initialData._id);
    setAnswers(initialData.answers ?? {});
    const initialSection = computeInitialSectionIndex(sections, initialData.answers);
    setCurrentSectionIndex(initialSection);
    if (initialSection > 0) {
      setHasRestoredSection(true);
    }
  } else if (sections && sections.length > 0 && !hasRestoredSection && initialData?.answers) {
    const initialSection = computeInitialSectionIndex(sections, initialData.answers);
    if (initialSection > 0) {
      setHasRestoredSection(true);
      setCurrentSectionIndex(initialSection);
    }
  }

  return {
    instanceId,
    answers,
    currentSectionIndex,
    isFirstSection: currentSectionIndex === 0,
    isLastSection: Boolean(sections?.length && currentSectionIndex === sections.length - 1),

    setInstanceId,

    setAnswer: (questionId: string, value: AnswerValue) =>
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      })),

    goToNextSection: () => setCurrentSectionIndex((prev) => prev + 1),

    goToPrevSection: () => setCurrentSectionIndex((prev) => prev - 1),

    goToSection: (index: number) => setCurrentSectionIndex(index),
  };
}
