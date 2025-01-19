import httpStatus from 'http-status-codes';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StudentService } from './student.service';

const getAllStudents = tryCatchAsync(async (req, res) => {
  const result = await StudentService.getAllStudents(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleStudentById = tryCatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.getSingleStudent(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully',
    data: result,
  });
});

//update student
const updateStudent = tryCatchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentService.updateStudentById(id, student);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
});

// delete student
const deleteStudent = tryCatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.deleteStudentFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  });
});
export const StudentController = {
  getAllStudents,
  getSingleStudentById,
  updateStudent,
  deleteStudent,
};
