import { Model } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNumber: string;
  motherName: string;
  motherOccupation: string;
  motherContactNumber: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};
export type TStudent = {
  id: string;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  email: string;
  password: string;
  dateOfBirth?: string;
  contactNumber: string;
  emergencyContactNo?: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardians: TGuardian;
  localGuardians: TLocalGuardian;
  profileImage: string;
  iaActive: 'active' | 'blocked';
  isDeleted: boolean;
};

// export type StudentMethods = {
//   isStudentExist(id: string): Promise<TStudent | null>;
// };

// export type StudentModel = Model<
//   TStudent,
//   //   {},
//   Record<string, unknown>,
//   StudentMethods
// >;

export interface StudentModel extends Model<TStudent> {
  isStudentExist(id: string): Promise<TStudent | null>;
}
