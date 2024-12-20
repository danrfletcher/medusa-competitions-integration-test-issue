import { MedusaError } from "@medusajs/framework/utils";

export const getErrorStatusCode = (errorType: string): number => {
  switch (errorType) {
    case MedusaError.Types.UNAUTHORIZED:
      return 401;
    case MedusaError.Types.NOT_FOUND:
      return 404;
    case MedusaError.Types.INVALID_DATA:
      return 400;
    case MedusaError.Types.CONFLICT:
      return 409;
    case MedusaError.Types.UNEXPECTED_STATE:
    default:
      return 500;
  }
};
