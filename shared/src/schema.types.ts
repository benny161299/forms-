import { z } from 'zod';

const textQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  required: z.boolean(),
  type: z.enum(["short_answer", "paragraph", "time", "date"]),
});


const choiceQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  required: z.boolean(),
  type: z.enum(["radio", "checkbox", "dropdown"]),
  options: z.object({
    choices: z.array(z.string()) 
  })
});


const scaleQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  required: z.boolean(),
  type: z.literal("linear_scale"),
  options: z.object({
    min: z.number().int().min(0).max(1),
    max: z.number().int().min(5).max(10)
  })
});


const tableQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  required: z.boolean(),
  type: z.enum(["radio_grid", "checkbox_grid"]),
  options: z.object({

    
    choices: z.array(z.string()),
    rows: z.array(z.string())
  })
});


export const questionSchema = z.discriminatedUnion('type', [
  textQuestionSchema,
  choiceQuestionSchema,
  scaleQuestionSchema,
  tableQuestionSchema
]);

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