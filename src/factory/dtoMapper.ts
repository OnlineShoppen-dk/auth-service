import { User } from "@prisma/client";
import { UserDto } from "../dto/userDto";

export const mapUserToDto = (user: User): UserDto => {
    return {
      email: user.email,
      role: user.role,
    };
  };