import { z } from 'zod';

// UserName Schema
const userNameSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: 'First name should be at least 3 characters long' })
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      { message: 'First name must be in capitalized format' },
    ),
  middleName: z.string().optional(),
  lastName: z.string(),
});

// Guardian Schema
const guardianSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string({ message: 'Father occupation is required' }),
  fatherContactNumber: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNumber: z.string(),
});

// LocalGuardian Schema
const localGuardianSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

// Student Schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    student: z.object({
      name: userNameSchema,
      email: z.string().email({ message: 'Invalid email address' }),
      dateOfBirth: z.string().optional(),
      gender: z.enum(['male', 'female', 'other'], {
        message: 'Gender must be male, female, or other',
      }),
      contactNumber: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardians: guardianSchema,
      localGuardians: localGuardianSchema,
      profileImage: z.string(),
    }),
  }),
});
export const studentValidations = {
  createStudentValidationSchema,
};
