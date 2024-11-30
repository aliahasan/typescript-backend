import StatusCodes from 'http-status-codes';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StudentService } from './student.service';

const getAllStudents = tryCatchAsync(async (req, res) => {
  const result = await StudentService.getAllStudents();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Students retrieved successfully',
    data: result,
  });
});

const getSingleStudentById = tryCatchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentService.getSingleStudent(studentId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student retrieved successfully',
    data: result,
  });
});

const deleteStudent = tryCatchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentService.deleteStudentFromDB(studentId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  });
});
export const StudentController = {
  getAllStudents,
  getSingleStudentById,
  deleteStudent,
};
