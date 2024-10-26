import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    JWT_SECRET: z.string().min(1),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error(' Invalid environment variables:', env.error.flatten());
    process.exit(1);
}

export const config = env.data;

