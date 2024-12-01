import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import User from './user.model';

const findLastStudent = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
  const result = lastStudent?.id ? lastStudent.id.substring(6) : undefined;
  return result;
};

//  create id dynamically
export const generatedStudentId = async (payload: TAcademicSemester) => {
  // first time 0000
  const currentId = (await findLastStudent()) || (0).toString();
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};
