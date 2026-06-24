import envSchema from "env-schema";
import { z } from "zod";
const schema = z.object({
  PORT: z.number().default(3000),
  MONGO_URI: z.string().default("mongodb://localhost:27017/forms")
});

export const config = envSchema({
  schema: z.toJSONSchema(schema, { target: "draft-07" }),
  dotenv: true
}); 
