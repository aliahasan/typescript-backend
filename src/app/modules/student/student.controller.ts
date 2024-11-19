import { Request, Response } from 'express';
import { StudentService } from './student.service';
import { studentSchema } from './student.validation';

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    //  creating a schema validation using zod
    const zodParsedData = studentSchema.parse(studentData);

    const result = await StudentService.createStudentToDB(zodParsedData);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'something went wrong',
      error: error,
    });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentService.getAllStudents();
    res.status(200).json({
      success: true,
      message: 'Students are retrieved successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'something went wrong',
      error: error,
    });
  }
};

export const getSingleStudentById = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.getSingleStudent(studentId);
    res.status(200).json({
      success: true,
      message: 'Student is retrieved successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'something went wrong',
      error: error,
    });
  }
};
