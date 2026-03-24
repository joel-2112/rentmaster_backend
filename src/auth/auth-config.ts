import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { emailOTP } from 'better-auth/plugins';

export const getAuthConfig = (prisma: PrismaService) => {
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        nationalId: {
          type: 'string',
          required: true,
          input: true, 
        },
        phone: {
          type: 'string',
          required: true,
          input: true,
        },
        role: {
          type: 'string',
          defaultValue: 'TENANT',
          required: true,
          input: true,
        },
        isVerified: {
          type: 'boolean',
          defaultValue: false,
          required: true,
        },
        emailVerified: {
          type: 'boolean', 
          defaultValue: false,
          required: true,
        },
        image: {
          type: 'string',
          required: false,
        },
      },
    },
    advanced: {
        disableOriginCheck: true,
      },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    plugins: [
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          console.log(`-----------------------------------------`);
          console.log(`ለኢሜይል: ${email} የተላከ OTP: ${otp}`);
          console.log(`ዓይነት: ${type}`);
          console.log(`-----------------------------------------`);
        },
      }),
    ],
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
  });
};
