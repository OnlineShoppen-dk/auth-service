import { User } from "@prisma/client";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const validateUser = (user: User) => {
  try {
    const validatedData = userSchema.parse(user);
    return validatedData;
  } catch (error) {
    return error;
  }
};

export const formatErrorMessage = (errorMessage: string) => {
    try {
      const errorData = JSON.parse(errorMessage);
      const errorMessages = errorData.map((error: any) => {
        return `Field '${error.path.join(".")}' ${error.message}`;
      });
      return errorMessages.join(", ");
    } catch (error) {
      return errorMessage;
    }
  };
  