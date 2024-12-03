import httpStatus from 'http-status-codes';
import { model, Schema } from 'mongoose';
import AppError from '../../errors/AppError';
import { TAcademicDepartment } from './academicDept.interface';
const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExists = await AcademicDepartment.findOne({
    name: this.name,
    academicFaculty: this.academicFaculty,
  });
  if (isDepartmentExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Academic department with the same name already exists.',
    );
  }
  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const document = await AcademicDepartment.findOne(query);
  if (!document) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found.');
  }
  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
