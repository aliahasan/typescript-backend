import { Response } from 'express';

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data?.success,
    message: data?.message,
    data: data?.data,
  });
};

export default sendResponse;

// const flattenPayload = (
//   obj: Record<string, unknown>,
//   parentKey = '',
//   res: Record<string, unknown> = {},
// ) => {
//   for (const key in obj) {
//     const propertyName = parentKey ? `${parentKey}.${key}` : key;
//     if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
//       flattenPayload(obj[key] as Record<string, unknown>, propertyName, res);
//     } else {
//       res[propertyName] = obj[key];
//     }
//   }
//   return res;
// };

// const payload = {
//   name: {
//     firstName: 'Ali',
//     lastName: 'Nabin',
//   },
//   age: 25,
//   address: {
//     city: {
//       state: 'Dhaka',
//       country: 'Bangladesh',
//     },
//     zip: 2000,
//   },
// };

// const flattened = flattenPayload(payload);
// console.log(flattened);
