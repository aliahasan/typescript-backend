import { model, Schema } from 'mongoose';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
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
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      unique: true,
      ref: 'User',
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
      required: true,
    },
    dateOfBirth: Date,
    email: {
      type: String,
      required: true,
      unique: true,
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
    admissionSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

//-----------------------------------------------------------
// apply virtuals
studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// ---------------------------------------------------------------
// pre save middleware /hooks
// studentSchema.pre('save', async function (next) {
//   const user = this;
//   user.password = await bcrypt.hash(
//     user.password,
//     Number(config.bcrypt_salt_rounds),
//   );
//   next();
// });
// //---------------------------------------------------------------
// // post middleware /hooks
// studentSchema.post('save', function (doc, next) {
//   doc.password = '';
//   next();
// });

// ---------------------------------------------------------------

// query middleware /hooks
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
//---------------------------------------------------------
// creating custom statics methods
studentSchema.statics.isStudentExist = async function (id: string) {
  const existingStudent = await this.findOne({ id });
  return existingStudent;
};

// below we have created  the mongoose instance methods

// studentSchema.methods.isStudentExist = async function (id: string) {
//   const existingStudent = await Student.findOne({ id });
//   return existingStudent;
// };
// creating a model
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
