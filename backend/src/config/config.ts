import envSchema from "env-schema";
import { z } from "zod";

const schema = z.object({
  PORT: z.number().default(3000),
  MONGO_URI: z.string().default("mongodb://localhost:27017/forms"),
  INSTANCE_MODEL_NAME: z.string().default("instances"),
  SCHEMA_MODEL_NAME: z.string().default("schemas"),
});
type Config = z.infer<typeof schema>;

export const config = envSchema<Config>({
  schema: z.toJSONSchema(schema, { target: "draft-07" }),
  dotenv: true,
});
