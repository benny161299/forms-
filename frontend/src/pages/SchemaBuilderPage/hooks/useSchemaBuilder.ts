import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import type { Ischema, ISection, IQuestion } from "../../../types/schema.types";

export type SchemaAction =
  | { type: "SET_SCHEMA"; payload: Ischema }
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "ADD_SECTION" }
  | { type: "UPDATE_SECTION"; payload: { sectionIndex: number; data: Partial<ISection> } }
  | { type: "DELETE_SECTION"; payload: { sectionIndex: number } }
  | { type: "ADD_QUESTION"; payload: { sectionIndex: number } }
  | { type: "UPDATE_QUESTION"; payload: { sectionIndex: number; questionIndex: number; question: IQuestion } }
  | { type: "DELETE_QUESTION"; payload: { sectionIndex: number; questionIndex: number } };

const createDefaultQuestion = (): IQuestion => ({
  id: crypto.randomUUID(),
  title: "",
  type: "short_answer",
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
    case "SET_SCHEMA":
      return action.payload;
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
    case "UPDATE_QUESTION":
      draft.sections[action.payload.sectionIndex].questions[action.payload.questionIndex] = action.payload.question;
      break;
    case "DELETE_QUESTION":
      draft.sections[action.payload.sectionIndex].questions.splice(action.payload.questionIndex, 1);
      break;
  }
}

export function useSchemaBuilder(initialData?: Ischema | null) {
  const [schema, dispatch] = useImmerReducer(schemaReducer, initialSchemaState);

  useEffect(() => {
    if (initialData) {
      dispatch({ type: "SET_SCHEMA", payload: initialData });
    }
  }, [initialData, dispatch]);

  return {
    schema,
    setTitle: (title: string) => dispatch({ type: "SET_TITLE", payload: title }),
    setDescription: (description: string) => dispatch({ type: "SET_DESCRIPTION", payload: description }),
    addSection: () => dispatch({ type: "ADD_SECTION" }),
    updateSection: (sectionIndex: number, data: Partial<ISection>) =>
      dispatch({ type: "UPDATE_SECTION", payload: { sectionIndex, data } }),
    deleteSection: (sectionIndex: number) =>
      dispatch({ type: "DELETE_SECTION", payload: { sectionIndex } }),
    addQuestion: (sectionIndex: number) =>
      dispatch({ type: "ADD_QUESTION", payload: { sectionIndex } }),
    updateQuestion: (sectionIndex: number, questionIndex: number, question: IQuestion) =>
      dispatch({ type: "UPDATE_QUESTION", payload: { sectionIndex, questionIndex, question } }),
    deleteQuestion: (sectionIndex: number, questionIndex: number) =>
      dispatch({ type: "DELETE_QUESTION", payload: { sectionIndex, questionIndex } }),
  };
}