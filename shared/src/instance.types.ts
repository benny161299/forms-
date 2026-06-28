import { z } from 'zod';

export const answerValueSchema = z.union([
  z.string(),
  z.number(),
  z.array(z.string()),
  z.record(z.string(), z.number()),
  z.record(z.string(), z.array(z.number()))
]);

export type AnswerValue = z.infer<typeof answerValueSchema>;


export const instanceSchema = z.object({
  _id: z.string(),
  schemaId: z.string(),
  isDraft: z.boolean(),
  answers: z.record(z.string(), answerValueSchema)
});

export type IInstance = z.infer<typeof instanceSchema>;