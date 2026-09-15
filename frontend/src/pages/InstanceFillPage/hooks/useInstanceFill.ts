import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import type { IInstance, AnswerValue } from "../../../types/instance.types";

export type InstanceAction =
  | {
      type: "SET_INSTANCE";
      payload: {
        instanceId: string;
        answers: Record<string, AnswerValue>;
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
  | { type: "SET_CURRENT_SECTION"; payload: number }
  | { type: "SET_TOTAL_SECTIONS"; payload: number };

interface InstanceFillState {
  instanceId: string | null;
  answers: Record<string, AnswerValue>;
  currentSectionIndex: number;
  totalSections: number;
}

const initialInstanceState: InstanceFillState = {
  instanceId: null,
  answers: {},
  currentSectionIndex: 0,
  totalSections: 0,
};

function instanceReducer(
  draft: InstanceFillState,
  action: InstanceAction
) {
  switch (action.type) {
    case "SET_INSTANCE":
      draft.instanceId = action.payload.instanceId;
      draft.answers = action.payload.answers;
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

    case "SET_TOTAL_SECTIONS":
      draft.totalSections = action.payload;
      break;
  }
}

export function useInstanceFill(
  initialData?: Partial<IInstance> | null
) {
  const [state, dispatch] = useImmerReducer(
    instanceReducer,
    initialInstanceState
  );

  useEffect(() => {
    if (initialData?._id) {
      dispatch({
        type: "SET_INSTANCE",
        payload: {
          instanceId: initialData._id,
          answers: initialData.answers ?? {},
        },
      });
    }
  }, [initialData, dispatch]);

  return {
    instanceId: state.instanceId,
    answers: state.answers,
    currentSectionIndex: state.currentSectionIndex,
    totalSections: state.totalSections,

    isFirstSection: state.currentSectionIndex === 0,
    isLastSection:
      state.currentSectionIndex === state.totalSections - 1,

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

    setTotalSections: (total: number) =>
      dispatch({
        type: "SET_TOTAL_SECTIONS",
        payload: total,
      }),
  };
}
