import { z } from "zod";

const baseQuestionSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "schemaBuilder.validationQuestionNoTitle"),
  required: z.boolean().default(false),
});

const textQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(["short_answer", "paragraph", "time", "date"]),
});

const choiceQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(["radio", "checkbox", "dropdown"]),
  options: z.object({
    choices: z
      .array(z.string().trim().min(1, "schemaBuilder.validationEmptyChoice"))
      .min(1, "schemaBuilder.validationNoChoices"),
  }),
});

const scaleQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("linear_scale"),
  options: z.object({
    min: z.number().int().min(0).max(1),
    max: z.number().int().min(5).max(10),
  }),
});

const tableQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(["radio_grid", "checkbox_grid"]),
  options: z.object({
    choices: z
      .array(z.string().trim().min(1, "schemaBuilder.validationEmptyGridCol"))
      .min(1, "schemaBuilder.validationNoGridCols"),
    rows: z
      .array(z.string().trim().min(1, "schemaBuilder.validationEmptyGridRow"))
      .min(1, "schemaBuilder.validationNoGridRows"),
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
    .min(1, "schemaBuilder.validationNoSections"),
});

export type Ischema = z.infer<typeof schemaSchema>;

export type SchemaInput = Pick<Ischema, "title" | "description" | "sections">;

export type QuestionType = IQuestion["type"];

export const questionTypes: QuestionType[] = [
  "short_answer",
  "paragraph",
  "time",
  "date",
  "radio",
  "checkbox",
  "dropdown",
  "linear_scale",
  "radio_grid",
  "checkbox_grid",
];