import envSchema from "env-schema";
const schema = {
    type: 'object',
    required: ['MONGO_URI', 'PORT'],
    properties: {
        PORT: {
            type: 'number',
            default: 3000,
        },
        MONGO_URI: {
            type: 'string',
        }
    }
}
export const config = envSchema<{ PORT: number; MONGO_URI: string }>({
  schema: schema,
  dotenv: true
});