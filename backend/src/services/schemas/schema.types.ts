import { z } from "zod";

export const QUESTION_TYPES = {
  SHORT_ANSWER: "short_answer",
  PARAGRAPH: "paragraph",
  TIME: "time",
  DATE: "date",
  RADIO: "radio",
  CHECKBOX: "checkbox",
  DROPDOWN: "dropdown",
  LINEAR_SCALE: "linear_scale",
  RADIO_GRID: "radio_grid",
  CHECKBOX_GRID: "checkbox_grid",
} as const;

export type QuestionType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

export const TEXT_QUESTION_TYPES = [
  QUESTION_TYPES.SHORT_ANSWER,
  QUESTION_TYPES.PARAGRAPH,
  QUESTION_TYPES.TIME,
  QUESTION_TYPES.DATE,
] as const;

export const CHOICE_QUESTION_TYPES = [
  QUESTION_TYPES.RADIO,
  QUESTION_TYPES.CHECKBOX,
  QUESTION_TYPES.DROPDOWN,
] as const;

export const TABLE_QUESTION_TYPES = [
  QUESTION_TYPES.RADIO_GRID,
  QUESTION_TYPES.CHECKBOX_GRID,
] as const;

const baseQuestionSchema = z.object({
  id: z.uuidv4(),
  title: z.string().trim().min(1, "Question title is required"),
  required: z.boolean().default(false),
});

const textQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(TEXT_QUESTION_TYPES),
});

const choiceQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(CHOICE_QUESTION_TYPES),
  options: z.object({
    choices: z
      .array(z.string().trim().min(1, "Choice option cannot be empty"))
      .min(1, "At least one choice option is required")
      .refine(
        (items) => new Set(items.map((i) => i.trim())).size === items.length,
        "Duplicate choices are not allowed",
      ),
  }),
});

const scaleQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QUESTION_TYPES.LINEAR_SCALE),
  options: z.object({
    min: z.number().int().min(0).max(1),
    max: z.number().int().min(5).max(10),
  }),
});

const tableQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(TABLE_QUESTION_TYPES),
  options: z.object({
    choices: z
      .array(z.string().trim().min(1, "Column title cannot be empty"))
      .min(1, "At least one column is required")
      .refine(
        (items) => new Set(items.map((i) => i.trim())).size === items.length,
        "Duplicate columns are not allowed",
      ),
    rows: z
      .array(z.string().trim().min(1, "Row title cannot be empty"))
      .min(1, "At least one row is required")
      .refine(
        (items) => new Set(items.map((i) => i.trim())).size === items.length,
        "Duplicate rows are not allowed",
      ),
  }),
});

export const questionSchema = z.discriminatedUnion("type", [
  textQuestionSchema,
  choiceQuestionSchema,
  scaleQuestionSchema,
  tableQuestionSchema,
]);

export type IQuestion = z.infer<typeof questionSchema>;

export const sectionSchema = z.object({
  title: z.string().trim().min(1, "Section title is required"),
  description: z.string().trim().default(""),
  questions: z.array(questionSchema).min(1, "Section must contain at least one question"),
});

export type ISection = z.infer<typeof sectionSchema>;

export const schemaSchema = z.object({
  _id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  title: z.string().trim().min(1, "Schema title is required"),
  description: z.string().trim().default(""),
  isDraft: z.boolean(),
  sections: z.array(sectionSchema).min(1, "Schema must contain at least one section"),
});

export type Ischema = z.infer<typeof schemaSchema>;

export type SchemaInput = Pick<Ischema, "title" | "description" | "sections">;
