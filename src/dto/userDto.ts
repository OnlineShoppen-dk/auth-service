import { User } from "@prisma/client";

export interface UserDto {
    email: string;
    role: string;
}