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
  title: z.string().trim().min(1, "schemaBuilder.validationQuestionNoTitle"),
  required: z.boolean().default(false),
});

const textQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(TEXT_QUESTION_TYPES),
});

const choiceQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(CHOICE_QUESTION_TYPES),
  options: z.object({
    choices: z
      .array(z.string().trim().min(1, "schemaBuilder.validationEmptyChoice"))
      .min(1, "schemaBuilder.validationNoChoices")
      .refine(
        (items) => new Set(items.map((i) => i.trim())).size === items.length,
        "schemaBuilder.validationDuplicateChoices",
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
      .array(z.string().trim().min(1, "schemaBuilder.validationEmptyGridCol"))
      .min(1, "schemaBuilder.validationNoGridCols")
      .refine(
        (items) => new Set(items.map((i) => i.trim())).size === items.length,
        "schemaBuilder.validationDuplicateGridCols",
      ),
    rows: z
      .array(z.string().trim().min(1, "schemaBuilder.validationEmptyGridRow"))
      .min(1, "schemaBuilder.validationNoGridRows")
      .refine(
        (items) => new Set(items.map((i) => i.trim())).size === items.length,
        "schemaBuilder.validationDuplicateGridRows",
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
  title: z.string().trim().min(1, "schemaBuilder.validationSectionNoTitle"),
  description: z.string().trim().default(""),
  questions: z.array(questionSchema).min(1, "schemaBuilder.validationSectionNoQuestions"),
});

export type ISection = z.infer<typeof sectionSchema>;

export const schemaSchema = z.object({
  _id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  title: z.string().trim().min(1, "schemaBuilder.validationNoTitle"),
  description: z.string().trim().default(""),
  isDraft: z.boolean(),
  sections: z.array(sectionSchema).min(1, "schemaBuilder.validationNoSections"),
});

export type Ischema = z.infer<typeof schemaSchema>;

export type SchemaInput = Pick<Ischema, "title" | "description" | "sections">;
