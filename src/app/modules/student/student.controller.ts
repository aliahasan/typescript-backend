import StatusCodes from 'http-status-codes';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StudentService } from './student.service';

const getAllStudents = tryCatchAsync(async (req, res) => {
  const result = await StudentService.getAllStudents(req.query);

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

//update student
const updateStudent = tryCatchAsync(async (req, res) => {
  const { studentId } = req.params;
  const { student } = req.body;
  const result = await StudentService.updateStudentById(studentId, student);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
});

// delete student
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
  updateStudent,
  deleteStudent,
};
