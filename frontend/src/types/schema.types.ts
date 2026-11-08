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

export const questionTypes: QuestionType[] = Object.values(QUESTION_TYPES);

const uniqueNonEmptyStrings = (messages: {
  empty: string;
  noItems: string;
  duplicate: string;
}) =>
  z
    .array(z.string().trim().min(1, messages.empty))
    .min(1, messages.noItems)
    .refine(
      (items) => new Set(items).size === items.length,
      messages.duplicate
    );

const baseQuestionSchema = z.object({
  id: z.uuidv4("schemaBuilder.validationInvalidQuestionId"),
  title: z.string().trim().min(1, "schemaBuilder.validationQuestionNoTitle"),
  required: z.boolean().default(false),
});

const textQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(TEXT_QUESTION_TYPES),
});

const choiceQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(CHOICE_QUESTION_TYPES),
  options: z.object({
    choices: uniqueNonEmptyStrings({
      empty: "schemaBuilder.validationEmptyChoice",
      noItems: "schemaBuilder.validationNoChoices",
      duplicate: "schemaBuilder.validationDuplicateChoices",
    }),
  }),
});

const scaleQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QUESTION_TYPES.LINEAR_SCALE),
  options: z.object({
    min: z
      .number("schemaBuilder.validationScaleMin")
      .int("schemaBuilder.validationScaleMin")
      .min(0, "schemaBuilder.validationScaleMin")
      .max(1, "schemaBuilder.validationScaleMin"),
    max: z
      .number("schemaBuilder.validationScaleMax")
      .int("schemaBuilder.validationScaleMax")
      .min(5, "schemaBuilder.validationScaleMax")
      .max(10, "schemaBuilder.validationScaleMax"),
  }),
});

const tableQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(TABLE_QUESTION_TYPES),
  options: z.object({
    choices: uniqueNonEmptyStrings({
      empty: "schemaBuilder.validationEmptyGridCol",
      noItems: "schemaBuilder.validationNoGridCols",
      duplicate: "schemaBuilder.validationDuplicateGridCols",
    }),
    rows: uniqueNonEmptyStrings({
      empty: "schemaBuilder.validationEmptyGridRow",
      noItems: "schemaBuilder.validationNoGridRows",
      duplicate: "schemaBuilder.validationDuplicateGridRows",
    }),
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
  questions: z
    .array(questionSchema)
    .min(1, "schemaBuilder.validationSectionNoQuestions"),
});

export type ISection = z.infer<typeof sectionSchema>;

export const validateUniqueQuestionIds = (
  sections: Array<{ questions?: Array<{ id: string }> }>,
  ctx: z.RefinementCtx
) => {
  const seenIds = new Set<string>();

  sections.forEach((section, sectionIndex) => {
    (section.questions ?? []).forEach((question, questionIndex) => {
      if (!question.id) return;
      if (seenIds.has(question.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "schemaBuilder.validationDuplicateQuestionId",
          path: [sectionIndex, "questions", questionIndex, "id"],
        });
      } else {
        seenIds.add(question.id);
      }
    });
  });
};

export const schemaSchema = z.object({
  _id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  title: z.string().trim().min(1, "schemaBuilder.validationNoTitle"),
  description: z.string().trim().default(""),
  isDraft: z.boolean(),
  sections: z
    .array(sectionSchema)
    .min(1, "schemaBuilder.validationNoSections")
    .superRefine(validateUniqueQuestionIds),
});

export type Ischema = z.infer<typeof schemaSchema>;

export type SchemaInput = Pick<Ischema, "title" | "description" | "sections">;

export const draftQuestionSchema = z.object({
  id: z.string(),
  title: z.string().trim().default(""),
  type: z.enum(questionTypes as [QuestionType, ...QuestionType[]]),
  required: z.boolean().default(false),
  options: z.any().optional(),
});

export const draftSectionSchema = z.object({
  title: z.string().trim().default(""),
  description: z.string().trim().default(""),
  questions: z.array(draftQuestionSchema).default([]),
});

export const draftSchema = z.object({
  _id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  title: z.string().trim().min(1, "schemaBuilder.validationNoTitle"),
  description: z.string().trim().default(""),
  isDraft: z.boolean().default(true),
  sections: z
    .array(draftSectionSchema)
    .default([])
    .superRefine(validateUniqueQuestionIds),
});

export type DraftSchema = z.infer<typeof draftSchema>;
export type DraftSchemaInput = Pick<DraftSchema, "title" | "description" | "sections">;
