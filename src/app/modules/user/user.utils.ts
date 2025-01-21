import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import User from './user.model';

const findLastStudentId = async (payload: string) => {
  //here payload is previous student year and code
  const lastStudent = await User.findOne(
    {
      $and: [{ role: 'student' }, { id: { $regex: payload, options: 'i' } }],
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastStudent?.id ? lastStudent.id : undefined;
};

//  create id dynamically
export const generatedStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();
  const query = `${payload?.year}${payload?.code}`;

  const lastStudentId = await findLastStudentId(query);

  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lastStudentYear = lastStudentId?.substring(0, 4);

  const currentSemesterCode = payload.code;
  const currentYear = payload.year;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastFaculty?.id ? lastFaculty?.id : null;
};

export const generateFacultyId = async () => {
  const lastFacultyId = await findLastFacultyId();
  let currentId = '0000';
  if (lastFacultyId) {
    currentId = lastFacultyId.split('-')[1];
  }
  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  return `F-${incrementId}`;
};

// Admin ID
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin?.id : null;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `A-${incrementId}`;
  return incrementId;
};

// export const findLastFacultyId = async () => {
//   const lastFaculty = await User.findOne(
//     { role: 'faculty' },
//     { id: 1, _id: 0 },
//   )
//     .sort({ createdAt: -1 })
//     .lean();

//   return lastFaculty?.id || null;
// };

// export const generateFacultyId = async () => {
//   let currentId = (0).toString();
//   const lastFacultyId = await findLastFacultyId();
//   if (lastFacultyId) {
//     currentId = lastFacultyId.substring(2);
//   }
//   let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
//   incrementId = `F-${incrementId}`;
//   return incrementId;
// };
