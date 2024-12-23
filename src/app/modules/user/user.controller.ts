import httpStatus from 'http-status-codes';
import tryCatchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.services';

// create student
const handleCreateStudent = tryCatchAsync(async (req, res) => {
  const { student: studentData, password } = req.body;
  const result = await UserServices.createStudentToDB(password, studentData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

// create faculty
const handleCreateFaculty = tryCatchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;
  const result = await UserServices.createFacultyIntoDB(password, facultyData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  });
});

// create admin
const handleCreateAdmin = tryCatchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});

//get me
const handleGetMe = tryCatchAsync(async (req, res) => {
  const result = await UserServices.getMe(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});
const handleChangeStatus = tryCatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.changeStatus(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status changed  successfully',
    data: result,
  });
});

export const UserControllers = {
  handleCreateStudent,
  handleCreateFaculty,
  handleCreateAdmin,
  handleGetMe,
  handleChangeStatus,
};
