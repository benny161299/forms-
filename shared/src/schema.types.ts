import { z } from 'zod';

export const questionTypeSchema = z.enum([
  "text", "short_answer", "paragraph", "radio", "checkbox", 
  "dropdown", "linear_scale", "radio_grid", "checkbox_grid", "time", "date"
]);

export type QuestionType = z.infer<typeof questionTypeSchema>;

export const questionOptionsSchema = z.object({
  choices: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  rows: z.array(z.string()).optional()
});

export type IQuestionOptions = z.infer<typeof questionOptionsSchema>;

export const questionSchema = z.object({
  id: z.string(),
  type: questionTypeSchema,
  title: z.string(),
  required: z.boolean(),
  options: questionOptionsSchema.optional()
});

export type IQuestion = z.infer<typeof questionSchema>;

export const sectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema)
});

export type ISection = z.infer<typeof sectionSchema>;

export const schemaSchema = z.object({
  _id: z.string(),
  title: z.string(),
  isDraft: z.boolean(),
  sections: z.array(sectionSchema)
});

export type Ischema = z.infer<typeof schemaSchema>;

