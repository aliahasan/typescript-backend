import { z } from 'zod';

const academicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic faculty must be a string',
    }),
  }),
});

const updateAcademicFacultySchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic faculty must be a string',
    }),
  }),
});

export const academicFacultyValidation = {
  academicFacultyValidationSchema,
  updateAcademicFacultySchema,
};
