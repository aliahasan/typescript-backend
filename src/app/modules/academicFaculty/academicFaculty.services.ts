import { TAcademicFaculty } from './academicFaculty.interface';
import AcademicFaculty from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};

const getAllAcademicFaculties = async () => {
  const result = await AcademicFaculty.find();
  return result;
};

const getSingleAcademicFacultyById = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  return result;
};

const updateAcademicSemesterById = async (
  id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFaculties,
  getSingleAcademicFacultyById,
  updateAcademicSemesterById,
};
