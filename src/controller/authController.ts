import { Request, Response } from "express";
import { User } from "@prisma/client";
import { UserDto } from "../dto/userDto";
import { mapUserToDto } from "../factory/dtoMapper";
import { formatErrorMessage, validateUser } from "../schema/user";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const guid = randomUUID();
  try {
    const user: User = req.body;
    const validatedUser = validateUser(user);
    if (validatedUser instanceof Error) {
      const errorMessage = formatErrorMessage(validatedUser.message);
      return res.status(400).send({ error: errorMessage });
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (existingUser instanceof Error) {
      return res
        .status(409)
        .send({ msg: "An account already exists with this email" });
    }

    const registeredUser = await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        guid: guid,
      },
    });

    const userDto: UserDto = mapUserToDto(registeredUser);
    return res.status(200).send({msg: "User has been created succesfully", user_details: userDto});
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};
