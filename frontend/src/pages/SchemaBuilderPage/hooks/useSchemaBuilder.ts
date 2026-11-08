import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useImmerReducer } from "use-immer";
import type { Ischema, ISection, IQuestion, QuestionType } from "../../../types/schema.types";
import { QUESTION_TYPES } from "../../../types/schema.types";

const DEFAULT_SCALE_MIN = 1;
const DEFAULT_SCALE_MAX = 5;

export interface QuestionUpdateData {
  title?: string;
  required?: boolean;
  type?: QuestionType;
  options?: {
    choices?: string[];
    rows?: string[];
    min?: number;
    max?: number;
  };
}

export type SchemaAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "ADD_SECTION" }
  | { type: "UPDATE_SECTION"; payload: { sectionIndex: number; data: Partial<ISection> } }
  | { type: "DELETE_SECTION"; payload: { sectionIndex: number } }
  | { type: "ADD_QUESTION"; payload: { sectionIndex: number } }
  | { type: "UPDATE_QUESTION"; payload: { sectionIndex: number; questionIndex: number; data: QuestionUpdateData } }
  | { type: "DELETE_QUESTION"; payload: { sectionIndex: number; questionIndex: number } };

const createDefaultQuestion = (): IQuestion => ({
  id: uuidv4(),
  title: "",
  type: QUESTION_TYPES.SHORT_ANSWER,
  required: false,
});

const createDefaultSection = (): ISection => ({
  title: "",
  description: "",
  questions: [],
});

const initialSchemaState: Ischema = {
  title: "",
  description: "",
  isDraft: true,
  sections: [],
};

function schemaReducer(draft: Ischema, action: SchemaAction) {
  switch (action.type) {
    case "SET_TITLE":
      draft.title = action.payload;
      break;
    case "SET_DESCRIPTION":
      draft.description = action.payload;
      break;
    case "ADD_SECTION":
      draft.sections.push(createDefaultSection());
      break;
    case "UPDATE_SECTION":
      Object.assign(draft.sections[action.payload.sectionIndex], action.payload.data);
      break;
    case "DELETE_SECTION":
      if (draft.sections.length > 1) {
        draft.sections.splice(action.payload.sectionIndex, 1);
      }
      break;
    case "ADD_QUESTION":
      draft.sections[action.payload.sectionIndex].questions.push(createDefaultQuestion());
      break;
    case "UPDATE_QUESTION": {
      const target =
        draft.sections[action.payload.sectionIndex].questions[
          action.payload.questionIndex
        ];
      const { type, options, ...rest } = action.payload.data;

      Object.assign(target, rest);

      if (type !== undefined && type !== target.type) {
        target.type = type;
        const existingChoices =
          "options" in target && "choices" in target.options
            ? target.options.choices
            : undefined;
        const existingRows =
          "options" in target && "rows" in target.options
            ? target.options.rows
            : undefined;
        const choices =
          existingChoices && existingChoices.length > 0
            ? existingChoices
            : [""];
        const rows =
          existingRows && existingRows.length > 0 ? existingRows : [""];

        switch (type) {
          case QUESTION_TYPES.SHORT_ANSWER:
          case QUESTION_TYPES.PARAGRAPH:
          case QUESTION_TYPES.TIME:
          case QUESTION_TYPES.DATE:
            delete (target as { options?: unknown }).options;
            break;
          case QUESTION_TYPES.RADIO:
          case QUESTION_TYPES.CHECKBOX:
          case QUESTION_TYPES.DROPDOWN:
            (target as { options?: unknown }).options = { choices };
            break;
          case QUESTION_TYPES.LINEAR_SCALE:
            (target as { options?: unknown }).options = {
              min:
                "options" in target && "min" in target.options
                  ? target.options.min
                  : DEFAULT_SCALE_MIN,
              max:
                "options" in target && "max" in target.options
                  ? target.options.max
                  : DEFAULT_SCALE_MAX,
            };
            break;
          case QUESTION_TYPES.RADIO_GRID:
          case QUESTION_TYPES.CHECKBOX_GRID:
            (target as { options?: unknown }).options = { choices, rows };
            break;
        }
      }

      if (options) {
        if (!("options" in target) || !target.options) {
          (target as { options?: unknown }).options = {};
        }
        Object.assign((target as { options?: unknown }).options as object, options);
      }
      break;
    }
    case "DELETE_QUESTION":
      draft.sections[action.payload.sectionIndex].questions.splice(action.payload.questionIndex, 1);
      break;
  }
}

export function useSchemaBuilder(initialData?: Ischema | null) {
  const [schema, dispatch] = useImmerReducer(
    schemaReducer,
    initialData ?? initialSchemaState
  );

  const setTitle = useCallback(
    (title: string) => dispatch({ type: "SET_TITLE", payload: title }),
    [dispatch]
  );

  const setDescription = useCallback(
    (description: string) =>
      dispatch({ type: "SET_DESCRIPTION", payload: description }),
    [dispatch]
  );

  const addSection = useCallback(
    () => dispatch({ type: "ADD_SECTION" }),
    [dispatch]
  );

  const updateSection = useCallback(
    (sectionIndex: number, data: Partial<ISection>) =>
      dispatch({ type: "UPDATE_SECTION", payload: { sectionIndex, data } }),
    [dispatch]
  );

  const deleteSection = useCallback(
    (sectionIndex: number) =>
      dispatch({ type: "DELETE_SECTION", payload: { sectionIndex } }),
    [dispatch]
  );

  const addQuestion = useCallback(
    (sectionIndex: number) =>
      dispatch({ type: "ADD_QUESTION", payload: { sectionIndex } }),
    [dispatch]
  );

  const updateQuestion = useCallback(
    (sectionIndex: number, questionIndex: number, data: QuestionUpdateData) =>
      dispatch({
        type: "UPDATE_QUESTION",
        payload: { sectionIndex, questionIndex, data },
      }),
    [dispatch]
  );

  const deleteQuestion = useCallback(
    (sectionIndex: number, questionIndex: number) =>
      dispatch({
        type: "DELETE_QUESTION",
        payload: { sectionIndex, questionIndex },
      }),
    [dispatch]
  );

  return {
    schema,
    setTitle,
    setDescription,
    addSection,
    updateSection,
    deleteSection,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
