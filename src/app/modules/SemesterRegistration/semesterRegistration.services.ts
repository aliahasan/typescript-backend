/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import QueryBuilder from '../../Builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model';
import { RegistrationStatus } from './semesterRegistration.constant';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  //   check if there any registered semester that is already "UPCOMING" | "ONGOING"
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} semester registered!`,
    );
  }

  //   check if the semester exists
  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'This academic semester not found',
    );
  }

  //   check is semester already registered
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'This Semester already registered',
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semesterRegistrationQuery.queryModel;
  return result;
};

// get single semester registration
const getSingleSemesterRegistrationById = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

// update semester registration
const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  //  check is the requested registration is exist
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This Semester is not found');
  }

  // if the requested semester registration is ended , we will not update anything
  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'This Semester is ended, you can not update it',
    );
  }

  //   upcoming --> ongoing---> ended
  const requestedSemesterStatus = payload?.status;
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedSemesterStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      `You can not directly change the status from ${currentSemesterStatus} to ${requestedSemesterStatus}`,
    );
  }
  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedSemesterStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      `You can not directly change the status from ${currentSemesterStatus} to ${requestedSemesterStatus}`,
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistration = async (id: string) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This Semester is not found');
  }

  const semesterRegistrationStatus = isSemesterRegistrationExists?.status;
  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      `You can not delete this Semester, it is ${isSemesterRegistrationExists?.status}`,
    );
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deleteOfferedCourse = await OfferedCourse.deleteMany(
      { semesterRegistration: id },
      { session },
    );
    if (!deleteOfferedCourse) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to delete semester registration',
      );
    }

    const deletedSemesterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, { session });
    if (!deletedSemesterRegistration) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to delete semester registration',
      );
    }

    await session.commitTransaction();
    return null;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationById,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistration,
};
