import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

// type MongooseError = mongoose.Error.ValidationError | mongoose.Error.CastError
export const handleMongooseValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err?.errors)?.map(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: value?.path,
        message: value?.message,
      };
    },
  );
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation error',
    errorSources,
  };
};
