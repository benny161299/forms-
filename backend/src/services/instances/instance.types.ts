import { z } from "zod";

const mongoId = z.string().regex(/^[0-9a-fA-F]{24}$/);
export const answerValueSchema = z.union([
  z.string(),
  z.number(),
  z.array(z.string()),
  z.record(z.string(), z.number()),
  z.record(z.string(), z.array(z.number())),
]);

export type AnswerValue = z.infer<typeof answerValueSchema>;

export const instanceSchema = z.object({
  _id: mongoId.optional(),
  schemaId: mongoId,
  isDraft: z.boolean(),
  answers: z.record(z.uuid(), answerValueSchema),
});

export type IInstance = z.infer<typeof instanceSchema>;
export type CreateInstanceInput = Pick<IInstance, "schemaId">;
export type UpdateInstanceInput = Pick<IInstance, "answers">;