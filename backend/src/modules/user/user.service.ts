import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '@config/index';
import prisma from 'shared/prisma/client';
//import { User } from '@user/user.interface';
//import ApiError from '@common/errors/ApiError';
//import httpStatus from 'http-status';

type loginInput = {
  email: string,
  password: string,
}

type loginSuccess = {
  success: true;
  status: 200;
  message: string;
  data: {
    user: {
      id: string,
      email: string,
    },
    accessToken: string,
    refreshToken: string,
  }
}

type loginError = {
  success: false;
  status: 401 | 404,
  message: string,
}

type loginResult = loginSuccess | loginError;

export const loginUser = async ({ email, password }: loginInput): Promise<loginResult> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    }
  });

  if (!user) {
    return {
      success: false,
      status: 404,
      message: "Invalid email or password",
    }
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return {
      success: false,
      status: 401,
      message: "Invalid Password"
    };
  };


  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    config.jwt.accessSecret,
    {
      expiresIn: config.jwt.accessExpiration
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiration
    }
  );

  return {
    success: true,
    status: 200,
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        email: user.email
      },
      accessToken,
      refreshToken
    }
  }
}