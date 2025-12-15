import { z } from 'zod';

const configSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

const getConfig = () => {
  if (typeof window === 'undefined') {
    // Server-side validation
    const parsed = configSchema.safeParse(process.env);

    if (!parsed.success) {
      console.error(
        '❌ Invalid environment variables:',
        parsed.error.flatten().fieldErrors
      );
      throw new Error('Invalid environment variables');
    }
    return parsed.data;
  } else {
    // Client-side: we can't validate server-only vars like MONGODB_URI
    // So we return a partial or mocked config, or just the public ones.
    // For now, let's assume this config is primarily for server-side usage.
    // If used in client, we might face issues if we expect MONGODB_URI.
    // But MONGODB_URI should not be leaked.
    // So this file should probably be server-only or handle separation.
    
    // We will parse what we can.
    const publicSchema = configSchema.pick({ NEXT_PUBLIC_SITE_URL: true });
    const parsed = publicSchema.safeParse({
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
    });
    if (!parsed.success) {
        console.error('❌ Invalid public environment variables:', parsed.error.flatten().fieldErrors);
    }
     // We return a type that matches the full config but MONGODB_URI will be undefined/empty string on client
     // which implies this config object shouldn't be used for DB on client.
     return {
         ...parsed.data,
         MONGODB_URI: ''
     } as z.infer<typeof configSchema>;
  }
};

export const config = getConfig();
