import { useEffect, useRef } from "react";
import { useImmerReducer } from "use-immer";
import type { IInstance, AnswerValue } from "../../../types/instance.types";
import type { ISection } from "../../../types/schema.types";

export type InstanceAction =
  | {
    type: "SET_INSTANCE";
    payload: {
      instanceId: string;
      answers: Record<string, AnswerValue>;
      currentSectionIndex?: number;
    };
  }
  | { type: "SET_INSTANCE_ID"; payload: string }
  | {
    type: "SET_ANSWER";
    payload: {
      questionId: string;
      value: AnswerValue;
    };
  }
  | { type: "SET_CURRENT_SECTION"; payload: number };

interface InstanceFillState {
  instanceId: string | null;
  answers: Record<string, AnswerValue>;
  currentSectionIndex: number;
}

const initialInstanceState: InstanceFillState = {
  instanceId: null,
  answers: {},
  currentSectionIndex: 0,
};

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

function instanceReducer(
  draft: InstanceFillState,
  action: InstanceAction
) {
  switch (action.type) {
    case "SET_INSTANCE":
      draft.instanceId = action.payload.instanceId;
      draft.answers = action.payload.answers;
      if (typeof action.payload.currentSectionIndex === "number") {
        draft.currentSectionIndex = action.payload.currentSectionIndex;
      }
      break;

    case "SET_INSTANCE_ID":
      draft.instanceId = action.payload;
      break;

    case "SET_ANSWER":
      draft.answers[action.payload.questionId] = action.payload.value;
      break;

    case "SET_CURRENT_SECTION":
      draft.currentSectionIndex = action.payload;
      break;
  }
}

export function useInstanceFill(
  initialData?: Partial<IInstance> | null,
  sections?: ISection[]
) {
  const [state, dispatch] = useImmerReducer(
    instanceReducer,
    initialInstanceState
  );
  const lastLoadedIdRef = useRef<string | undefined>(undefined);
  const hasRestoredSectionRef = useRef(false);

  useEffect(() => {
    if (!initialData?._id) return;

    if (initialData._id !== lastLoadedIdRef.current) {
      const initialSection = computeInitialSectionIndex(sections, initialData.answers);
      dispatch({
        type: "SET_INSTANCE",
        payload: {
          instanceId: initialData._id,
          answers: initialData.answers ?? {},
          currentSectionIndex: initialSection,
        },
      });
      lastLoadedIdRef.current = initialData._id;
      if (initialSection > 0) {
        hasRestoredSectionRef.current = true;
      }
    } else if (sections && sections.length > 0 && !hasRestoredSectionRef.current) {
      const initialSection = computeInitialSectionIndex(sections, initialData.answers);
      if (initialSection > 0) {
        dispatch({
          type: "SET_CURRENT_SECTION",
          payload: initialSection,
        });
        hasRestoredSectionRef.current = true;
      }
    }
  }, [initialData, sections, dispatch]);

  return {
    instanceId: state.instanceId,
    answers: state.answers,
    currentSectionIndex: state.currentSectionIndex,

    setInstanceId: (id: string) =>
      dispatch({
        type: "SET_INSTANCE_ID",
        payload: id,
      }),

    setAnswer: (questionId: string, value: AnswerValue) =>
      dispatch({
        type: "SET_ANSWER",
        payload: {
          questionId,
          value,
        },
      }),

    goToNextSection: () =>
      dispatch({
        type: "SET_CURRENT_SECTION",
        payload: state.currentSectionIndex + 1,
      }),

    goToPrevSection: () =>
      dispatch({
        type: "SET_CURRENT_SECTION",
        payload: state.currentSectionIndex - 1,
      }),
  };
}
