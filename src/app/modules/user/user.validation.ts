import { z } from 'zod';
import { userStatus } from './user.constant';

const ZUserSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, 'message can not be more than 20 characters')
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...userStatus] as [string, ...string[]]),
  }),
});

export const userValidation = {
  ZUserSchema,
  changeStatusValidationSchema,
};
