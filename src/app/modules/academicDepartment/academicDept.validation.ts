import { z } from 'zod';

const academicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic department must be a string',
      required_error: 'Name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic faculty must be a string',
      required_error: 'Academic faculty is required',
    }),
  }),
});

const updateAcademicDepartmentSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic department must be a string',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic faculty must be a string',
      })
      .optional(),
  }),
});

export const academicDepartmentValidation = {
  academicDepartmentValidationSchema,
  updateAcademicDepartmentSchema,
};
