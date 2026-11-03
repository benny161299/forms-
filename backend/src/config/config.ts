import envSchema from "env-schema";
import { z } from "zod";

const envJsonSchema = z.object({
  PORT: z.number().default(3000),
  MONGO_URI: z.string().default("mongodb://localhost:27017/forms"),
  INSTANCE_MODEL_NAME: z.string().default("instances"),
  SCHEMA_MODEL_NAME: z.string().default("schemas"),
  FRONTEND_ORIGIN: z.string().min(1).default("http://localhost:5173"),
});
type RawConfig = z.infer<typeof envJsonSchema>;

const rawConfig = envSchema<RawConfig>({
  schema: z.toJSONSchema(envJsonSchema, { target: "draft-07" }),
  dotenv: true,
});

const originSchema = z
  .url({
    protocol: /^https?$/,
    message: "Origin must be a valid URL with http:// or https:// protocol",
  })
  .transform((val) => new URL(val).origin);

const frontendOriginsSchema = z
  .string()
  .transform((val) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  )
  .pipe(z.array(originSchema).min(1, "At least one frontend origin must be provided"));

export const config = {
  ...rawConfig,
  FRONTEND_ORIGIN: frontendOriginsSchema.parse(rawConfig.FRONTEND_ORIGIN),
};
