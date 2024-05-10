import { Request, Response } from "express";
import { User } from "@prisma/client";
import { UserDto } from "../dto/userDto";
import { mapUserToDto } from "../factory/dtoMapper";
import { formatErrorMessage, validateUser } from "../schema/user";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";
import { UserRequest } from "../middleware/jwtMiddleware";
import { sendToQueue } from "../config/amqp";
import * as os from "os";

const hostname = os.hostname();

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
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
        guid: user.guid,
      },
    });

    const userDto: UserDto = mapUserToDto(registeredUser);
    sendToQueue(userDto);
    return res.status(200).send({
      msg: "User has been created succesfully",
      user_details: userDto,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const validatedUser = validateUser(user);

    if (validatedUser instanceof Error) {
      const errorMessage = formatErrorMessage(validatedUser.message);
      return res.status(400).send({ error: errorMessage });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (!existingUser) {
      return res.status(404).send({ msg: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).send({ msg: "Invalid password" });
    }

    const userDto: UserDto = mapUserToDto(existingUser);
    const accessToken = generateToken(existingUser.guid, "15m");
    const refreshToken = generateToken(existingUser.guid, "7d");

    res.cookie("token", accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 1000),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).send({
      msg: "User has been logged in succesfully",
      user_details: userDto
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  return res.status(200).send({ msg: "User has been logged out succesfully" });
};

export const checkCookies = async (req: Request, res: Response) => {
  res.send({
    cookies: {
      access_token: req.cookies.token,
      refresh_token: req.cookies.refreshToken,
    },
  });
};

export const host = async (req: Request, res: Response) => {
  res.send({ host: hostname });
};

export const authCheck = async (req: UserRequest, res: Response) => {
  try {
    const user_guid = req.user_guid;

    const user = await prisma.user.findUnique({
      where: {
        guid: user_guid,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDto: UserDto = mapUserToDto(user);

    return res.status(200).json({ user_details: userDto });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
