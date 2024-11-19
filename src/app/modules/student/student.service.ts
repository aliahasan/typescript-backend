import { Student } from '../student.model';
import { TStudent } from './student.interface';

const createStudentToDB = async (studentData: TStudent) => {
  if (await Student.isStudentExist(studentData.id)) {
    throw new Error('Student already exists');
  }
  const result = await Student.create(studentData);
  return result;
  //built in static method
  //   const student = new Student(studentData);
  //   my created instance
  //   if (await student.isStudentExist(studentData.id)) {
  //     throw new Error('Student already exists');
  //   }
  //   const result = await student.save(); //built instance  method
  //   return result;
  // };
};

const getAllStudents = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudent = async (id: string) => {
  //   const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentService = {
  createStudentToDB,
  getAllStudents,
  getSingleStudent,
  deleteStudentFromDB,
};
