/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import config from '../config';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student/student.interface';
const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'firstName is required'],
    trim: true,
    minlength: [3, 'First name should be at least 3 characters long'],
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, 'last name is required'],
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: true,
  },
  fatherOccupation: {
    type: String,
    required: true,
  },
  fatherContactNumber: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  motherOccupation: {
    type: String,
    required: true,
  },
  motherContactNumber: {
    type: String,
    required: true,
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

// created schema
const studentSchema = new Schema<TStudent, StudentModel>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: userNameSchema,
    required: true,
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not a valid gender',
    },
  },
  dateOfBirth: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  contactNumber: {
    type: String,
    required: true,
  },
  emergencyContactNo: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  presentAddress: {
    type: String,
    required: true,
  },
  permanentAddress: {
    type: String,
    required: true,
  },
  guardians: {
    type: guardianSchema,
    required: true,
  },
  localGuardians: {
    type: localGuardianSchema,
    required: true,
  },
  profileImage: {
    type: String,
  },
  iaActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// ---------------------------------------------------------------
// pre save middleware /hooks
studentSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});
//---------------------------------------------------------------
// post middleware /hooks
studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// ---------------------------------------------------------------

// query middleware /hooks
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//---------------------------------------------------------
// creating custom statics methods
studentSchema.statics.isStudentExist = async function (id: string) {
  const existingStudent = await Student.findOne({ id });
  return existingStudent;
};
// below we have created  the mongoose instance methods

// studentSchema.methods.isStudentExist = async function (id: string) {
//   const existingStudent = await Student.findOne({ id });
//   return existingStudent;
// };
// creating a model
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
